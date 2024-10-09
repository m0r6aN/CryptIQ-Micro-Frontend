from transformers import pipeline

class AIPoweredStopLossAndTakeProfitAdvisor:
    def __init__(self):
        self.sl_tp_advisor = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def advise_stop_loss_take_profit(self, trade_description: str):
        advice = self.sl_tp_advisor(trade_description, max_length=50, num_return_sequences=1)
        return advice[0]['generated_text']

advisor = AIPoweredStopLossAndTakeProfitAdvisor()
description = "Provide stop loss and take profit levels for a leveraged long position in BTC."
print(f"Stop Loss and Take Profit Advice: {advisor.advise_stop_loss_take_profit(description)}")
