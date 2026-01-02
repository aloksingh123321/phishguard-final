import sqlite3
import datetime

DB_NAME = "phishguard.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scan_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT,
            risk_level TEXT,
            timestamp DATETIME,
            status TEXT
        )
    """)
    conn.commit()
    conn.close()

def insert_scan(url, risk_level, status):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    # Format timestamp for consistency
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("""
        INSERT INTO scan_history (url, risk_level, timestamp, status)
        VALUES (?, ?, ?, ?)
    """, (url, risk_level, timestamp, status))
    conn.commit()
    conn.close()

def get_history(limit=500):
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row # Access columns by name
    cursor = conn.cursor()
    
    # Strict Limit to prevent frontend crash
    cursor.execute("""
        SELECT id, url, risk_level, timestamp, status 
        FROM scan_history 
        ORDER BY timestamp DESC 
        LIMIT ?
    """, (limit,))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

def get_all_history():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scan_history ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def clear_history():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM scan_history")
    conn.commit()
    conn.close()

def get_stats():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM scan_history")
    total = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM scan_history WHERE risk_level IN ('High', 'CRITICAL')")
    high_risk = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM scan_history WHERE status = 'VERIFIED'")
    verified = cursor.fetchone()[0]
    
    conn.close()
    return {"total": total, "high_risk": high_risk, "verified": verified}
