# File path: CryptIQ-Micro-Frontend/services/trading-service/price_anomaly_detection.py

import pandas as pd
import numpy as np

"""
Price Anomaly Detection Engine
"""

class PriceAnomalyDetectionEngine:
    def __init__(self, z_score_threshold: float = 2.5):
        self.z_score_threshold = z_score_threshold

    def detect_anomalies(self, data: pd.DataFrame):
        """
        Detect price anomalies using z-score analysis.
        """
        data['price_mean'] = data['close'].rolling(20).mean()
        data['price_std'] = data['close'].rolling(20).std()
        data['z_score'] = (data['close'] - data['price_mean']) / data['price_std']
        anomalies = data[abs(data['z_score']) > self.z_score_threshold]
        return anomalies

# Example usage
data = pd.DataFrame({'close': [100, 101, 102, 101, 99, 97, 105, 110, 108, 115, 120]})
engine = PriceAnomalyDetectionEngine(z_score_threshold=2.0)
print(engine.detect_anomalies(data))
