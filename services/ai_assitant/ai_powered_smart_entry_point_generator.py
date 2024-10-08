# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_powered_smart_entry_point_generator.py

from transformers import pipeline

class AISmartEntryPointGenerator:
    def __init__(self):
        self.entry_point_generator = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def generate_entry_point(self, entry_description: str):
        """
        Generate smart entry points based on a description of the market.
        Args:
            entry_description: Text description of the market condition.
        """
        entry_point = self.entry_point_generator(entry_description, max_length=50, num_return_sequences=1)
        return entry_point[0]['generated_text']

# Example usage
generator = AISmartEntryPointGenerator()
description = "The market is experiencing strong buying pressure, with support holding at key levels."
print(f"Generated Entry Point: {generator.generate_entry_point(description)}")
