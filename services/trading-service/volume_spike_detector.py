# File path: CryptIQ-Micro-Frontend/services/trading-service/volume_spike_detector.py

import pandas as pd

"""
Trading Volume Spike Detector
"""

class VolumeSpikeDetector:
    def __init__(self, spike_threshold: float = 1.5):
        self.spike_threshold = spike_threshold

    def detect_spikes(self, data: pd.DataFrame):
        """
        Detect volume spikes in the given market data.
        """
        data['volume_change'] = data['volume'].pct_change()
        spikes = data[data['volume_change'].abs() > self.spike_threshold]
        return spikes

    def detect_sudden_drops(self, data: pd.DataFrame):
        """
        Detect sudden drops in volume indicating potential manipulation.
        """
        data['volume_change'] = data['volume'].pct_change()
        drops = data[data['volume_change'] < -self.spike_threshold]
        return drops

# Example usage
data = pd.DataFrame({'volume': [1000, 3000, 2000, 5000, 1000, 800]})
detector = VolumeSpikeDetector(spike_threshold=1.0)
print(detector.detect_spikes(data))
print(detector.detect_sudden_drops(data))