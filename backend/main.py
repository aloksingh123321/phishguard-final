from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime
import sys
import os
import json

# Ensure backend directory is in path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ml_engine.feature_extractor import extract_features

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

from backend.database import get_db_connection

# --- DATABASE SETUP ---
def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    # Create table with new schema if it doesn't exist
    c.execute('''CREATE TABLE IF NOT EXISTS scan_history 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  url TEXT, 
                  risk_level TEXT, 
                  status TEXT,
                  insights TEXT,
                  timestamp DATETIME)''')
    
    # Check if 'insights' column exists (Migration Logic)
    try:
        c.execute("SELECT insights FROM scan_history LIMIT 1")
    except sqlite3.OperationalError:
        print("⚠️ Migrating Database: Adding 'insights' column...")
        try:
            c.execute("ALTER TABLE scan_history ADD COLUMN insights TEXT")
            print("✅ Migration Successful: 'insights' column added.")
        except Exception as e:
            print(f"❌ Migration Failed: {e}")
            
    conn.commit()
    conn.close()

init_db()

# --- ROUTES ---

@app.route('/api/scan', methods=['POST'])
def scan_url():
    data = request.json
    url = data.get('url', '')
    
    # 1. Logic Run
    # extract_features returns a DICT with 'risk_level', 'status', 'insights'
    result = extract_features(url, html_content="") 
    
    # 2. Database Save
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        # Convert insights list to JSON string for storage
        insights_json = json.dumps(result.get('insights', []))
        
        c.execute("INSERT INTO scan_history (url, risk_level, status, insights, timestamp) VALUES (?, ?, ?, ?, ?)",
                  (url, result['risk_level'], result['status'], insights_json, datetime.datetime.now()))
        conn.commit()
        conn.close()
    except Exception as e:
        print("Database Error:", e)

    return jsonify(result)

@app.route('/api/history', methods=['GET'])
def get_history():
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    # Limit 500 for performance
    c.execute("SELECT * FROM scan_history ORDER BY id DESC LIMIT 500")
    
    # Process rows to convert insights string back to JSON
    rows = []
    for row in c.fetchall():
        item = dict(row)
        try:
            # Parse JSON string back to list, handle None/Null
            item['insights'] = json.loads(item['insights']) if item['insights'] else []
        except (json.JSONDecodeError, TypeError):
             item['insights'] = []
        rows.append(item)
        
    conn.close()
    return jsonify(rows)

@app.route('/api/admin/all-data', methods=['GET'])
def get_all_data():
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM scan_history ORDER BY id DESC")
    
    rows = []
    for row in c.fetchall():
        item = dict(row)
        try:
            item['insights'] = json.loads(item['insights']) if item['insights'] else []
        except (json.JSONDecodeError, TypeError):
             item['insights'] = []
        rows.append(item)
        
    conn.close()
    return jsonify(rows)

# Added Clear Logs for Admin Console compatibility
@app.route('/api/admin/clear-logs', methods=['DELETE'])
def clear_logs():
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("DELETE FROM scan_history")
        conn.commit()
        conn.close()
        return jsonify({"message": "Logs cleared successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 PhishGuard Flask Backend Running on Port {port}")
    app.run(host='0.0.0.0', port=port)
