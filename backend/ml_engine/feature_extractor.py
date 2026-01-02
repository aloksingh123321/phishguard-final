import re
from urllib.parse import urlparse
import socket

# --- CONFIGURATION: INTELLIGENCE LISTS ---

# 1. TRUSTED DOMAINS (The VIP List) - Returns SAFE immediately
TRUSTED_DOMAINS = {
    'linkedin.com', 'www.linkedin.com', 'github.com', 'google.com', 
    'facebook.com', 'instagram.com', 'twitter.com', 'x.com',
    'srmu.ac.in', 'amazon.in', 'amazon.com', 'microsoft.com', 
    'youtube.com', 'netflix.com', 'apple.com', 'stackoverflow.com'
}

# 2. BLACKLIST URLS (Known Threats) - Returns CRITICAL immediately
BLACKLIST_URLS = {
    'testsafebrowsing.appspot.com', 'phishtank.com', 'openphish.com',
    'example.com/phishing', 'malware.testing.google.test'
}

# 3. DEV PLATFORMS (Suspicious/Caution) - Returns CAUTION unless keywords found
DEV_PLATFORMS = {
    'vercel.app', 'netlify.app', 'github.io', 'herokuapp.com', 
    'onrender.com', 'glitch.me', 'firebaseapp.com', 'repl.co', 
    'appspot.com', 'pages.dev', 'surge.sh'
}

# 4. CRITICAL KEYWORDS (Triggers RED even on dev platforms)
CRITICAL_KEYWORDS = [
    'update-bank', 'verify-account', 'free-gift', 'paypal-login', 
    'secure-login', 'account-blocked', 'crypto-giveaway', 'confirm-identity',
    'wallet-connect', 'signin-alert', 'login', 'signin', 'password',
    'phishing', 'malware', 'virus', 'hack', 'verify', 'update'
]

def extract_features(url, html_content=""):
    """
    Google-Level Heuristic Engine
    Strictly follows Layered Priority: Trusted > Blacklist > Keywords > Dev Platform > Content
    """
    try:
        parsed_url = urlparse(url)
        domain = parsed_url.netloc.lower()
        if domain.startswith("www."):
            domain = domain[4:]
        
        # Handle empty domain or invalid URL
        if not domain:
            return {
                "risk_level": "UNKNOWN",
                "confidence": 0,
                "status": "INVALID URL",
                "insights": ["🚨 Could not parse domain from URL."]
            }

    except Exception as e:
        return {
            "risk_level": "UNKNOWN",
            "confidence": 0,
            "status": "PARSING ERROR",
            "insights": [f"🚨 Error parsing URL: {str(e)}"]
        }
    
    # --- LOGIC LAYER 1: THE VIP PASS (TRUSTED) ---
    if domain in TRUSTED_DOMAINS:
        return {
            "risk_level": "SAFE",
            "confidence": 100,
            "status": "VERIFIED ENTITY",
            "insights": [f"✅ {domain} is a manually verified Trusted Entity.", "🔒 Uses Enterprise-Grade Security."]
        }

    # --- LOGIC LAYER 2: EXPLICIT THREATS (BLACKLIST & IP) ---
    # 2A. Blacklist Check
    if domain in BLACKLIST_URLS or url in BLACKLIST_URLS:
        return {
            "risk_level": "CRITICAL",
            "confidence": 100,
            "status": "KNOWN MALWARE",
            "insights": [f"🚨 {domain} is in the Global Blacklist.", "⛔ Known distributor of malware or phishing."]
        }
        
    # 2B. Raw IP Address Check
    if re.match(r"^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$", domain):
        return {
            "risk_level": "CRITICAL",
            "confidence": 95,
            "status": "SUSPICIOUS IP",
            "insights": ["🚨 URL uses a raw IP address instead of a domain.", "⚠️ Legitimate sites rarely use raw IPs."]
        }

    # --- LOGIC LAYER 3: CRITICAL KEYWORDS (OVERRIDES CAUTION) ---
    # Scans the full URL for triggering keywords
    found_keywords = [kw for kw in CRITICAL_KEYWORDS if kw in url.lower()]
    if found_keywords:
        return {
            "risk_level": "CRITICAL",
            "confidence": 90,
            "status": "THREAT PATTERN",
            "insights": [
                f"🚨 Detected high-risk keyword(s): '{', '.join(found_keywords)}'",
                "⛔ Phishing attacks often use these terms to induce panic or greed."
            ]
        }

    # --- LOGIC LAYER 4: CONTEXTUAL CAUTION (DEV PLATFORMS) ---
    is_dev_platform = domain in DEV_PLATFORMS or any(domain.endswith("." + plat) for plat in DEV_PLATFORMS)
    
    if is_dev_platform:
        # If we reached here, NO critical keywords were found (Layer 3 passed).
        return {
            "risk_level": "CAUTION",  # Yellow
            "confidence": 75,
            "status": "UNVERIFIED PROJECT",
            "insights": [
                f"⚠️ Hosted on a Developer Platform ({domain}).",
                "ℹ️ Could be a student project or a prototype.",
                "🛡️ No malicious keywords found, but proceed with care."
            ]
        }

    # --- LOGIC LAYER 5: CONTENT & DEFAULT ---
    
    # Content Check: Password input on unknown domain
    if "type=\"password\"" in html_content.lower():
         return {
            "risk_level": "HIGH",
            "confidence": 85,
            "status": "SUSPICIOUS FORM",
            "insights": ["🎣 Login form detected on an unknown/unverified domain.", "🔓 Do NOT enter your credentials here."]
        }

    # Default Safe-ish State
    return {
        "risk_level": "SAFE",
        "confidence": 60,
        "status": "GENERAL DOMAIN",
        "insights": [
            "✅ No immediate threats detected in URL analysis.", 
            "ℹ️ Domain is not in trusted list, but shows no red flags."
        ]
    }
