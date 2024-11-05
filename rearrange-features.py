import os
import shutil
from pathlib import Path
from typing import List, Set

def collect_docker_files(root_dir: str) -> List[str]:
    docker_files = []
    for root, _, files in os.walk(root_dir):
        for file in files:
            if file in ['.dockerignore', 'Dockerfile', 'requirements.txt']:
                docker_files.append(os.path.join(root, file))
    return docker_files

def create_consolidated_structure(root_dir: str):
    # Create new directory structure
    new_dirs = [
        'docker/base',
        'docker/dev',
        'docker/prod',
        'services/arbitrage/flash-loan',
        'services/arbitrage/cross-chain',
        'services/arbitrage/dex-integration',
        'services/market/order-book',
        'services/market/price-feed',
        'services/shared/docker',
        'services/shared/requirements'
    ]
    
    for dir_path in new_dirs:
        full_path = os.path.join(root_dir, dir_path)
        os.makedirs(full_path, exist_ok=True)

    # Consolidate Docker files
    docker_files = collect_docker_files(root_dir)
    
    # Create consolidated requirement files
    with open(os.path.join(root_dir, 'services/shared/requirements/base.txt'), 'w') as f:
        requirements: Set[str] = set()
        for docker_file in docker_files:
            if docker_file.endswith('requirements.txt'):
                with open(docker_file, 'r') as req_file:
                    requirements.update(req_file.readlines())
        f.writelines(sorted(requirements))
    
    # Create consolidated Dockerfile
    with open(os.path.join(root_dir, 'docker/base/Dockerfile.base'), 'w') as f:
        f.write("""FROM python:3.9-slim

WORKDIR /app

COPY services/shared/requirements/base.txt .
RUN pip install --no-cache-dir -r base.txt

COPY . .

CMD ["python", "app.py"]
""")

    # Create docker-compose files
    with open(os.path.join(root_dir, 'docker/dev/docker-compose.dev.yml'), 'w') as f:
        f.write("""version: '3.8'
services:
  arbitrage:
    build:
      context: ../..
      dockerfile: docker/base/Dockerfile.base
    environment:
      - ENV=development
    volumes:
      - ../../services/arbitrage:/app/services/arbitrage

  market:
    build:
      context: ../..
      dockerfile: docker/base/Dockerfile.base
    environment:
      - ENV=development
    volumes:
      - ../../services/market:/app/services/market
""")

    # Move blockchain services
    blockchain_paths = {
        'web3-core/contracts': 'services/arbitrage/flash-loan',
        'web3-core/services/flash-loan-arbitrage': 'services/arbitrage/cross-chain',
        'web3-core/services/trading-service': 'services/market/order-book'
    }
    
    for src, dest in blockchain_paths.items():
        src_path = os.path.join(root_dir, 'apps', src)
        dest_path = os.path.join(root_dir, dest)
        if os.path.exists(src_path):
            shutil.move(src_path, dest_path)

    # Clean up old files
    for file in docker_files:
        try:
            os.remove(file)
        except Exception as e:
            print(f"Warning: Could not remove {file}: {e}")

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    create_consolidated_structure(root_dir)
    print("Directory restructuring complete!")

if __name__ == "__main__":
    main()