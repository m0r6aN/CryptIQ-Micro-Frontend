# File path: CryptIQ-Micro-Frontend/services/trading-service/market_condition_classifier.py

import pandas as pd
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split

"""
AI-Driven Market Condition Classifier
"""

class MarketConditionClassifier:
    def __init__(self):
        self.model = SVC(kernel='linear', C=1)

    def train_classifier(self, data: pd.DataFrame):
        """
        Train a classifier to detect market conditions (bullish, bearish, sideways).
        """
        X = data[['rsi', 'macd', 'price_change']]  # Features
        y = data['condition']  # Target labels

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        self.model.fit(X_train, y_train)

        accuracy = self.model.score(X_test, y_test)
        print(f"Classifier Accuracy: {accuracy * 100:.2f}%")

    def predict_condition(self, indicators: pd.DataFrame):
        """
        Predict the current market condition based on the provided indicators.
        """
        return self.model.predict(indicators)

# Example usage
data = pd.DataFrame({
    'rsi': [30, 40, 70, 80, 60],
    'macd': [0.1, -0.05, 0.2, -0.1, 0.05],
    'price_change': [2.5, -1.2, 1.0, -0.5, 1.5],
    'condition': ['bullish', 'bearish', 'bullish', 'bearish', 'sideways']
})
classifier = MarketConditionClassifier()
classifier.train_classifier(data)

indicators = pd.DataFrame({'rsi': [65], 'macd': [0.15], 'price_change': [1.2]})
print(classifier.predict_condition(indicators))
