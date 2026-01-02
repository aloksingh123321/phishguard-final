# setup_env.ps1
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Write-Host "Virtual environment setup complete."
