import os
import sys

# Get the absolute path of the current directory (api/)
current_dir = os.path.dirname(os.path.abspath(__file__))

# Get the root directory (parent of api/)
root_dir = os.path.dirname(current_dir)

# Add the root directory to sys.path so we can import backend.main
if root_dir not in sys.path:
    sys.path.append(root_dir)

# Explicitly set the backend directory path for any model loading logic
# This ensures that even if CWD is slightly off, we can resolve paths relative to backend
backend_dir = os.path.join(root_dir, 'backend')
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

# Now import the Flask app
from backend.main import app

# This 'app' variable is what Vercel looks for as the entry point
