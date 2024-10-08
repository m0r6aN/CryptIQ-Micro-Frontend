from fastapi import FastAPI, HTTPException
import os
from dotenv import load_dotenv
import ccxt
import ta
import pandas as pd

load_dotenv()

app = FastAPI()

CRYPTOCOMPARE_API_KEY = os.getenv("CRYPTOCOMPARE_API_KEY")
CRYPTOCOMPARE_API_BASE_URL = "https://min-api.cryptocompare.com/data"
BLOFIN_API_KEY = os.getenv("BLOFIN_API_KEY")
BLOFIN_PASSWORD = os.getenv("BLOFIN_PASSWORD")
BLOFIN_SECRET = os.getenv("BLOFIN_SECRET")

# Set up exchange (replace with your exchange of choice)
exchange = ccxt.blofin({
    'apiKey': 'BLOFIN_API_KEY',
    'secret': 'BLOFIN_SECRET',
    'enableRateLimit': True
})

# Identify trend or range conditions
def identify_market_conditions(df):
    macd, macdsignal, _ = ta.MACD(df['close'], fastperiod=12, slowperiod=26, signalperiod=9)
    atr = ta.ATR(df['high'], df['low'], df['close'], timeperiod=14)
    is_trending = (abs(macd - macdsignal) > atr)
    return is_trending

# Generate signals based on market conditions
def generate_signals(df, is_trending):
    signals = pd.DataFrame(index=df.index)
    signals['signal'] = 0
    
    # Trend-following strategy
    if is_trending.iloc[-1]:
        df['sma20'] = ta.SMA(df['close'], timeperiod=20)
        signals['signal'][df['close'] > df['sma20']] = 1  # Buy signal
        signals['signal'][df['close'] < df['sma20']] = -1  # Sell signal
    else:
        # Mean-reversion strategy using RSI
        df['rsi'] = ta.RSI(df['close'], timeperiod=14)
        signals['signal'][df['rsi'] < 30] = 1   # Buy when RSI < 30
        signals['signal'][df['rsi'] > 70] = -1  # Sell when RSI > 70

    return signals


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)