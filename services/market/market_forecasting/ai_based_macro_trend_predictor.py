from transformers import pipeline

class AIBasedMacroTrendPredictor:
    def __init__(self):
        self.macro_trend_predictor = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def predict_macro_trend(self, market_description: str):
        macro_trend = self.macro_trend_predictor(market_description, max_length=50, num_return_sequences=1)
        return macro_trend[0]['generated_text']

predictor = AIBasedMacroTrendPredictor()
description = "The global market is currently facing uncertainties due to rising interest rates and geopolitical tensions."
print(f"Macro Trend Prediction: {predictor.predict_macro_trend(description)}")
