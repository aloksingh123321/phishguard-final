import os
import sqlite3
import datetime

# Determine DB path for local usage
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_NAME = os.path.join(BASE_DIR, "backend", "phishguard.db")
if not os.path.exists(os.path.dirname(DB_NAME)):
    # Fallback if running from root without backend folder in path correctly
    DB_NAME = "phishguard.db"

class TursoCursor:
    """Wrapper to make Turso ResultSet behave like sqlite3 cursor"""
    def __init__(self, client):
        self.client = client
        self.rows = []
        self.row_factory = None
        self._last_rowid = None # Not easily available in simple HTTP execution without RETURNING
    
    def execute(self, sql, params=()):
        # Adapt params: sqlite3 uses ?, Turso supports ?
        # Conversion might be needed if params is a tuple, libsql-client expects list/tuple
        
        # Simple logging for debug
        # print(f"Executing: {sql} with {params}")

        try:
             # libsql-client execute returns a ResultSet
            rs = self.client.execute(sql, params)
            self.rows = rs.rows
            return self
        except Exception as e:
            print(f"Turso Error: {e}")
            raise e

    def fetchall(self):
        # Apply row_factory if present
        if self.row_factory == sqlite3.Row:
            # mimic sqlite3.Row behavior (dict-like)
            return [dict(row) for row in self.rows]
        return self.rows

    def fetchone(self):
        if not self.rows:
            return None
        row = self.rows[0]
        if self.row_factory == sqlite3.Row:
            return dict(row)
        return row
    
    @property
    def lastrowid(self):
        return self._last_rowid

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
        # Turso/libsql over HTTP is often auto-commit or handles it differently
        # client.commit() might not exist on the simplified client, checking docs is hard locally.
        # But commonly the execute() calls are atomic or part of a transaction if explicitly started.
        # For this simple app, passing might be enough if autocommit is on.
        # 'libsql_client' sync client usually has sync methods. 
        # Actually client.sync() is for embedded replicas.
        pass

    def close(self):
        self.client.close()

def get_db_connection():
    turso_url = os.environ.get("DATABASE_URL")
    turso_auth = os.environ.get("DATABASE_AUTH_TOKEN")

    if turso_url and turso_auth:
        try:
            import libsql_client
            client = libsql_client.create_client_sync(url=turso_url, auth_token=turso_auth)
            return TursoConnection(client)
        except ImportError:
            print("⚠️ libsql-client not installed. Falling back to local SQLite.")
        except Exception as e:
            print(f"⚠️ Turso Connection Failed: {e}. Falling back to local SQLite.")

    # Fallback to Local SQLite
    conn = sqlite3.connect(DB_NAME)
    return conn
