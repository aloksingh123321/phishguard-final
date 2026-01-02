import sys
import os

# Add the project root to sys.path so we can import backend.main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app

# Vercel needs the 'app' object
# (It automatically detects it if named 'app' or 'application')
