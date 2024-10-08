from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import ccxt

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

# Execute trade based on signals
def execute_trade(signal, symbol, amount):
    if signal == 1:
        print(f"Placing buy order for {symbol}")
        exchange.create_market_buy_order(symbol, amount)
    elif signal == -1:
        print(f"Placing sell order for {symbol}")
        exchange.create_market_sell_order(symbol, amount)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)