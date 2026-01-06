import os
import sqlite3
import datetime
import json

# --- CONFIGURATION ---
# User Provided Turso Credentials
TURSO_URL = os.environ.get("TURSO_DATABASE_URL", "libsql://phishguard-db-alok123321.aws-ap-south-1.turso.io")
TURSO_TOKEN = os.environ.get("TURSO_AUTH_TOKEN", "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njc0MTY1MDAsImlkIjoiNDdiMWRlMGMtOWU2MS00YWJlLTgzZmQtNDVkNTQ2YmM4NTI5IiwicmlkIjoiZDYwNmI3NzktN2VmYS00NjUwLTk3NmQtYTFmMTVlM2E2ODYwIn0.NYIYwj6beEp90tnR4zN6-nqy1rL5zllHrhcOTG_kDhk6EOD1WWLcjGX1Bh6RDlv_USeUfDUcm9mdyjkGRbaICg")

# Local Fallback
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCAL_DB_NAME = os.path.join(BASE_DIR, "backend", "phishguard.db")

class TursoCursor:
    """Wrapper to make Turso ResultSet behave like sqlite3 cursor"""
    def __init__(self, client):
        self.client = client
        self.rows = []
        self.row_factory = None
        self._last_rowid = None 
    
    def execute(self, sql, params=()):
        try:
            # libsql-client expects params as a tuple or list
            # We need to print for debugging
            # print(f"DEBUG: Executing {sql} with {params}")
            
            rs = self.client.execute(sql, params)
            self.rows = rs.rows
            self._last_rowid = rs.last_insert_rowid
            return self
        except Exception as e:
            print(f"❌ Turso Query Error: {e}")
            raise e

    def fetchall(self):
        # Convert libsql rows (Row objects) to dicts if row_factory is set
        if self.row_factory == sqlite3.Row:
            return [dict(zip(row.keys(), row)) for row in self.rows]
        
        # Default: list of tuples
        return [tuple(row) for row in self.rows]

    def fetchone(self):
        if not self.rows:
            return None
        row = self.rows[0]
        if self.row_factory == sqlite3.Row:
            return dict(zip(row.keys(), row))
        return tuple(row)
    
    @property
    def lastrowid(self):
        return self._last_rowid
    
    def close(self):
        pass 

class TursoConnection:
    """Wrapper to make Turso Client behave like sqlite3 connection"""
    def __init__(self, client):
        self.client = client
        self.row_factory = None

    def cursor(self):
        cur = TursoCursor(self.client)
        cur.row_factory = self.row_factory
        return cur

    def commit(self):
        # Turso HTTP client is auto-commit for single statements usually
        pass

    def close(self):
        self.client.close()

def get_db_connection():
    # 1. Try connecting to Turso
    try:
        import libsql_client
        # Ensure we have a valid URL (not local file for Turso client)
        if "libsql://" in TURSO_URL or "https://" in TURSO_URL:
            # print(f"🔌 Connecting to Turso: {TURSO_URL}")
            client = libsql_client.create_client_sync(url=TURSO_URL, auth_token=TURSO_TOKEN)
            return TursoConnection(client)
    except ImportError:
        print("⚠️ libSQL Client not installed. Using Local SQLite.")
    except Exception as e:
        print(f"⚠️ Turso Connection Failed: {e}. Falling back to Local SQLite.")

    # 2. Fallback to Local SQLite (Development / Backup)
    print(f"📂 Using Local SQLite: {LOCAL_DB_NAME}")
    conn = sqlite3.connect(LOCAL_DB_NAME)
    return conn
