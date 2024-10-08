# File path: CryptIQ-Micro-Frontend/services/config_service/config_manager.py

import json
from typing import Any, Dict

class ConfigManager:
    def __init__(self, config_file: str = 'strategies.json'):
        self.config_file = config_file
        self.config: Dict[str, Any] = self.load_config()

    def load_config(self):
        """
        Load configuration from JSON file.
        """
        try:
            with open(self.config_file, 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            print("Configuration file not found, creating default config.")
            return {}

    def save_config(self):
        """
        Save configuration to JSON file.
        """
        with open(self.config_file, 'w') as file:
            json.dump(self.config, file, indent=4)

    def update_config(self, key: str, value: Any):
        """
        Update a configuration value.
        """
        self.config[key] = value
        self.save_config()

    def get_config(self, key: str):
        """
        Retrieve a configuration value.
        """
        return self.config.get(key)

# Example usage
config_manager = ConfigManager()
config_manager.update_config('current_strategy', 'rsi_strategy')
print(config_manager.get_config('current_strategy'))
