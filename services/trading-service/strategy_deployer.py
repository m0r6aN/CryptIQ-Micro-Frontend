# File path: CryptIQ-Micro-Frontend/services/trading-service/strategy_deployer.py

import os
import subprocess

"""
Automated Trading Strategy Deployment Service
"""

class StrategyDeployer:
    def __init__(self, strategy_directory: str, config_file: str):
        self.strategy_directory = strategy_directory
        self.config_file = config_file

    def deploy_strategy(self):
        """
        Deploy a new trading strategy from the specified directory and configuration.
        """
        try:
            # Execute deployment script
            script_path = os.path.join(self.strategy_directory, "deploy.sh")
            if os.path.exists(script_path):
                subprocess.run([script_path, self.config_file], check=True)
                print(f"Strategy deployed successfully from {self.strategy_directory}")
            else:
                print(f"Deployment script not found: {script_path}")
        except subprocess.CalledProcessError as e:
            print(f"Deployment failed: {e}")

# Example usage
deployer = StrategyDeployer("/path/to/strategy", "config.yaml")
deployer.deploy_strategy()
