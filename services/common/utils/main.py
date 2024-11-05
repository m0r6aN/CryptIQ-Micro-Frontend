from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import aiohttp
import os
from dotenv import load_dotenv
import ccxt
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

class Coin(BaseModel):
    symbol: str
    name: str
    market_cap: float
    volume_24h: float
    price: float
    percent_change_24h: float

async def fetch_top_coins(limit: int = 100):
    async with aiohttp.ClientSession() as session:
        url = f"{CRYPTOCOMPARE_API_BASE_URL}/top/mktcapfull?limit={limit}&tsym=USD"
        headers = {"authorization": f"Apikey {CRYPTOCOMPARE_API_KEY}"}
        
        async with session.get(url, headers=headers) as response:
            if response.status != 200:
                raise HTTPException(status_code=response.status, detail="Failed to fetch data from CryptoCompare")
            
            data = await response.json()
            
            if data["Response"] != "Success":
                raise HTTPException(status_code=400, detail=data["Message"])
            
            coins = []
            for coin in data["Data"]:
                coin_info = coin["CoinInfo"]
                raw_data = coin["RAW"]["USD"] if "RAW" in coin and "USD" in coin["RAW"] else {}
                
                coins.append(Coin(
                    symbol=coin_info["Name"],
                    name=coin_info["FullName"],
                    market_cap=raw_data.get("MKTCAP", 0),
                    volume_24h=raw_data.get("VOLUME24HOUR", 0),
                    price=raw_data.get("PRICE", 0),
                    percent_change_24h=raw_data.get("CHANGEPCT24HOUR", 0)
                ))
            
            return coins

def filter_day_trading_coins(coins: List[Coin], limit: int) -> List[Coin]:
    # Sort coins by volume and percent change to find interesting day trading opportunities
    sorted_coins = sorted(coins, key=lambda x: (x.volume_24h, abs(x.percent_change_24h)), reverse=True)
    return sorted_coins[:limit]

@app.get("/top-coins")
async def get_top_coins(limit: Optional[int] = 100, day_trading_filter: Optional[int] = None):    
    coins = await fetch_top_coins(limit)
    
    if day_trading_filter:
        coins = filter_day_trading_coins(coins, day_trading_filter)
    
    return coins

@app.get("/fetch_ohlcv")
def fetch_ohlcv(symbol, timeframe='5m', limit=500):
    bars = exchange.fetch_ohlcv(symbol, timeframe=timeframe, limit=limit)
    df = pd.DataFrame(bars, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
    return df


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)