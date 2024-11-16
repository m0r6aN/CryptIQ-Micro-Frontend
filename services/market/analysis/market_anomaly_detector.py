from transformers import pipeline

class AIBasedMarketAnomalyDetector:
    def __init__(self):
        self.anomaly_detector = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def detect_anomaly(self, market_description: str):
        anomaly = self.anomaly_detector(market_description, max_length=50, num_return_sequences=1)
        return anomaly[0]['generated_text']

detector = AIBasedMarketAnomalyDetector()
description = "Sudden surge in trading volume and unusual price movement detected in multiple altcoins."
print(f"Market Anomaly Detected: {detector.detect_anomaly(description)}")
