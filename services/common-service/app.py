# File: D:\Repos\CryptIQ-Micro-Frontend\services\common-service\app.py
from fastapi import FastAPI
from .db import *
from pydantic import BaseModel

app = FastAPI()

# Wallet Endpoints
@app.get("/wallets")
async def get_wallets(chain_id: str = None):
    try:
        wallets = fetch_wallets(chain_id)
        return {"wallets": wallets}
    except Exception as e:
        return {"error": str(e)}

class WalletRequest(BaseModel):
    address: str
    balance: float
    chain_id: int
    user_id: str

@app.post("/wallets")
async def add_wallet(request: WalletRequest):
    try:
        res = insert_wallet(request.address, request.balance, request.chain_id, request.user_id)
        return {"success": res}
    except Exception as e:
        return {"error": str(e)}

class BalanceUpdateRequest(BaseModel):
    address: str
    balance: float

@app.put("/wallets")
async def update_balance(request: BalanceUpdateRequest):
    try:
        res = update_wallet_balance(request.address, request.balance)
        return {"success": res}
    except Exception as e:
        return {"error": str(e)}

@app.delete("/wallets")
async def delete_wallet(wallet_id: int):
    try:
        res = delete_wallet(wallet_id)
        return {"success": res}
    except Exception as e:
        return {"error": str(e)}

# Chain Endpoints
@app.get("/chains")
async def get_chains():
    try:
        chains = fetch_chains()
        return {"chains": chains}
    except Exception as e:
        return {"error": str(e)}

# Exchange Endpoints
class ExchangeRequest(BaseModel):
    name: str
    api_key: str
    secret_key: str
    user_id: str

@app.post("/exchanges")
async def add_exchange(request: ExchangeRequest):
    try:
        res = insert_exchange(request.name, request.api_key, request.secret_key, request.user_id)
        return {"success": res}
    except Exception as e:
        return {"error": str(e)}

@app.get("/exchanges")
async def get_exchanges(user_id: str = None):
    try:
        exchanges = fetch_exchanges(user_id)
        return {"exchanges": exchanges}
    except Exception as e:
        return {"error": str(e)}

# Portfolio Endpoints
class PortfolioRequest(BaseModel):
    name: str
    user_id: str

@app.post("/portfolios")
async def add_portfolio(request: PortfolioRequest):
    try:
        res = insert_portfolio(request.name, request.user_id)
        return {"success": res}
    except Exception as e:
        return {"error": str(e)}

@app.get("/portfolios")
async def get_portfolios(user_id: str = None):
    try:
        portfolios = fetch_portfolios(user_id)
        return {"portfolios": portfolios}
    except Exception as e:
        return {"error": str(e)}

# Portfolio Asset Endpoints
class PortfolioAssetRequest(BaseModel):
    portfolio_id: int
    wallet_id: int
    exchange_id: int
    allocation: float

@app.post("/portfolio_assets")
async def add_portfolio_asset(request: PortfolioAssetRequest):
    try:
        res = insert_portfolio_asset(request.portfolio_id, request.wallet_id, request.exchange_id, request.allocation)
        return {"success": res}
    except Exception as e:
        return {"error": str(e)}

@app.get("/portfolio_assets")
async def get_portfolio_assets(portfolio_id: int):
    try:
        assets = fetch_portfolio_assets(portfolio_id)
        return {"portfolio_assets": assets}
    except Exception as e:
        return {"error": str(e)}

# Trade Endpoints
class TradeRequest(BaseModel):
    wallet_id: int
    exchange_id: int
    trade_type: str
    amount: float
    price: float

@app.post("/trades")
async def add_trade(request: TradeRequest):
    try:
        res = insert_trade(request.wallet_id, request.exchange_id, request.trade_type, request.amount, request.price)
        return {"success": res}
    except Exception as e:
        return {"error": str(e)}

@app.get("/trades")
async def get_trades(wallet_id: int = None, exchange_id: int = None):
    try:
        trades = fetch_trades(wallet_id, exchange_id)
        return {"trades": trades}
    except Exception as e:
        return {"error": str(e)}