# File path: CryptIQ-Micro-Frontend/services/trading-service/dynamic_order_book_imbalance_detector.py

import pandas as pd

"""
Dynamic Order Book Imbalance Detector
"""

class DynamicOrderBookImbalanceDetector:
    def __init__(self, imbalance_threshold: float = 0.2):
        self.imbalance_threshold = imbalance_threshold

    def detect_imbalance(self, order_book: pd.DataFrame):
        """
        Detect order book imbalances based on bid and ask volumes.
        Args:
            order_book: DataFrame containing bid and ask price levels and corresponding volumes.
        """
        order_book['imbalance'] = (order_book['bids'] - order_book['asks']) / (order_book['bids'] + order_book['asks'])
        imbalances = order_book[order_book['imbalance'].abs() > self.imbalance_threshold]
        return imbalances

# Example usage
order_book = pd.DataFrame({
    'price': [100, 105, 110, 115, 120],
    'bids': [500, 800, 1200, 900, 600],
    'asks': [400, 600, 1500, 1100, 700]
})
detector = DynamicOrderBookImbalanceDetector(imbalance_threshold=0.15)
print("Detected Imbalances:", detector.detect_imbalance(order_book))
