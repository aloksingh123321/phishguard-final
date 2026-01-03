
import os
import sys

# --- Vercel Path Correction ---
# Vercel serverless functions run from the root, but sometimes paths can be tricky.
# We ensure the root directory is in sys.path so 'backend' module is importable.
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
sys.path.append(root_dir)

# --- ML Model Path Fix ---
# If ML models are loaded using relative paths (e.g. 'ml_engine/model.pkl'), 
# running from /api/index.py vs /backend/main.py changes CWD.
# We set CWD to the backend folder or ensure absolute paths are used.
# However, modifying CWD can break other things. Better to patch paths if needed.
# For now, we just ensure python knows where to look.

from backend.main import app

# Vercel looks for a variable 'app' in this file.
# Since we imported 'app' from backend.main, it's exposed here.
