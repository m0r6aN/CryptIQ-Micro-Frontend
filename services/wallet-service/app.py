from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests

app = FastAPI()

# Define the WalletRequest class
class WalletRequest(BaseModel):
    address: str

@app.post("/wallet")
async def get_wallet_balance(request: WalletRequest):
    address = request.address
    try:
        # Fetch wallet balance (replace with actual Web3 call)
        balance = 42.0  # Replace this with actual Web3 logic
        
        # Fetch real-time crypto data from crypto-data-service
        market_response = requests.get("http://localhost:5002/crypto-data")
        if market_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Error fetching market data")
        market_data = market_response.json()

        # Get trade recommendations from market-analysis-service
        analysis_response = requests.post("http://localhost:5003/analyze", json={"wallet_balance": balance})
        if analysis_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Error analyzing market trends")
        trade_recommendations = analysis_response.json()

        return {
            "success": True, 
            "balance": balance, 
            "market_data": market_data,
            "trade_recommendations": trade_recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
