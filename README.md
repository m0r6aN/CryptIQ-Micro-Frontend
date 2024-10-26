# CryptIQ Micro-Frontend

## Overview

CryptIQ is a crypto portfolio management tool and automated trading bot implemented with a micro-frontend architecture. It's designed as a learning platform for exploring micro-frontend principles, with each part of the application broken into separate services.

## Prerequisites

- Next, React, Python, fastify
- Node.js: Node 18+, lts-slim
- Docker and Docker Compose
- turbo, pnpm (`npm install -g pnpm`)

## Key Technical Features

1. Micro-Frontend Architecture
2. Dockerized Frontends
3. API Utility (`apits.ts`)
4. Module Federation
5. Prisma & Supabase

## CryptIQ Functionality

1. Real-Time Market Scanning Dashboard
2. AI-Driven Trade Alerts
3. Laddered Entry/Exit Strategies
4. Whale Wallet Tracker
5. Portfolio Management
6. Sentiment Heatmap
7. On-Chain Analysis
8. Strategy Backtesting
9. Automated Trading Bot

## Advanced Features

1. Machine Learning-Powered Strategy Optimizer
2. Advanced Risk Management Engine
3. Multi-Strategy Backtesting with Benchmarking
4. Dynamic Strategy Switching
5. Intelligent Market Sentiment Analysis Bot
6. Auto-Rebalancing for Portfolios
7. Global Strategy & Agent Configurator
8. Trading Psychology Module (Gamification)
9. Layered Notifications & Escalations
10. Agent-Based Market Monitoring

## Integration Strategy

1. Microservices & APIs
2. Orchestrator for Task Management
3. Agent Collaboration
4. Data Flow and State Management
5. Front-End User Interface
6. Execution Context and State Tracking
7. Auto-Scaling & Orchestration
8. Security and Access Control
9. Testing & Simulated Environment

## Local Services

1. The services that power much of the frontend functionality run in docker containers on localhost:[5000-5010]
2. See Directory_Structure.md for details.

## Scalability and Performance

1. Implement Redis caching layer for frequently accessed data
2. Use WebSockets for real-time updates to reduce API polling

## Service Bus vs. Direct Communication

1. Service Bus (Kafka) Use Cases:
    - Orchestration & Monitoring: For tracking, logging, and orchestration logic, it’s perfect. Keeps the big picture visible and maintains a clear audit trail.
    - Broadcasts & Alerts: When multiple agents might need the same information (e.g., market updates, error handling).
    - Asynchronous Tasks: When tasks don’t need real-time responses, or you want to maintain loose coupling between agents.

2. Direct Agent-to-Agent Communication:
    - Tool Utilization: If an agent is simply leveraging another’s capability (e.g., calling a specialized analysis agent for quick data processing), direct communication is faster and cleaner.
    - Performance-Critical Interactions: Real-time trades, rapid-response decision-making, or when milliseconds count.
T   - ight Coupling by Design: When agents are designed to work closely together (e.g., StrategyAgent always calling TradeExecutorAgent).

## Recommendation: Hybrid Approach

Use a hybrid model where:
    - Service Bus for orchestration, task routing, and high-level workflow management.
    - Direct Communication for specialized interactions, like a parent agent offloading subtasks to child agents in a tightly integrated workflow.

## Security Enhancements

1. Implement API rate limiting
2. Add Two-Factor Authentication (2FA) for user accounts
3. Encrypt sensitive data at rest and in transit

## Testing Strategy

1. Implement unit testing, integration testing, and end-to-end testing
2. Set up automated UI tests using Cypress or Selenium

## Monitoring and Logging

1. Implement centralized logging system (ELK stack)
2. Set up Application Performance Monitoring (APM) tools

## Documentation

1. Create API documentation using Swagger or OpenAPI
2. Develop a comprehensive developer guide for onboarding

## Internationalization

1. Implement i18n support for global audience

## Accessibility

1. Ensure UI components are WCAG compliant

## CI/CD Pipeline

1. Implement automated testing and deployment pipeline

## Error Handling and Fallback Strategies

1. Implement graceful degradation for service unavailability
2. Create comprehensive error handling system with user-friendly messages

## Data Visualization

1. Integrate advanced charting libraries (e.g., D3.js)

## Environment Variables

- `INFURA_PROJECT_ID`
- `INFRA_SECRET`
- `DJANGO_SECRET_KEY`
- `API_URL`
- `BLOFIN_API_KEY`
- `BLOFIN_SECRET`
- `BLOFIN_PASSWORD`
- `COIN_GECKO_API_BASE_URL`
- `CRYPTO_COMPARE_API_KEY`
- `TOKEN_METRICS_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## Docker Setup

Use `docker-compose up --build` to run the project.

## API Integration

API calls are centralized in `cryptiq-shell/lib/apits.ts`.

## Troubleshooting

- Ensure all `.env` files are properly filled out.
- Run `pnpm install` from the root of the project.
- Keep `node_modules` in `.dockerignore`.

## Useful Commands

Start `cryptiq-shell` locally: `pnpm --filter cryptiq-shell dev`

## Next Steps

- Customizable column visibility
- Simple moving averages (SMA)
- Basic alerts system
- Save favorite filters
- Built in filters and alerts for various trade setups (scalping, intraday, and swing)
- Each trade setup includes entry and exit prices.
- For longer trades exit prices should be shown as laddered take profits.
- Suggested leverage 3x-150x

## Future Enhancements

Here's a comprehensive list of potential future enhancements for our crypto portfolio manager:

## Advanced Filtering

- Percentage change filters for multiple timeframes (1h, 24h, 7d)
- Market cap filtering
- Trading pair filtering (USDT, BTC, ETH pairs)
- Volume/Price ratio filtering
- Custom indicator filtering (RSI, MACD, etc.)
- Save favorite filter combinations
- Quick presets for common scalping scenarios

## Technical Analysis Features

- Simple moving averages (SMA) integration
- Exponential moving averages (EMA)
- Relative Strength Index (RSI) indicator
- Volume profile analysis
- Support/Resistance levels detection
- Trend direction indicators
- Price momentum indicators

## User Experience Improvements

- Dark/Light theme toggle
- Customizable column visibility
- Resizable columns
- Exportable data (CSV, Excel)
- Custom layout saving
- Keyboard shortcuts for quick filtering
- Mobile-responsive design
- Multiple view modes (table, grid, compact)

## Real-time Features

- Price alerts system
- WebSocket integration for live updates
- Price change notifications
- Volume spike alerts
- Trend break notifications
- Custom alert conditions
- Audio alerts for significant events
  
## Additional Data Visualization

- Mini charts in table cells
- Volume profile visualization
- Heat map view of market sectors
- Price action patterns recognition
- Volatility visualization
- Liquidity flow indicators
- Market depth visualization

## Portfolio Integration

- Track positions
- P&L calculations
- Position sizing suggestions
- Risk management tools
- Portfolio performance metrics
- Trade journal integration
- Position entry/exit markers
  
## Market Analysis Tools

- Market sentiment indicators
- Cross-exchange price comparison
- Arbitrage opportunity detection
- Correlation matrix
- Volatility analysis tools
- Market dominance tracking
- Liquidity analysis

## Performance Optimizations

- Data caching
- Virtual scrolling for large datasets
- Optimized re-rendering
- Worker thread calculations
- Efficient data structures
- Lazy loading of advanced features
- Compressed data transfer

## Social Features

- Share filter configurations
- Community trading setups
- Popular trading pair tracking
- Market sentiment sharing
- Collaborative watchlists
- Trading strategy sharing
- Community alerts

## Risk Management

- Position size calculator
- Risk/reward ratio calculator
- Maximum drawdown warnings
- Volatility-based position sizing
- Portfolio exposure warnings
- Correlation-based risk analysis
- Market stress indicators

## API Integrations

- Multiple exchange support
- News feed integration
- Social media sentiment analysis
- Trading bot integration
- Portfolio tracker connections
- Market data provider integrations
- Trading journal synchronization

## Educational Features

- Pattern recognition tutorials
- Strategy backtesting tools
- Paper trading mode
- Risk management guidelines
- Market condition indicators
- Trading psychology tools
- Performance analytics