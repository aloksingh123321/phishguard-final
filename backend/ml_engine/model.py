from .feature_extractor import extract_features

class MockPhishingModel:
    def __init__(self):
        pass

    def predict(self, url: str) -> dict:
        """
        Passes the URL to the 5-layer heuristic engine and returns the result.
        """
        # In a real scenario, we might fetch HTML content here if using the 'login' detector
        html_content = "" 
        
        # Get result directly from the 5-layer heuristic engine
        result = extract_features(url, html_content)
        
        # Ensure the response matches the API schema
        return {
            "url": url,
            "is_phishing": result["risk_level"] in ["CRITICAL", "HIGH"],
            "confidence_score": result["confidence"],
            "risk_level": result["risk_level"],
            "status": result["status"],
            "insights": result["insights"]
        }
