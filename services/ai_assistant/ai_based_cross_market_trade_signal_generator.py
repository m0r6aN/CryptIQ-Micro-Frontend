from transformers import pipeline

class AICrossMarketTradeSignalGenerator:
    def __init__(self):
        self.trade_signal_generator = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def generate_trade_signal(self, market_description: str):
        trade_signal = self.trade_signal_generator(market_description, max_length=50, num_return_sequences=1)
        return trade_signal[0]['generated_text']

generator = AICrossMarketTradeSignalGenerator()
description = "The market is showing early signs of a bullish reversal with increasing trading volume."
print(f"Generated Trade Signal: {generator.generate_trade_signal(description)}")
