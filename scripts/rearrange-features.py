import os
from pathlib import Path
import shutil
from typing import Dict, List, Set
import logging
from colorama import init, Fore, Style

init()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ServiceConsolidator:
    def __init__(self, root_dir: str):
        self.root_dir = Path(root_dir)
        self.services_dir = self.root_dir / 'services'
        
        # Define service mappings for AI assistant files
        self.service_mappings = {
            'market': [
                'market_forecasting',
                'market_sentiment',
                'price_prediction',
                'market_analysis',
                'market_regime',
                'market_anomaly',
            ],
            'trading': [
                'execution',
                'order_management',
                'risk_management',
                'strategy',
                'arbitrage',
                'trade_execution',
            ],
            'portfolio': [
                'optimization',
                'rebalancing',
                'risk_analysis',
                'performance',
                'portfolio_management',
                'allocation',
            ]
        }

    def consolidate(self):
        logger.info(f"{Fore.CYAN}Starting service consolidation...{Style.RESET_ALL}")
        
        # 1. Consolidate trading services
        self._merge_trading_services()
        
        # 2. Move AI assistant files
        self._reorganize_ai_assistant()
        
        # 3. Clean up root Python files
        self._cleanup_root_files()
        
        logger.info(f"{Fore.GREEN}Service consolidation complete!{Style.RESET_ALL}")

    def _merge_trading_services(self):
        logger.info("Merging trading services...")
        trading_service = self.services_dir / 'trading-service'
        trading_dir = self.services_dir / 'trading'
        
        if trading_service.exists():
            # Map files to appropriate subdirectories
            file_mappings = {
                'execution': ['*executor*.py', '*execution*.py'],
                'risk_management': ['*risk*.py', '*safety*.py'],
                'order_management': ['*order*.py', '*position*.py'],
                'strategy': ['*strategy*.py', '*backtesting*.py']
            }
            
            for subdir, patterns in file_mappings.items():
                target_dir = trading_dir / subdir
                target_dir.mkdir(parents=True, exist_ok=True)
                
                for pattern in patterns:
                    for file in trading_service.glob(pattern):
                        if file.is_file():
                            shutil.move(str(file), str(target_dir / file.name))
                            logger.info(f"Moved {file.name} to {subdir}")

            # Remove old trading-service directory
            shutil.rmtree(str(trading_service))
            logger.info("Removed old trading-service directory")

    def _reorganize_ai_assistant(self):
        logger.info("Reorganizing AI assistant files...")
        ai_assistant_dir = self.services_dir / 'ai_assistant'
        
        if ai_assistant_dir.exists():
            for file in ai_assistant_dir.glob('*.py'):
                if file.name == 'app.py' or file.name == 'requirements.txt':
                    continue
                    
                # Determine which domain this file belongs to
                domain = self._determine_domain(file.name)
                if domain:
                    target_dir = self.services_dir / domain / self._determine_subdomain(file.name)
                    target_dir.mkdir(parents=True, exist_ok=True)
                    shutil.move(str(file), str(target_dir / file.name))
                    logger.info(f"Moved {file.name} to {domain}/{self._determine_subdomain(file.name)}")

    def _cleanup_root_files(self):
        logger.info("Cleaning up root Python files...")
        python_files = list(self.root_dir.glob('*.py'))
        
        if python_files:
            scripts_dir = self.root_dir / 'scripts'
            scripts_dir.mkdir(exist_ok=True)
            
            for file in python_files:
                if file.name not in ['setup.py', 'manage.py']:
                    shutil.move(str(file), str(scripts_dir / file.name))
                    logger.info(f"Moved {file.name} to scripts directory")

    def _determine_domain(self, filename: str) -> str:
        filename = filename.lower()
        
        domain_keywords = {
            'market': ['market', 'price', 'sentiment', 'trend'],
            'trading': ['trade', 'execution', 'order', 'position'],
            'portfolio': ['portfolio', 'allocation', 'rebalance', 'risk']
        }
        
        for domain, keywords in domain_keywords.items():
            if any(keyword in filename for keyword in keywords):
                return domain
                
        return 'market'  # default domain if no match

    def _determine_subdomain(self, filename: str) -> str:
        filename = filename.lower()
        
        if 'sentiment' in filename:
            return 'sentiment_analysis'
        elif 'forecast' in filename or 'predict' in filename:
            return 'market_forecasting'
        elif 'risk' in filename:
            return 'risk_management'
        elif 'execution' in filename:
            return 'execution'
        elif 'strategy' in filename:
            return 'strategy'
        
        return 'analysis'  # default subdomain

if __name__ == "__main__":
    consolidator = ServiceConsolidator("D:/Repos/CryptIQ-Micro-Frontend")
    consolidator.consolidate()