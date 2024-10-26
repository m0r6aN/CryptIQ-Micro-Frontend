# File: D:\Repos\CryptIQ-Micro-Frontend\services\common-service\db.py

import os
import logging
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Helper function to handle queries
def handle_query(query):
    try:
        response = query.execute()
        return response.data
    except Exception as e:
        logger.error(f"Error executing query: {str(e)}")
        return None

# Fetch all wallets, optionally filter by chain
def fetch_wallets(chain_id=None):
    query = supabase.table('wallets').select("*")
    if chain_id:
        query = query.eq('chain_id', chain_id)
    return handle_query(query)

# Insert a new wallet
def insert_wallet(address: str, balance: float, chain_id: int, user_id: str):
    try:
        data = {
            "address": address,
            "balance": balance,
            "chain_id": chain_id,
            "user_id": user_id,
        }
        response = supabase.table('wallets').insert(data).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error inserting wallet: {str(e)}")
        return None

# Update a wallet's balance
def update_wallet_balance(wallet_id: int, balance: float):
    try:
        response = supabase.table('wallets').update({"balance": balance}).eq('id', wallet_id).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error updating wallet: {str(e)}")
        return None

# Delete a wallet
def delete_wallet(wallet_id: int):
    try:
        response = supabase.table('wallets').delete().eq('id', wallet_id).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error deleting wallet: {str(e)}")
        return None

# Fetch all portfolios for a user
def fetch_portfolios(user_id: str):
    query = supabase.table('portfolios').select("*").eq('user_id', user_id)
    return handle_query(query)

# Insert a new portfolio
def insert_portfolio(name: str, user_id: str):
    try:
        data = {
            "name": name,
            "user_id": user_id,
        }
        response = supabase.table('portfolios').insert(data).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error inserting portfolio: {str(e)}")
        return None

# Update a portfolio
def update_portfolio(portfolio_id: int, name: str = None):
    try:
        update_data = {}
        if name:
            update_data['name'] = name
        response = supabase.table('portfolios').update(update_data).eq('id', portfolio_id).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error updating portfolio: {str(e)}")
        return None

# Fetch trades, optionally filter by wallet or exchange
def fetch_trades(wallet_id: int = None, exchange_id: int = None):
    query = supabase.table('trades').select("*")
    if wallet_id:
        query = query.eq('wallet_id', wallet_id)
    if exchange_id:
        query = query.eq('exchange_id', exchange_id)
    return handle_query(query)

# Insert a new trade
def insert_trade(wallet_id: int, exchange_id: int, trade_type: str, amount: float, price: float):
    try:
        data = {
            "wallet_id": wallet_id,
            "exchange_id": exchange_id,
            "trade_type": trade_type,
            "amount": amount,
            "price": price,
        }
        response = supabase.table('trades').insert(data).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error inserting trade: {str(e)}")
        return None

# Fetch all chains
def fetch_chains():
    query = supabase.table('chains').select("*")
    return handle_query(query)

# Insert a new exchange
def insert_exchange(name: str, api_key: str, secret_key: str, user_id: str):
    try:
        data = {
            "name": name,
            "api_key": api_key,
            "secret_key": secret_key,
            "user_id": user_id,
        }
        response = supabase.table('exchanges').insert(data).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error inserting exchange: {str(e)}")
        return None

# Fetch all exchanges for a user
def fetch_exchanges(user_id: str):
    query = supabase.table('exchanges').select("*").eq('user_id', user_id)
    return handle_query(query)

# Insert a portfolio asset
def insert_portfolio_asset(portfolio_id: int, wallet_id: int, exchange_id: int, allocation: float):
    try:
        data = {
            "portfolio_id": portfolio_id,
            "wallet_id": wallet_id,
            "exchange_id": exchange_id,
            "allocation": allocation,
        }
        response = supabase.table('portfolio_assets').insert(data).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error inserting portfolio asset: {str(e)}")
        return None

# Fetch all assets in a portfolio
def fetch_portfolio_assets(portfolio_id: int):
    query = supabase.table('portfolio_assets').select("*").eq('portfolio_id', portfolio_id)
    return handle_query(query)

# Delete a portfolio
def delete_portfolio(portfolio_id: int):
    try:
        response = supabase.table('portfolios').delete().eq('id', portfolio_id).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error deleting portfolio: {str(e)}")
        return None

# Delete an exchange
def delete_exchange(exchange_id: int):
    try:
        response = supabase.table('exchanges').delete().eq('id', exchange_id).execute()
        return response.data
    except Exception as e:
        logger.error(f"Error deleting exchange: {str(e)}")
        return None