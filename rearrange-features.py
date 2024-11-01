import os
import shutil
from pathlib import Path

def create_directory_structure():
    base_path = Path("apps/cryptiq-shell")
    
    # Define new directory structure
    new_structure = {
        "api": ["routes", "middleware"],
        "core": ["state", "hooks", "validators"],
        "shared": ["components", "hooks", "utils"],
        "features": []  # Will preserve existing features but reorganize internals
    }
    
    # Create new directories
    for dir_name, subdirs in new_structure.items():
        dir_path = base_path / dir_name
        dir_path.mkdir(parents=True, exist_ok=True)
        for subdir in subdirs:
            (dir_path / subdir).mkdir(parents=True, exist_ok=True)

def consolidate_components():
    base_path = Path("apps/cryptiq-shell")
    
    # Move chart components to shared
    shared_charts_dir = base_path / "shared/components/charts"
    shared_charts_dir.mkdir(parents=True, exist_ok=True)
    
    # Paths to search for chart components
    chart_source_paths = [
        base_path / "features/shared/charts",
        base_path / "features/market/components",
        base_path / "features/analytics/components/tradingview"
    ]
    
    for source_path in chart_source_paths:
        if source_path.exists():
            for file in source_path.glob("*.tsx"):
                if "chart" in file.name.lower():
                    shutil.move(str(file), str(shared_charts_dir / file.name))

def reorganize_features():
    features_path = Path("apps/cryptiq-shell/features")
    
    # Standard subdirectories for each feature
    feature_subdirs = ["components", "hooks", "api", "utils"]
    
    for feature_dir in features_path.iterdir():
        if feature_dir.is_dir() and not feature_dir.name.startswith('.'):
            # Create standard structure in each feature
            for subdir in feature_subdirs:
                (feature_dir / subdir).mkdir(exist_ok=True)
            
            # Move existing files to appropriate directories
            for file in feature_dir.glob("*.tsx"):
                if "component" in file.name.lower():
                    shutil.move(str(file), str(feature_dir / "components" / file.name))
                elif "hook" in file.name.lower():
                    shutil.move(str(file), str(feature_dir / "hooks" / file.name))

def consolidate_trading_interfaces():
    trading_path = Path("apps/cryptiq-shell/features/trading/components")
    
    # Create interfaces directory
    interfaces_dir = trading_path / "interfaces"
    interfaces_dir.mkdir(exist_ok=True)
    
    # Move all interface components
    for file in trading_path.glob("*Interface.tsx"):
        shutil.move(str(file), str(interfaces_dir / file.name))

def main():
    try:
        print("Creating new directory structure...")
        create_directory_structure()
        
        print("Consolidating chart components...")
        consolidate_components()
        
        print("Reorganizing features...")
        reorganize_features()
        
        print("Consolidating trading interfaces...")
        consolidate_trading_interfaces()
        
        print("Directory restructuring completed successfully!")
        
    except Exception as e:
        print(f"Error during restructuring: {e}")
        raise

if __name__ == "__main__":
    main()