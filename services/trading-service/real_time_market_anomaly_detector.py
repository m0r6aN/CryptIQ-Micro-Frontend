# File path: CryptIQ-Micro-Frontend/services/trading-service/real_time_market_anomaly_detector.py

import pandas as pd
import numpy as np

"""
Real-Time Market Anomaly Detector
"""

class RealTimeMarketAnomalyDetector:
    def __init__(self, anomaly_threshold: float = 0.05):
        self.anomaly_threshold = anomaly_threshold

    def detect_anomalies(self, data: pd.DataFrame):
        """
        Detect real-time market anomalies using rolling mean and standard deviation.
        Args:
            data: DataFrame containing market price data.
        """
        data['rolling_mean'] = data['price'].rolling(20).mean()
        data['rolling_std'] = data['price'].rolling(20).std()
        data['anomaly_score'] = (data['price'] - data['rolling_mean']) / data['rolling_std']
        anomalies = data[np.abs(data['anomaly_score']) > self.anomaly_threshold]
        return anomalies

# Example usage
data = pd.DataFrame({'price': [100, 105, 110, 120, 130, 115, 112, 90, 85, 150, 160, 170]})
detector = RealTimeMarketAnomalyDetector(anomaly_threshold=2.0)
print("Real-Time Market Anomalies:", detector.detect_anomalies(data))
