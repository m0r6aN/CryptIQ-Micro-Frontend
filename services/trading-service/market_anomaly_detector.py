# File path: CryptIQ-Micro-Frontend/services/trading-service/market_anomaly_detector.py

import pandas as pd
from sklearn.ensemble import IsolationForest

"""
AI-Driven Market Anomaly Detector
"""

class MarketAnomalyDetector:
    def __init__(self, contamination: float = 0.05):
        self.model = IsolationForest(contamination=contamination)

    def detect_anomalies(self, data: pd.DataFrame):
        """
        Detects anomalies in the market data using Isolation Forest.
        """
        feature_data = data[['open', 'high', 'low', 'close', 'volume']]
        self.model.fit(feature_data)

        data['anomaly'] = self.model.predict(feature_data)
        return data[data['anomaly'] == -1]  # -1 indicates an anomaly

# Example usage
data = pd.DataFrame({
    'open': [100, 102, 104, 107, 110],
    'high': [105, 107, 109, 112, 115],
    'low': [98, 101, 103, 106, 108],
    'close': [102, 106, 108, 110, 112],
    'volume': [1500, 1600, 1700, 2000, 2500]
})
detector = MarketAnomalyDetector()
print(detector.detect_anomalies(data))
