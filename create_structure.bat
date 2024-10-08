@echo off

:: Creating directory structure for CryptIQ-Micro-Frontend in the current directory
set BASE_DIR=.

mkdir %BASE_DIR%\apps\cryptiq-shell\components\WalletManager
mkdir %BASE_DIR%\apps\cryptiq-shell\components\ExchangeManager
mkdir %BASE_DIR%\apps\cryptiq-shell\components\PortfolioOverview
mkdir %BASE_DIR%\apps\cryptiq-shell\components\Dashboard
mkdir %BASE_DIR%\apps\cryptiq-shell\lib
mkdir %BASE_DIR%\apps\cryptiq-shell\state
mkdir %BASE_DIR%\apps\cryptiq-shell\config

:: Creating component files
copy NUL %BASE_DIR%\apps\cryptiq-shell\components\WalletManager\ConnectWalletModal.js
copy NUL %BASE_DIR%\apps\cryptiq-shell\components\WalletManager\ConnectedWalletsList.js
copy NUL %BASE_DIR%\apps\cryptiq-shell\components\ExchangeManager\AddExchangeAccount.js
copy NUL %BASE_DIR%\apps\cryptiq-shell\components\ExchangeManager\ConnectedExchangesList.js
copy NUL %BASE_DIR%\apps\cryptiq-shell\components\PortfolioOverview\PortfolioAggregation.js
copy NUL %BASE_DIR%\apps\cryptiq-shell\components\PortfolioOverview\IndividualPortfolio.js
copy NUL %BASE_DIR%\apps\cryptiq-shell\components\Dashboard\SideNavigation.js
copy NUL %BASE_DIR%\apps\cryptiq-shell\components\Dashboard\AssetsList.js

:: Creating lib files
copy NUL %BASE_DIR%\apps\cryptiq-shell\lib\apits.ts
copy NUL %BASE_DIR%\apps\cryptiq-shell\lib\prisma\prisma.schema

:: Creating state files
copy NUL %BASE_DIR%\apps\cryptiq-shell\state\walletState.js
copy NUL %BASE_DIR%\apps\cryptiq-shell\state\exchangeState.js

:: Creating backend services directory in root
mkdir %BASE_DIR%\services\api
mkdir %BASE_DIR%\services\api\wallet-service
mkdir %BASE_DIR%\services\api\exchange-service
mkdir %BASE_DIR%\services\wallet-service
mkdir %BASE_DIR%\services\exchange-service

:: Creating service files in backend services
copy NUL %BASE_DIR%\services\api\wallet-service\index.js
copy NUL %BASE_DIR%\services\api\exchange-service\index.js
copy NUL %BASE_DIR%\services\wallet-service\index.ts
copy NUL %BASE_DIR%\services\exchange-service\index.ts

:: Creating Dockerfile for cryptiq-shell
copy NUL %BASE_DIR%\apps\cryptiq-shell\Dockerfile

:: Creating .env and .env.example files
copy NUL %BASE_DIR%\apps\cryptiq-shell\.env
copy NUL %BASE_DIR%\apps\cryptiq-shell\.env.example

:: Creating README.md
copy NUL %BASE_DIR%\apps\cryptiq-shell\README.md

:: Creating other config files
copy NUL %BASE_DIR%\apps\cryptiq-shell\next-env.d.ts
copy NUL %BASE_DIR%\apps\cryptiq-shell\next.config.js
copy NUL %BASE_DIR%\apps\cryptiq-shell\postcss.config.js
copy NUL %BASE_DIR%\apps\cryptiq-shell\tailwind.config.js
copy NUL %BASE_DIR%\apps\cryptiq-shell\tsconfig.json

:: Creating docker-compose.yml
copy NUL %BASE_DIR%\docker-compose.yml

:: Creating Dockerfiles for services
copy NUL %BASE_DIR%\services\wallet-service\Dockerfile
copy NUL %BASE_DIR%\services\exchange-service\Dockerfile

:: Creating docker-compose.yml
copy NUL %BASE_DIR%\docker-compose.yml

echo Directory structure and files created successfully.