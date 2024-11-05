# File path: CryptIQ-Micro-Frontend/services/trading-service/strategy_ml_selector.py

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

def train_strategy_selector(data: pd.DataFrame):
    """
    Train a strategy selection model using historical data.
    Args:
        data: Historical market data labeled with 'market_condition' and 'best_strategy'.
    """
    X = data[['rsi', 'macd', 'price_change']]  # Feature columns
    y = data['best_strategy']  # Target strategy label

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train a RandomForestClassifier
    clf = RandomForestClassifier()
    clf.fit(X_train, y_train)

    # Evaluate model
    accuracy = clf.score(X_test, y_test)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")

    return clf

def predict_best_strategy(clf, new_data: pd.DataFrame):
    """
    Predict the best strategy based on current market indicators.
    """
    return clf.predict(new_data)
