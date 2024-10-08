# File path: CryptIQ-Micro-Frontend/services/trading-service/historical_price_anomaly_detector.py

import pandas as pd
import numpy as np

"""
Historical Price Anomaly Detector
"""

class HistoricalPriceAnomalyDetector:
    def __init__(self, z_score_threshold: float = 3.0):
        self.z_score_threshold = z_score_threshold

    def detect_anomalies(self, data: pd.DataFrame):
        """
        Detect price anomalies in historical data using z-score analysis.
        Args:
            data: DataFrame containing historical price data.
        """
        data['price_mean'] = data['close'].rolling(30).mean()
        data['price_std'] = data['close'].rolling(30).std()
        data['z_score'] = (data['close'] - data['price_mean']) / data['price_std']
        anomalies = data[np.abs(data['z_score']) > self.z_score_threshold]
        return anomalies

# Example usage
data = pd.DataFrame({'close': [100, 105, 110, 120, 130, 115, 112, 90, 85, 150, 160, 170]})
detector = HistoricalPriceAnomalyDetector(z_score_threshold=2.5)
print("Price Anomalies:", detector.detect_anomalies(data))
