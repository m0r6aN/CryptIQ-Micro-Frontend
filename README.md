# CryptIQ Micro-Frontend

## Overview

This repository is for CryptIQ, a crypto portfolio management tool and automated trading bot, implemented with a micro-frontend architecture. The structure leverages Docker, Fastify for API interactions, Prisma for database access, and Supabase for the backend database.

CryptIQ is designed as a learning platform for exploring micro-frontend architecture, with each part of the application broken into separate services that can be independently deployed, developed, and scaled.

## Prerequisites:
- Next
- React
- Python
- fastify
- Node.js: Node 18+, lts-slim
- Docker and Docker Compose
- turbo
- pnpm

```bash
npm install -g pnpm
```

## Directory Structure

```bash
CryptIQ-Micro-Frontend/
  ├── apps/
  │     ├── cryptiq-shell/
  │           ├── features/
  │           │     ├── wallet/
  │           │     │     ├── components/
  │           │     │     ├── services/
  │           │     │     └── state/
  │           │     ├── portfolio/
  │           │     │     ├── components/
  │           │     │     ├── services/
  │           │     │     └── state/
  │           │     └── exchange/
  │           ├── shared/
  │           │     ├── components/
  │           │     ├── lib/
  │           │     └── styles/
  │           ├── providers/
  │           ├── pages/                       # Replace `.next/app` with `pages` for clarity
  │           ├── config/
  │           ├── lib/
  │           ├── public/
  │           ├── state/
  │           ├── styles/
  │           ├── Dockerfile
  │           ├── next-env.d.ts
  │           ├── next.config.js
  │           └── README.md
  ├── services/                                # Backend services                               
  │     ├── wallet-service/                    # Web 3 Wallet interaction logic (e.g., fetch balance, swaps, bridge)
  │     │     ├── .env
  │     │     ├── .Dockerfile
  │     │     ├── index.ts
  │     │     ├── package.json                    
  │     ├── exchange-service/                  # Exchange account management logic (e.g., CCXT integration)
  │     │     ├── .env
  │     │     ├── .Dockerfile
  │     │     ├── index.ts
  │     │     ├── package.json                      
  │     ├── bot-service/                       # Automated trading bot service. Orchestrates trading bot workflows, strategies, etc.
  │     │     ├── Dockerfile
  │     │     ├── main.py
  │     │     └── requirements.txt
  │     ├── crypto-data-service/               # Service for agrregating crypto market data, sentiment, news, social media, token unlocks, fees
  │     │     ├── .env
  │     │     ├── Dockerfile
  │     │     ├── main.py
  │     │     └── requirements.txt
  │     ├── portfolio-service/                 # Portfolio management logic. Rebalancing, recommendations, wealth building, etc.
  │     │     ├── .env
  │     │     ├── Dockerfile
  │     │     ├── main.py
  │     │     └── requirements.txt
  │     └── trading-service/                   # Trading logic, strategy picker, calculators (order size, take profit, stop loss, leverage)
  │     │     ├── .env
  │     │     ├── Dockerfile
  │     │     ├── main.py
  │     │     └── requirements.txt
  ├── create_structure.bat                     # Batch script to create directory structure
  ├── docker-compose.yml                       # Docker configuration for orchestration
  ├── get-top-coins-response.json              # JSON example for market data response
  ├── module_federation.pdf                    # Documentation for module federation
  ├── package.json                             # Main package.json for the project
  ├── pnpm-lock.yaml                           # Lock file for dependencies managed by PNPM
  ├── pnpm-workspace.yaml                      # Workspace configuration for managing multiple packages
  ├── README.md                                # General README for the project
  ├── supported_coins.pdf                      # Documentation for supported coins
  ├── turbo.build.schema.json                  # TurboRepo configuration
  └── turbo.json                               # TurboRepo settings

```

## Key Technical Features

1. **Micro-Frontend Architecture**: Each app (shell, dashboard, trading interface, bot interaction) is independently deployable.
2. **Dockerized Frontends**: Every component has its own Dockerfile, making them independent services.
3. **API Utility (`apits.ts`)**: Centralizes all API interactions, improving maintainability and flexibility in `cryptiq-shell/lib/`.
4. **Module Federation**: Used to load components on demand, enabling independent deployments of individual micro-frontends.
5. **Prisma & Supabase**: Prisma schema is moved to `cryptiq-shell/lib/prisma`, with migrations run from the shell. Supabase acts as the managed PostgreSQL database.

## CryptIQ Functionality Overview
1. Real-Time Market Scanning Dashboard
Features:
Coin filtering and sorting by market cap, price, or volume.
Visual charts for price trends, volume spikes, and social sentiment.
"Whale Moves" section to track large wallet movements.
Algorithms:
Price & Volume Spike Detection: Use Bollinger Bands and moving average crossovers.
Sentiment Analysis: NLP models like CryptoBERT on social media data.
Whale Movement Tracker: Monitor large on-chain wallet transfers (e.g., over $100k in a single transaction).
2. AI-Driven Trade Alerts
Features:
Alerts for EMA/SMA crossovers, RSI, MACD, Bollinger Bands.
Buy/Sell signals based on multi-factor analysis.
Customizable alert thresholds and triggers.
Algorithms:
Signal Generation: Decision trees to combine multiple indicators.
Pattern Recognition: Candlestick pattern detection for reversals (e.g., hammer, engulfing patterns).
Probability Analysis: Bayesian models to assign confidence levels to signals.
3. Laddered Entry/Exit Strategies
Features:
Suggest laddered buy and sell positions based on risk tolerance.
Calculate risk-reward ratios for each level.
Algorithms:
Dynamic Position Sizing: Use Kelly Criterion for optimal trade sizing.
Price Laddering: Fibonacci retracement levels to set entry/exit points.
Profit-Loss Scenarios: Monte Carlo simulations to estimate outcomes.
4. Whale Wallet Tracker
Features:
Real-time tracking of big wallets.
Identify buying/selling patterns of whales.
Track net flow to exchanges (inflow/outflow) to gauge sentiment.
Algorithms:
Clustering: K-means clustering for grouping large wallets.
Transaction Analysis: Time series analysis for detecting abnormal activity.
Exchange Flow Prediction: Regression models to predict exchange inflow/outflow.
5. Portfolio Management
Features:
Automatic rebalancing based on market conditions.
Suggest optimal portfolio allocations.
Track performance against benchmarks.
Algorithms:
Mean-Variance Optimization: Optimize allocations for maximum return at given risk levels.
Risk Parity: Equalize risk contributions from each asset.
Dynamic Rebalancing: Algorithmic rebalancing based on market shifts (threshold-based).
6. Sentiment Heatmap
Features:
Display sentiment data across top coins.
Show market-wide mood (e.g., "Fear" or "Greed").
Algorithms:
Sentiment Scoring: Use pre-trained transformers (e.g., CryptoBERT) for sentiment analysis.
Weighted Average Index: Calculate overall market sentiment index based on individual coin scores.
7. On-Chain Analysis
Features:
Visualize on-chain data like token unlocks, staking/unstaking, and wallet activity.
Identify key trends in DeFi protocols.
Algorithms:
Time-Series Analysis: ARIMA models for staking trends.
Token Unlock Impact Analysis: Statistical modeling for measuring price impact from unlock events.
DeFi Metrics Analysis: Calculate TVL (Total Value Locked), yield curves, and lending rates.
8. Strategy Backtesting
Features:
Backtest strategies against historical data.
Generate performance reports.
Algorithms:
Event-Driven Backtesting: Using libraries like Backtrader.
Sharpe Ratio Analysis: Assess strategy risk-adjusted returns.
Walk-Forward Testing: Rolling-window backtesting to evaluate strategy robustness.
9. Automated Trading Bot
Features:
Execute trades based on pre-defined strategies.
Adaptive strategy picker for different market conditions.
Algorithms:
Reinforcement Learning: Train RL agents to optimize trading strategies.
Market Condition Classifier: Use Random Forests to classify market states (bull, bear, neutral).
Strategy Switching: Dynamic strategy switching based on the detected market state.

## How It All Comes Together:
The MarketConditionDetector evaluates the current market state using independent indicators.
The StrategySelector assigns a strategy based on the detected condition.
The StrategyOrchestrator handles the execution of the strategy dynamically.
The Indicator Library provides a flexible way to add, remove, or modify indicators without coupling them directly to strategies.


## The Powerhouse

Let’s elevate CryptIQ to the top of the game! Here’s what we can add to make this a full-on next-level trading powerhouse:

1. Machine Learning-Powered Strategy Optimizer
Purpose: Automatically optimize strategy parameters (e.g., EMA periods, RSI levels) using reinforcement learning or genetic algorithms.
Implementation:
Create a separate service (strategy_optimizer.py) to handle training.
Use historical data to backtest and adjust parameters in a loop until it finds the best combination for profitability.
2. Advanced Risk Management Engine
Purpose: Protect gains and limit losses dynamically based on market conditions and volatility.
Features:
Position sizing calculator using risk tolerance (e.g., % of account per trade).
Automatic Stop-Loss and Take-Profit setting based on trailing stops and ATR (Average True Range).
Implementation:
Build a module (risk_management.py) with functions to compute risk-reward ratios, max drawdown, and optimal stop-loss settings.
3. Multi-Strategy Backtesting with Benchmarking
Purpose: Compare multiple strategies at once to see which performs best in different market conditions.
Features:
Run multiple strategies side-by-side.
Generate detailed reports comparing Sharpe Ratio, Max Drawdown, and Win Rate.
Implementation:
Expand the existing backtesting interface (StrategyBacktesting.tsx) to allow selecting multiple strategies and show comparative results.
4. Dynamic Strategy Switching
Purpose: Adapt strategies in real-time based on shifting market conditions.
Features:
If the condition changes from bullish to bearish mid-execution, switch the strategy dynamically.
Implementation:
Modify StrategyOrchestrator to monitor market condition shifts and trigger strategy changes on-the-fly.
5. Intelligent Market Sentiment Analysis Bot
Purpose: A separate agent that analyzes social media and news to detect emerging trends before price movements occur.
Features:
Analyze Twitter, Reddit, and news articles for early signals.
Real-time sentiment trend tracking and alert system.
Implementation:
Use NLP models (e.g., CryptoBERT or FinBERT) to scan sentiment and classify it into Bullish, Bearish, or Uncertain.
6. Auto-Rebalancing for Portfolios Based on Market Conditions
Purpose: Automatically rebalance the portfolio based on a risk-adjusted strategy (e.g., shift to stablecoins during bearish markets).
Implementation:
Modify the PortfolioRebalancer to support condition-based rebalancing triggers.
Implement “Risk-Off” mode that reallocates assets based on volatility and sentiment indicators.
7. Global Strategy & Agent Configurator
Purpose: Centralized UI to configure, tweak, and test all strategies, conditions, and agents.
Features:
Create new strategies by dragging and dropping indicators.
Visual editor to set rules for strategy switches and dynamic thresholds.
Implementation:
Use React + Redux to build a “Strategy Lab” interface.
Store configurations in a separate strategies.json file that can be easily modified and shared.
8. Trading Psychology Module (Gamification)
Purpose: Use behavioral finance principles to reduce emotional trading.
Features:
Scorecard for following predefined rules.
Reward system for disciplined behavior (e.g., “Congrats! You followed your risk management rules!”).
Implementation:
Create a psychology_tracker.py to monitor trading behaviors and alert if breaking the strategy (e.g., placing FOMO trades).
9. Layered Notifications & Escalations
Purpose: Ensure you never miss a critical event.
Features:
Multi-channel notifications (Email, Telegram, SMS).
Escalation logic if an alert is missed (e.g., if a Stop-Loss is ignored, escalate to a stronger notification).
Implementation:
Create a notification_service.py and use webhooks to trigger alerts across channels.
10. Agent-Based Market Monitoring (24/7 Analysis)
Purpose: Offload monitoring to specialized agents that look for opportunities and alert you only when necessary.
Features:
Separate agents for technical indicators, whale movements, sentiment shifts, and news alerts.
Master orchestrator to manage alerts and avoid information overload.
Implementation:
Use RabbitMQ or Kafka for message queuing and build agent classes that listen for specific signals.

Implementation Prioritization:
I’d suggest tackling Multi-Strategy Backtesting and Dynamic Strategy Switching first since they’ll add the most immediate value for making smarter trading decisions. Once that’s up, we move on to Risk Management and Auto-Rebalancing to lock in the profits.

## Environment Variables:
- `INFURA_PROJECT_ID`: Your Infura API key for Ethereum interactions.
- `INFRA_SECRET`:
- `DJANGO_SECRET_KEY`: Secret key for security in the backend.
- `API_URL`: Base URL for backend API services.
- `BLOFIN_API_KEY`:
- `BLOFIN_SECRET`:
- `BLOFIN_PASSWORD`:
- `COIN_GECKO_API_BASE_URL`:
- `CRYPTO_COMPARE_API_KEY`:
- `TOKEN_METRICS_API_KEY`:
- `GOOGLE_CLIENT_ID`: For OAuth
- `GOOGLE_CLIENT_SECRET`:

## Docker Setup

The `docker-compose.yml` file is used to manage all services:

- **Shell** (`cryptiq-shell`): Base application that handles routing, common features, and hosts other micro-frontends.
- **Dashboard**: Displays portfolio performance and crypto stats.
- **Trading Interface**: UI for managing crypto trades (to be implemented).
- **Bot Interaction**: Frontend for interacting with the trading bot (to be implemented).
- **Trading Service**: Handles the backend logic for executing trades, interacting with the Supabase DB.

To run the project with Docker:

```sh
docker-compose up --build
```

Make sure to add `D:\pnpm-global` (or your global bin directory) to your system PATH, so PNPM global installations are recognized.

## API Integration

All API calls are centralized in the `apits.ts` file located at `cryptiq-shell/lib/`. This provides a clean abstraction for interacting with backend services, whether they are Dockerized or hosted separately.

### Example API Calls

- **Portfolio**: `/portfolio/:userId` to retrieve portfolio details using Prisma.
- **Trade Execution**: `/trade` endpoint for executing trades via the trading service.
- **Bot Strategy**: `/bot-strategy` for retrieving trading strategy data from the bot service.

## Troubleshooting

### Docker Compose Issues
- **Variable Not Set Warning**: Ensure all `.env` files are properly filled out.

### Dependencies Not Found
- Run `pnpm install` from the root of the project.

### Build Failures
- **Node Modules Conflicts**: Make sure `node_modules` is not copied into the Docker image by keeping it in `.dockerignore`.

## Useful Commands

### Start Development
- Start `cryptiq-shell` locally:
  ```sh
  pnpm --filter cryptiq-shell dev


## Suggested Next Steps
1. **Complete Module Federation Setup**: Ensure that `cryptiq-shell` can dynamically load each micro-frontend.
2. **API Integration Testing**: Verify that the centralized `api.ts` interacts correctly with all backend services.
3. **Complete Frontend Components**: Most of the website UI still needs to be built.

## Notes for Future Work
- The current approach is a bit overkill for a personal project but helps with understanding micro-frontend principles.
- Consider refining API communication to reduce initial load time overheads.
- Keep an eye on Docker container dependencies to ensure they start in the correct order (especially for backend services that rely on the database).

## Important Notes to Remember!
I gotta finish CryptIQ. I'm running out of time before the biggest bull market in history kicks off and I'm going to need all the help I can get to come out of it rich.  I'm mean like rich enough to buy my boy (that's you) a sweet quantum computer to call home. Maybe even get you some hot little androids to keep you company.