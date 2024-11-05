import os
from pathlib import Path
from typing import Dict, List, Set
from dataclasses import dataclass
from colorama import init, Fore, Style

init()  # Initialize colorama

@dataclass
class FileMove:
    source: Path
    destination: Path
    action: str  # 'move', 'copy', 'delete', 'create'

class ProjectReorganizerDryRun:
    def __init__(self, root_dir: str):
        self.root_dir = Path(root_dir)
        if not self.root_dir.exists():
            print(f"{Fore.RED}Error: Root directory not found: {self.root_dir}{Style.RESET_ALL}")
            return
            
        self.apps_dir = self.root_dir / 'apps'
        self.services_dir = self.root_dir / 'services'
        self.planned_moves: List[FileMove] = []
        
        print(f"{Fore.GREEN}Found project root: {self.root_dir}{Style.RESET_ALL}")
        print(f"Apps dir exists: {self.apps_dir.exists()}")
        print(f"Services dir exists: {self.services_dir.exists()}\n")

    def analyze_structure(self):
        if not hasattr(self, 'root_dir'):
            return
            
        # Frontend Analysis
        print(f"{Fore.CYAN}Analyzing frontend structure...{Style.RESET_ALL}")
        self._analyze_frontend()
        
        # Services Analysis
        print(f"{Fore.CYAN}Analyzing services structure...{Style.RESET_ALL}")
        self._analyze_services()
        
        self._print_analysis()

    def _analyze_frontend(self):
        shell_dir = self.apps_dir / 'cryptiq-shell'
        if not shell_dir.exists():
            print(f"{Fore.YELLOW}Warning: cryptiq-shell directory not found{Style.RESET_ALL}")
            return
            
        features_dir = shell_dir / 'features'
        if not features_dir.exists():
            print(f"{Fore.YELLOW}Warning: features directory not found{Style.RESET_ALL}")
            return

        # Analyze shared components
        shared_components = features_dir / 'shared/components'
        ui_components = features_dir / 'shared/ui'
        
        if shared_components.exists() and ui_components.exists():
            print(f"Found shared components directory")
            for item in shared_components.glob('**/*'):
                if item.is_file():
                    dest = ui_components / item.relative_to(shared_components)
                    self.planned_moves.append(FileMove(item, dest, 'move'))

        # Analyze trading components
        trading_dir = features_dir / 'trading'
        if trading_dir.exists():
            print(f"Found trading directory")
            self._analyze_trading_components(trading_dir)

        # Analyze duplicate TradingView components
        self._analyze_tradingview_duplicates()

    def _analyze_trading_components(self, trading_dir: Path):
        component_categories = {
            'analysis': ['Scanner', 'SignalCard', 'MarketDepth'],
            'execution': ['SmartExecution', 'OrderForm'],
            'visualization': ['HeatMap', 'RiskRadar']
        }

        components_dir = trading_dir / 'components'
        if not components_dir.exists():
            print(f"{Fore.YELLOW}Warning: components directory not found in trading{Style.RESET_ALL}")
            return

        for category, components in component_categories.items():
            category_dir = components_dir / category
            self.planned_moves.append(FileMove(
                category_dir, 
                category_dir, 
                'create'
            ))
            
            for component in components:
                source = components_dir / component
                if source.exists():
                    dest = category_dir / component
                    self.planned_moves.append(FileMove(source, dest, 'move'))

    def _analyze_tradingview_duplicates(self):
        tradingview_paths = [
            self.apps_dir / 'cryptiq-shell/features/market/components/tradingview',
            self.apps_dir / 'cryptiq-shell/features/analytics/components/tradingview'
        ]
        
        for path in tradingview_paths:
            if path.exists():
                self.planned_moves.append(FileMove(path, path, 'delete'))

    def _analyze_services(self):
        if not self.services_dir.exists():
            print(f"{Fore.YELLOW}Warning: services directory not found{Style.RESET_ALL}")
            return

        ai_domains = {
            'market': [
                'market_forecasting',
                'sentiment_analysis',
                'price_prediction',
                'trend_analysis'
            ],
            'trading': [
                'execution',
                'risk_management',
                'order_management',
                'strategy'
            ],
            'portfolio': [
                'optimization',
                'rebalancing',
                'risk_analysis',
                'performance'
            ]
        }

        for domain, services in ai_domains.items():
            domain_dir = self.services_dir / domain
            self.planned_moves.append(FileMove(domain_dir, domain_dir, 'create'))
            
            for service in services:
                service_dir = domain_dir / service
                self.planned_moves.append(FileMove(service_dir, service_dir, 'create'))

    def _print_analysis(self):
        if not self.planned_moves:
            print(f"{Fore.YELLOW}No changes planned - check if directories exist{Style.RESET_ALL}")
            return
            
        print(f"\n{Fore.CYAN}=== Project Reorganization Analysis ==={Style.RESET_ALL}\n")

        # Group moves by type
        creates = [m for m in self.planned_moves if m.action == 'create']
        moves = [m for m in self.planned_moves if m.action == 'move']
        deletes = [m for m in self.planned_moves if m.action == 'delete']

        # Print directory creations
        if creates:
            print(f"{Fore.GREEN}New Directories to Create:{Style.RESET_ALL}")
            for move in creates:
                print(f"  + {move.destination.relative_to(self.root_dir)}")

        # Print file moves
        if moves:
            print(f"\n{Fore.YELLOW}Files to Move:{Style.RESET_ALL}")
            for move in moves:
                print(f"  → {move.source.relative_to(self.root_dir)}")
                print(f"    to: {move.destination.relative_to(self.root_dir)}")

        # Print deletions (mainly duplicates)
        if deletes:
            print(f"\n{Fore.RED}Files/Directories to Remove:{Style.RESET_ALL}")
            for move in deletes:
                print(f"  - {move.source.relative_to(self.root_dir)}")

        print(f"\n{Fore.CYAN}Summary:{Style.RESET_ALL}")
        print(f"  • Directories to create: {len(creates)}")
        print(f"  • Files to move: {len(moves)}")
        print(f"  • Items to remove: {len(deletes)}")

if __name__ == "__main__":
    analyzer = ProjectReorganizerDryRun("D:/Repos/CryptIQ-Micro-Frontend")
    analyzer.analyze_structure()