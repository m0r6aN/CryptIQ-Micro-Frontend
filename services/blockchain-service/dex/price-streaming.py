from fastapi import FastAPI, WebSocket
from typing import Dict, List
import asyncio
import aiohttp
import json
from web3 import Web3
from gql import gql, Client
from gql.transport.aiohttp import AIOHTTPTransport

app = FastAPI()

# GraphQL query for Uniswap
UNISWAP_QUERY = gql("""
    query GetETHPrice($poolId: ID!) {
        pool(id: $poolId) {
            token0Price
            token1Price
        }
    }
""")

class DEXPriceStreamer:
    def __init__(self):
        # WETH-USDC pools
        self.uniswap_pool_id = "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"
        self.curve_pool_addr = "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46"
        self.balancer_pool_id = "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56"
        
        # Initialize web3 and contract connections
        self.w3 = Web3(Web3.HTTPProvider('http://localhost:8545'))
        
        # Initialize GraphQL client for Uniswap
        self.uni_transport = AIOHTTPTransport(
            url='https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
        )
        
    async def get_uniswap_price(self) -> float:
        async with Client(
            transport=self.uni_transport,
            fetch_schema_from_transport=True,
        ) as session:
            result = await session.execute(
                UNISWAP_QUERY,
                variable_values={"poolId": self.uniswap_pool_id}
            )
            return float(result["pool"]["token0Price"])

    async def get_curve_price(self) -> float:
        # Using Curve's price oracle
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"https://api.curve.fi/api/getPools/ethereum"
            ) as response:
                data = await response.json()
                for pool in data["data"]["poolData"]:
                    if pool["address"].lower() == self.curve_pool_addr.lower():
                        return float(pool["usdPrice"])
        return 0

    async def get_balancer_price(self) -> float:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"https://api.balancer.fi/pools/{self.balancer_pool_id}"
            ) as response:
                data = await response.json()
                return float(data["price"])

    async def get_volume_data(self) -> Dict[str, float]:
        # Aggregate 24h volume from all DEXes
        volumes = {
            "uniswap": 0,
            "curve": 0,
            "balancer": 0
        }
        
        try:
            # Get Uniswap volume
            async with Client(
                transport=self.uni_transport,
                fetch_schema_from_transport=True,
            ) as session:
                result = await session.execute(gql("""
                    query GetPoolDayData($poolId: ID!) {
                        poolDayData(id: $poolId) {
                            volumeUSD
                        }
                    }
                """), variable_values={"poolId": self.uniswap_pool_id})
                volumes["uniswap"] = float(result["poolDayData"]["volumeUSD"])
                
            # Get other volumes...
            # (Similar implementation for Curve and Balancer)
            
        except Exception as e:
            print(f"Error fetching volumes: {e}")
            
        return volumes

    async def stream_prices(self, websocket: WebSocket):
        await websocket.accept()
        
        while True:
            try:
                # Gather all price and volume data concurrently
                uniswap_price, curve_price, balancer_price, volumes = await asyncio.gather(
                    self.get_uniswap_price(),
                    self.get_curve_price(),
                    self.get_balancer_price(),
                    self.get_volume_data()
                )
                
                # Calculate aggregate volume
                total_volume = sum(volumes.values())
                
                data = {
                    "timestamp": self.w3.eth.get_block('latest').timestamp,
                    "uniswap": uniswap_price,
                    "curve": curve_price,
                    "balancer": balancer_price,
                    "volume": total_volume,
                    "volumes": volumes
                }
                
                await websocket.send_text(json.dumps(data))
                
                # Stream every 5 seconds
                await asyncio.sleep(5)
                
            except Exception as e:
                print(f"Error in price stream: {e}")
                break
                
        await websocket.close()

# Initialize the streamer
price_streamer = DEXPriceStreamer()

@app.websocket("/dex-stream")
async def websocket_endpoint(websocket: WebSocket):
    await price_streamer.stream_prices(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)