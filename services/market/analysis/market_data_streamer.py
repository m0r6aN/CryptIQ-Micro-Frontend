# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/market_data_streamer.py

import websocket
import json
import pandas as pd

"""
WebSocket-Based Market Data Streamer
"""

class MarketDataStreamer:
    def __init__(self, url: str):
        self.url = url
        self.ws = None
        self.market_data = []

    def on_open(self, ws):
        print("Connection opened")

    def on_message(self, ws, message):
        data = json.loads(message)
        self.market_data.append(data)
        print(f"Received Data: {data}")

    def on_error(self, ws, error):
        print(f"Error: {error}")

    def on_close(self, ws):
        print("Connection closed")

    def start_streaming(self):
        """
        Connect to WebSocket and start receiving data.
        """
        self.ws = websocket.WebSocketApp(self.url,
                                         on_open=self.on_open,
                                         on_message=self.on_message,
                                         on_error=self.on_error,
                                         on_close=self.on_close)
        self.ws.run_forever()

# Example usage
streamer = MarketDataStreamer("wss://ws-feed.pro.coinbase.com")  # Replace with actual WebSocket URL
streamer.start_streaming()
