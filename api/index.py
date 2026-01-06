import os
import sys

# Ensure backend directory is in the path
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
sys.path.append(root_dir)
sys.path.append(os.path.join(root_dir, 'backend'))

# --- VERCEL FIX: Override Database Path ---
# We must import backend.database BEFORE backend.main (which calls init_db)
# to ensure the database path is patched to /tmp (the only writable dir in Vercel)
try:
    import backend.database
    print("🚀 Vercel Deployment: Switching Database to /tmp/phishguard.db")
    backend.database.LOCAL_DB_NAME = "/tmp/phishguard.db"
except ImportError as e:
    print(f"⚠️ Could not patch database path: {e}")

from backend.main import app
