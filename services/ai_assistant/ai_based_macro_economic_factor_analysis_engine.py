from transformers import pipeline

class AIBasedMacroEconomicFactorAnalysisEngine:
    def __init__(self):
        self.macro_analysis_engine = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def analyze_macro_factors(self, macro_description: str):
        macro_analysis = self.macro_analysis_engine(macro_description, max_length=50, num_return_sequences=1)
        return macro_analysis[0]['generated_text']

analyzer = AIBasedMacroEconomicFactorAnalysisEngine()
description = "Analyze the impact of rising interest rates and inflation on the crypto market."
print(f"Macro-Economic Factor Analysis: {analyzer.analyze_macro_factors(description)}")
