import os
import shutil
from pathlib import Path
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def setup_new_structure(base_path: str):
    """
    Creates new domain-driven feature structure and migrates existing components.
    """
    # New domain-driven directories
    new_structure = {
        'market': {
            'components': ['screeners', 'charts/components/tradingview'],
            'services': [],
            'hooks': [],
            'state': []
        },
        'portfolio': {
            'components': ['portfolio/components'],
            'services': ['portfolio/services'],
            'hooks': [],
            'state': ['portfolio/state']
        },
        'trading': {
            'components': [],
            'services': [],
            'hooks': [],
            'state': []
        },
        'analytics': {
            'components': ['charts/components'],
            'services': [],
            'hooks': [],
            'state': []
        },
        'agents': {
            'components': ['agents/components', 'processes'],
            'services': [],
            'hooks': [],
            'state': []
        },
        'shared': {
            'components': ['ui', 'ComboBox', 'DataTable'],
            'hooks': [],
            'utils': [],
            'types': []
        }
    }

    features_path = Path(base_path) / 'apps' / 'cryptiq-shell' / 'features'
    backup_path = features_path.parent / 'features_backup'

    try:
        # Create backup
        if features_path.exists():
            logging.info("Creating backup of current features directory...")
            shutil.copytree(features_path, backup_path)

        # Clear and recreate features directory
        if features_path.exists():
            shutil.rmtree(features_path)
        features_path.mkdir(exist_ok=True)

        # Create new structure
        for domain, structure in new_structure.items():
            domain_path = features_path / domain
            domain_path.mkdir(exist_ok=True)
            
            for subdir in structure.keys():
                (domain_path / subdir).mkdir(exist_ok=True)

        # Move existing components to new locations
        for domain, structure in new_structure.items():
            for subdir, paths in structure.items():
                for path in paths:
                    source = backup_path / path
                    if source.exists():
                        dest = features_path / domain / subdir
                        logging.info(f"Moving {source} to {dest}")
                        
                        # Move files preserving directory structure
                        for item in source.glob('**/*'):
                            if item.is_file():
                                relative_path = item.relative_to(source)
                                new_path = dest / relative_path
                                new_path.parent.mkdir(parents=True, exist_ok=True)
                                shutil.copy2(item, new_path)

        # Cleanup backup if everything succeeded
        if backup_path.exists():
            shutil.rmtree(backup_path)
            logging.info("Cleanup completed successfully")

        return True

    except Exception as e:
        logging.error(f"Error during restructuring: {str(e)}")
        # Restore from backup if something went wrong
        if backup_path.exists():
            if features_path.exists():
                shutil.rmtree(features_path)
            shutil.copytree(backup_path, features_path)
            shutil.rmtree(backup_path)
            logging.info("Restored from backup due to error")
        return False

if __name__ == "__main__":
    base_path = "D:/Repos/CryptIQ-Micro-Frontend"
    success = setup_new_structure(base_path)
    if success:
        logging.info("Directory restructuring completed successfully!")
    else:
        logging.error("Directory restructuring failed!")