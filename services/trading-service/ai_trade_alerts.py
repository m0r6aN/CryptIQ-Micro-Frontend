# File path: CryptIQ-Micro-Frontend/services/trading-service/ai_trade_alerts.py

import talib
import pandas as pd

def generate_trade_alerts(df: pd.DataFrame):
    alerts = []

    # RSI Alert
    df['RSI'] = talib.RSI(df['close'], timeperiod=14)
    if df['RSI'].iloc[-1] > 70:
        alerts.append("RSI Overbought - Potential Sell Signal")
    elif df['RSI'].iloc[-1] < 30:
        alerts.append("RSI Oversold - Potential Buy Signal")

    # EMA Crossover Alert
    df['EMA12'] = talib.EMA(df['close'], timeperiod=12)
    df['EMA26'] = talib.EMA(df['close'], timeperiod=26)
    if df['EMA12'].iloc[-1] > df['EMA26'].iloc[-1]:
        alerts.append("EMA12/26 Bullish Crossover - Potential Buy Signal")
    else:
        alerts.append("EMA12/26 Bearish Crossover - Potential Sell Signal")

    return alerts
