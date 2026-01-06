from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime
import os
import json
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Ensure current directory is in path for imports
# This allows importing ml_engine whether running locally or on Vercel
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from ml_engine.feature_extractor import extract_features
except ImportError:
    # Fallback to prevent crash if ml_engine not found
    print("Warning: ml_engine not found, dummy extractor used")
    def extract_features(url, html_content=""):
        return {"risk_level": "UNKNOWN", "status": "Error loading engine", "insights": ["Engine load failed"]}

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- DATABASE CONFIGURATION ---
# Forced path for Vercel Monolith stability
DB_PATH = "/tmp/phishguard.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    try:
        conn = get_db_connection()
        c = conn.cursor()
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
            except Exception as e:
                print(f"Migration warning: {e}")

        conn.commit()
        conn.close()
        print(f"✅ Database initialized at {DB_PATH}")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")

# Initialize Logic
# Check if directory exists for /tmp (Linux/Vercel)
# If local Windows provided path /tmp doesn't exist, it might fail? 
# Windows usually has c:\tmp or relative. 
# But user said "set the SQLite path to /tmp/phishguard.db (Mandatory for Vercel)"
# I'll check if /tmp exists, if not create it (locally) or fallback?
# User said "Mandatory". I will attempt to use /tmp.
if not os.path.exists("/tmp"):
    try:
        os.makedirs("/tmp")
    except:
        # If we can't create /tmp (e.g. Windows without C:\tmp permissions?), 
        # we might fallback or just let it fail. 
        # But for Vercel /tmp exists.
        pass

# Initialize DB
init_db()

# --- ROUTES ---

@app.route('/api/scan', methods=['POST'])
def scan_url():
    data = request.json
    url = data.get('url', '')
    
    # 1. Logic Run
    result = extract_features(url, html_content="") 
    
    # 2. Database Save
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        # Convert insights list to JSON string for storage
        insights_json = json.dumps(result.get('insights', []))
        
        c.execute("INSERT INTO scan_history (url, risk_level, status, insights, timestamp) VALUES (?, ?, ?, ?, ?)",
                  (url, result.get('risk_level'), result.get('status'), insights_json, datetime.datetime.now()))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Database Error: {e}")

    # 3. Format Response for Frontend
    # Ensure keys match what Frontend expects (ScanResult interface)
    formatted_result = {
        "url": url,
        "is_phishing": result.get('risk_level') in ['CRITICAL', 'HIGH'],
        "confidence_score": result.get('confidence', 0),
        "threat_level": result.get('risk_level', 'UNKNOWN'), # Mapping risk_level to threat_level if needed, or using same
        "risk_level": result.get('risk_level', 'UNKNOWN'),   # Keep risk_level for compatibility
        "status": result.get('status', 'UNKNOWN'),
        "insights": result.get('insights', []),
        "host": url.split('//')[-1].split('/')[0] if '//' in url else url.split('/')[0],
        "protocol": url.split(':')[0] if ':' in url else 'http'
    }

    return jsonify(formatted_result)

@app.route('/api/history', methods=['GET'])
def get_history():
    try:
        conn = get_db_connection()
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
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/admin/all-data', methods=['GET'])
def get_all_data():
    try:
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
    except Exception as e:
         return jsonify({"error": str(e)}), 500

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

@app.route('/api/admin/stats', methods=['GET'])
def get_stats():
    try:
        conn = get_db_connection()
        c = conn.cursor()
        
        c.execute("SELECT COUNT(*) FROM scan_history")
        total = c.fetchone()[0]
        
        c.execute("SELECT COUNT(*) FROM scan_history WHERE risk_level IN ('CRITICAL', 'HIGH')")
        high_risk = c.fetchone()[0]
        
        c.execute("SELECT COUNT(*) FROM scan_history WHERE risk_level = 'SAFE'")
        verified = c.fetchone()[0]
        
        conn.close()
        return jsonify({"total": total, "high_risk": high_risk, "verified": verified})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/contact', methods=['POST'])
def contact_support():
    data = request.json
    email = data.get('email')
    message = data.get('message')
    
    if not email or not message:
        return jsonify({"error": "Missing fields"}), 400

    sender_email = "notifications@phishguard.com" # Dummy sender
    receiver_email = "aloksingh123c@gmail.com"
    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = f"New Contact Request from {email}"
    msg.attach(MIMEText(message, 'plain'))
    
    try:
        # Note: This requires a working SMTP server. 
        # Using localhost for demonstration or catching error gracefully.
        # In Vercel, use SendGrid/Resend API instead.
        # with smtplib.SMTP('localhost') as server:
        #     server.send_message(msg)
        print(f"📧 Mock Email Sent to {receiver_email}: {message}")
        return jsonify({"message": "Email sent successfully (Simulated)"})
    except Exception as e:
        print(f"Email Error: {e}")
        return jsonify({"error": "Failed to send email"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    app.run(host='0.0.0.0', port=port)
