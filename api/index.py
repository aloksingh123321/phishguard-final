from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime
import sys
import os
import json

# Refactored for Vercel: Add Root to Path so we can import 'backend' module
# Current file: /api/index.py -> Parent: /api -> Root: /
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import from backend folder
from backend.ml_engine.feature_extractor import extract_features

app = Flask(__name__)
CORS(app)

# Use /tmp for Vercel (Serverless is read-only except /tmp)
# For local dev, we can fallback to local dir
if os.environ.get('VERCEL'):
    DB_NAME = "/tmp/phishguard.db"
else:
    DB_NAME = "phishguard.db"

# --- DATABASE SETUP ---
def init_db():
    conn = sqlite3.connect(DB_NAME)
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

# Initialize DB on start (Note: In Vercel, this runs on every function cold start)
init_db()

# --- ROUTES ---

@app.route('/api/scan', methods=['POST'])
@app.route('/scan', methods=['POST']) # Aliasing for compatibility
def scan_url():
    data = request.json
    url = data.get('url', '')
    
    result = extract_features(url, html_content="") 
    
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        insights_json = json.dumps(result.get('insights', []))
        c.execute("INSERT INTO scan_history (url, risk_level, status, insights, timestamp) VALUES (?, ?, ?, ?, ?)",
                  (url, result['risk_level'], result['status'], insights_json, datetime.datetime.now()))
        conn.commit()
        conn.close()
    except Exception as e:
        print("Database Error:", e)

    return jsonify(result)

@app.route('/api/history', methods=['GET'])
@app.route('/history', methods=['GET'])
def get_history():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM scan_history ORDER BY id DESC LIMIT 500")
    
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

@app.route('/api/admin/all-data', methods=['GET'])
def get_all_data():
    conn = sqlite3.connect(DB_NAME)
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

@app.route('/api/admin/clear-logs', methods=['DELETE'])
def clear_logs():
    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute("DELETE FROM scan_history")
        conn.commit()
        conn.close()
        return jsonify({"message": "Logs cleared successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Vercel requires the 'app' object to be exposed.
# We do NOT use app.run() here because Vercel manages the WSGI server.
# The app object defined above (line 16) is what Vercel looks for.
