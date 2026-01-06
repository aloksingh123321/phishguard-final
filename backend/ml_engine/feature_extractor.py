import re
from urllib.parse import urlparse
import socket
import math
from difflib import SequenceMatcher

# --- CONFIGURATION: INTELLIGENCE LISTS ---

# 1. TRUSTED DOMAINS (The VIP List) - Returns SAFE immediately
TRUSTED_DOMAINS = {
    'linkedin.com', 'www.linkedin.com', 'github.com', 'google.com', 
    'facebook.com', 'instagram.com', 'twitter.com', 'x.com',
    'srmu.ac.in', 'amazon.in', 'amazon.com', 'microsoft.com', 
    'youtube.com', 'netflix.com', 'apple.com', 'stackoverflow.com',
    'paypal.com', 'dropbox.com', 'adobe.com', 'wordpress.com'
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
    'appspot.com', 'pages.dev', 'surge.sh', 'web.app', '000webhostapp.com'
}

# 4. CRITICAL KEYWORDS (Triggers RED even on dev platforms)
CRITICAL_KEYWORDS = [
    'update-bank', 'verify-account', 'free-gift', 'paypal-login', 
    'secure-login', 'account-blocked', 'crypto-giveaway', 'confirm-identity',
    'wallet-connect', 'signin-alert', 'login', 'signin', 'password',
    'phishing', 'malware', 'virus', 'hack', 'verify', 'update',
    'security-alert', 'unauthorized-access', 'reset-password'
]

# 5. HIGH VALUE BRANDS for Impersonation Checks
HIGH_VALUE_BRANDS = [
    'google', 'paypal', 'facebook', 'microsoft', 'apple', 'amazon', 
    'netflix', 'linkedin', 'instagram', 'twitter', 'dropbox', 'adobe'
]

def calculate_entropy(text):
    """Calculates the Shannon entropy of a string."""
    if not text:
        return 0
    entropy = 0
    for x in range(256):
        p_x = float(text.count(chr(x))) / len(text)
        if p_x > 0:
            entropy += - p_x * math.log(p_x, 2)
    return entropy

def normalize_domain(domain):
    """Normalizes l33t speak and homoglyphs to base characters."""
    # Simple substitution map for common spoofing practices
    subs = {
        '0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's', '7': 't', 
        '@': 'a', '$': 's', '!': 'i', 'z': 's' 
    }
    normalized = ""
    for char in domain:
        normalized += subs.get(char, char)
    return normalized

def check_brand_impersonation(domain, brands):
    """Checks for typosquatting/impersonation of high-value brands."""
    # Remove TLD for better matching
    domain_body = domain.split('.')[0]
    
    # 1. Normalize l33t speak (g00gle -> google)
    norm_body = normalize_domain(domain_body)

    for brand in brands:
        # Check against both raw and normalized
        # Direct containment
        if brand in domain and domain not in TRUSTED_DOMAINS and f"{brand}.com" not in domain:
             return brand, "Subdomain/Path Impersonation"
             
        # Levenshtein on Normalized Body
        if norm_body != brand:
            ratio = SequenceMatcher(None, norm_body, brand).ratio()
            # With normalization, we can enforce a high threshold (0.85) to avoid false positives
            if ratio > 0.85:
                return brand, f"Typosquatting Detected ({int(ratio*100)}% match with '{brand}')"
                
        # Levenshtein on Raw Body (for non-digit typos like 'gooogle')
        if domain_body != brand:
             ratio = SequenceMatcher(None, domain_body, brand).ratio()
             if ratio > 0.8: # Slightly lower threshold for pure typos
                  return brand, f"Typosquatting Detected ({int(ratio*100)}% match)"

    return None, None

def extract_features(url, html_content=""):
    """
    Enterprise-Grade Heuristic Engine
    Strictly follows Layered Priority: Trusted > Blacklist > Content > Heuristics > Dev Platform
    """
    try:
        # Prepend protocol if missing for proper parsing
        if not re.match(r'^[a-zA-Z]+://', url):
            url = 'http://' + url
            
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

    # --- LOGIC LAYER 3: ADVANCED HEURISTICS (ENTROPY & IMPERSONATION) ---
    
    # 3A. High Entropy Subdomains (Randomness Check)
    # Example: xy7z1a.example.com
    subdomains = domain.split('.')
    if len(subdomains) > 2:
        # Check the lowest level subdomain (first part)
        sub = subdomains[0]
        entropy = calculate_entropy(sub)
        if entropy > 3.5 and len(sub) > 5: # Thresholds: Entropy > 3.5 is usually random
             return {
                "risk_level": "HIGH",
                "confidence": 85,
                "status": "HIGH ENTROPY",
                "insights": [
                    f"🚨 Subdomain '{sub}' appears randomly generated (Entropy: {entropy:.2f}).",
                    "⚠️ High randomness often indicates algorithmic domain generation (DGA) used by botnets."
                ]
            }

    # 3B. Brand Impersonation (Typosquatting)
    target_brand, reason = check_brand_impersonation(domain, HIGH_VALUE_BRANDS)
    if target_brand:
         return {
            "risk_level": "CRITICAL",
            "confidence": 90,
            "status": "BRAND IMPERSONATION",
            "insights": [
                f"🚨 Potential impersonation of '{target_brand}'.",
                f"⚠️ Detection Reason: {reason}.",
                "⛔ Attackers often use slight misspellings to trick users."
            ]
        }

    # --- LOGIC LAYER 4: CRITICAL KEYWORDS (OVERRIDES CAUTION) ---
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

    # --- LOGIC LAYER 5: CONTEXTUAL CAUTION (DEV PLATFORMS) ---
    is_dev_platform = domain in DEV_PLATFORMS or any(domain.endswith("." + plat) for plat in DEV_PLATFORMS)
    
    if is_dev_platform:
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

    # --- LOGIC LAYER 6: CONTENT & DEFAULT ---
    
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
