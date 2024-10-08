# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/price_prediction.py

import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense

"""
Price Prediction Module with LSTM
"""

def train_price_prediction_model(data: pd.DataFrame):
    """
    Train an LSTM model for price prediction based on historical data.
    """
    # Data preparation
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data['close'].values.reshape(-1, 1))

    # Create training data
    X_train, y_train = [], []
    for i in range(60, len(scaled_data)):
        X_train.append(scaled_data[i-60:i, 0])
        y_train.append(scaled_data[i, 0])
    X_train, y_train = np.array(X_train), np.array(y_train)
    X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))

    # Build LSTM model
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
    model.add(LSTM(units=50))
    model.add(Dense(1))

    # Compile and train the model
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X_train, y_train, epochs=25, batch_size=32)

    return model, scaler

def predict_next_price(model, scaler, data: pd.DataFrame):
    """
    Predict the next price based on the trained model.
    """
    last_60_days = data['close'].values[-60:].reshape(-1, 1)
    scaled_last_60_days = scaler.transform(last_60_days)
    X_test = np.reshape(scaled_last_60_days, (1, scaled_last_60_days.shape[0], 1))
    predicted_price = model.predict(X_test)
    predicted_price = scaler.inverse_transform(predicted_price)
    return predicted_price[0][0]
