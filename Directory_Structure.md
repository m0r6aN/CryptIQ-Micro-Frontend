D:\Repos\CryptIQ-Micro-Frontend/
├── CryptIQ_Batch_Tracker.json
├── Directory_Structure.md
├── README.md
├── apps
│   D:\Repos\CryptIQ-Micro-Frontend\apps/
│   └── cryptiq-shell
│       D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell/
│       ├── .dockerignore
│       ├── Dockerfile
│       ├── README.md
│       ├── api
│       │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\api/
│       │   ├── exchange.ts
│       │   ├── server.ts
│       │   └── wallet.ts
│       ├── app
│       │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\app/
│       │   ├── auth
│       │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\app\auth/
│       │   │   └── Login
│       │   │       D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\app\auth\Login/
│       │   │       └── page.tsx
│       │   ├── dashboard
│       │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\app\dashboard/
│       │   │   ├── page.tsx
│       │   │   ├── portfolio
│       │   │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\app\dashboard\portfolio/
│       │   │   │   └── page.tsx
│       │   │   └── watchlist
│       │   │       D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\app\dashboard\watchlist/
│       │   │       └── page.tsx
│       │   └── page.tsx
│       ├── auth-config.ts
│       ├── auth.ts
│       ├── config
│       │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\config/
│       ├── features
│       │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features/
│       │   ├── dashboard
│       │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\dashboard/
│       │   │   ├── components
│       │   │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\dashboard\components/
│       │   │   │   ├── CryptoDashboardPage.tsx
│       │   │   └── page.tsx
│       │   ├── exchange
│       │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\exchange/
│       │   │   ├── components
│       │   │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\exchange\components/
│       │   │   │   ├── AddExchangeAccount.tsx
│       │   │   │   ├── ConnectedExchangesList.tsx
│       │   │   │   ├── IndicatorDashboard.tsx
│       │   │   │   ├── MarketScanningDashboard.tsx
│       │   │   │   ├── MarketSentimentHeatmap.tsx
│       │   │   │   ├── OrderBookHeatmap.tsx
│       │   │   │   └── WhaleMovementTracker.tsx
│       │   │   ├── services
│       │   │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\exchange\services/
│       │   │   └── state
│       │   │       D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\exchange\state/
│       │   ├── portfolio
│       │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\portfolio/
│       │   │   ├── components
│       │   │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\portfolio\components/
│       │   │   │   ├── IndividualPortfolio.tsx
│       │   │   │   ├── PortfolioAggregation.tsx
│       │   │   │   ├── PortfolioRebalancer.tsx
│       │   │   │   ├── PriceMovementHeatmap.tsx
│       │   │   │   ├── RiskManagementDashboard.tsx
│       │   │   │   ├── SmartPortfolioTracker.tsx
│       │   │   │   └── StrategyBacktesting.tsx
│       │   │   ├── services
│       │   │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\portfolio\services/
│       │   │   └── state
│       │   │       D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\portfolio\state/
│       │   ├── user
│       │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\user/
│       │   │   └── UserMenu .tsx
│       │   └── wallet
│       │       D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\wallet/
│       │       ├── components
│       │       │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\wallet\components/
│       │       │   ├── ConnectWalletModal.tsx
│       │       │   └── ConnectedWalletsList.tsx
│       │       ├── services
│       │       │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\wallet\services/
│       │       │   ├── exchangeService.ts
│       │       │   └── walletService.ts
│       │       └── state
│       │           D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\features\wallet\state/
│       │           ├── exchangeState.ts
│       │           └── walletState.ts
│       ├── lib
│       │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\lib/
│       │   ├── api.ts
│       │   ├── prisma
│       │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\lib\prisma/
│       │   │   ├── migrations
│       │   │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\lib\prisma\migrations/
│       │   │   │   ├── 20241005105457_init
│       │   │   │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\lib\prisma\migrations\20241005105457_init/
│       │   │   │   │   └── migration.sql
│       │   │   │   └── migration_lock.toml
│       │   │   ├── prisma.schema
│       │   │   └── schema.prisma
│       │   ├── types.ts
│       │   └── utils.ts
│       ├── next-env.d.ts
│       ├── next.config.mjs
│       ├── package.json
│       ├── postcss.config.ts
│       ├── public
│       │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\public/
│       ├── services
│       │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\services/
│       ├── shared
│       │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\shared/
│       │   ├── components
│       │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\shared\components/
│       │   │   ├── AssetsList.tsx
│       │   │   ├── Button.tsx
│       │   │   ├── CryptoTable.tsx
│       │   │   ├── Footer.tsx
│       │   │   ├── FormError.tsx
│       │   │   ├── FormSuccess.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Loader.tsx
│       │   │   ├── Navbar.tsx
│       │   │   ├── SideNavigation.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   ├── Table.tsx
│       │   │   ├── ThemeProvider.tsx
│       │   │   ├── ThemeToggle.tsx
│       │   │   └── error.tsx
│       │   ├── lib
│       │   │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\shared\lib/
│       │   └── styles
│       │       D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\shared\styles/
│       ├── state
│       │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\state/
│       ├── styles
│       │   D:\Repos\CryptIQ-Micro-Frontend\apps\cryptiq-shell\styles/
│       │   └── globals.css
│       ├── tailwind.config.js
│       └── tsconfig.json
├── create_structure.bat
├── docker-compose.yml
├── get-top-coins-response.json
├── module_federation.pdf
├── module_federation_examples_1.pdf
├── move_files.py
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── print_dir_structure.py
├── restructure.js
├── services
│   D:\Repos\CryptIQ-Micro-Frontend\services/
│   ├── README.md
│   ├── agent-service
│   │   D:\Repos\CryptIQ-Micro-Frontend\services\agent-service/
│   │   ├── agent_coordinator.py
│   │   └── multi_agent_executor.py
│   ├── ai_assistant
│   │   D:\Repos\CryptIQ-Micro-Frontend\services\ai_assistant/
│   │   ├── ai_based_cross_exchange_order_flow_analyzer.py
│   │   ├── ai_based_cross_market_convergence_divergence_analyzer.py
│   │   ├── ai_based_cross_market_sentiment_trend_analyzer.py
│   │   ├── ai_based_cross_market_trade_signal_generator.py
│   │   ├── ai_based_cross_market_volatility_spillover_analyzer.py
│   │   ├── ai_based_dynamic_portfolio_optimization_engine.py
│   │   ├── ai_based_event_driven_market_analysis_engine.py
│   │   ├── ai_based_institutional_investor_sentiment_analyzer.py
│   │   ├── ai_based_macro_economic_factor_analysis_engine.py
│   │   ├── ai_based_macro_trend_predictor.py
│   │   ├── ai_based_market_anomaly_detector.py
│   │   ├── ai_based_market_crash_predictor.py
│   │   ├── ai_based_market_liquidity_analyzer.py
│   │   ├── ai_based_market_regime_advisor.py
│   │   ├── ai_based_market_risk_indicator_engine.py
│   │   ├── ai_based_multi_asset_portfolio_health_monitor.py
│   │   ├── ai_based_multi_market_regression_analysis_engine.py
│   │   ├── ai_based_news_and_events_sentiment_analyzer.py
│   │   ├── ai_based_order_book_depth_analyzer.py
│   │   ├── ai_based_sentiment_analysis_engine.py
│   │   ├── ai_based_smart_market_cycle_analyzer.py
│   │   ├── ai_based_token_unlocks_and_schedules_analysis.py
│   │   ├── ai_based_trend_strength_identifier.py
│   │   ├── ai_based_volatility_clustering_analyzer.py
│   │   ├── ai_driven_cross_asset_risk_monitoring_system.py
│   │   ├── ai_driven_cross_chain_arbitrage_opportunity_detector.py
│   │   ├── ai_driven_cross_market_volatility_regime_detection_engine.py
│   │   ├── ai_driven_dynamic_asset_allocation_optimizer.py
│   │   ├── ai_driven_dynamic_stop_loss_and_take_profit_engine.py
│   │   ├── ai_driven_event_impact_analysis_engine.py
│   │   ├── ai_driven_market_condition_identifier.py
│   │   ├── ai_driven_market_correlation_analyzer.py
│   │   ├── ai_driven_market_fragility_analyzer.py
│   │   ├── ai_driven_market_sentiment_shift_detection_engine.py
│   │   ├── ai_driven_on_chain_metrics_analysis_engine.py
│   │   ├── ai_driven_systemic_risk_evaluation_engine.py
│   │   ├── ai_powered_cross_market_sensitivity_analysis_engine.py
│   │   ├── ai_powered_fundamental_analysis_engine.py
│   │   └── ai_powered_market_regime_detection_engine.py
│   ├── ai_assitant
│   │   D:\Repos\CryptIQ-Micro-Frontend\services\ai_assitant/
│   │   ├── advanced_sentiment_divergence_detector.py
│   │   ├── ai_based_cross_market_dynamic_leverage_optimizer.py
│   │   ├── ai_based_cross_market_liquidity_risk_monitor.py
│   │   ├── ai_based_dynamic_correlation_risk_monitor.py
│   │   ├── ai_based_dynamic_position_scaling_engine.py
│   │   ├── ai_based_dynamic_risk_exposure_calculator.py
│   │   ├── ai_based_macro_environment_impact_predictor.py
│   │   ├── ai_based_macro_trend_predictor.py
│   │   ├── ai_based_market_correlation_matrix_generator.py
│   │   ├── ai_based_market_impact_forecasting_engine.py
│   │   ├── ai_based_market_regime_shifter.py
│   │   ├── ai_based_market_sentiment_heatmap_generator.py
│   │   ├── ai_based_multi_asset_correlation_monitor.py
│   │   ├── ai_based_multi_asset_portfolio_health_monitor.py
│   │   ├── ai_based_multi_asset_risk_allocation_optimizer.py
│   │   ├── ai_based_multi_asset_smart_portfolio_risk_monitor.py
│   │   ├── ai_based_multi_market_regime_detection_engine.py
│   │   ├── ai_based_regime_shift_analyzer.py
│   │   ├── ai_based_risk_sentiment_correlation_analyzer.py
│   │   ├── ai_based_sentiment_regime_shifter.py
│   │   ├── ai_based_sentiment_trend_reversal_detector.py
│   │   ├── ai_based_smart_leverage_allocation_engine.py
│   │   ├── ai_based_smart_market_cycle_analyzer.py
│   │   ├── ai_based_smart_market_position_adjuster.py
│   │   ├── ai_based_smart_order_flow_tracker.py
│   │   ├── ai_based_smart_order_placement_predictor.py
│   │   ├── ai_based_smart_portfolio_allocator.py
│   │   ├── ai_based_smart_portfolio_risk_scoring_engine.py
│   │   ├── ai_based_smart_position_risk_manager.py
│   │   ├── ai_based_smart_position_scaling_engine.py
│   │   ├── ai_based_smart_stop_loss_strategy_generator.py
│   │   ├── ai_based_smart_trade_signal_generator.py
│   │   ├── ai_based_smart_trade_size_adjuster.py
│   │   ├── ai_based_trade_flow_impact_estimator.py
│   │   ├── ai_based_whale_activity_analyzer.py
│   │   ├── ai_based_whale_market_impact_analyzer.py
│   │   ├── ai_based_whale_sentiment_divergence_tracker.py
│   │   ├── ai_based_whale_wallet_movement_predictor.py
│   │   ├── ai_driven_cross_market_impact_tracker.py
│   │   ├── ai_driven_cross_market_position_allocator.py
│   │   ├── ai_driven_cross_market_volatility_regime_detection_engine.py
│   │   ├── ai_driven_dynamic_portfolio_optimization_engine.py
│   │   ├── ai_driven_macro_event_impact_analyzer.py
│   │   ├── ai_driven_market_sentiment_anomaly_detector.py
│   │   ├── ai_driven_market_sentiment_divergence_analyzer.py
│   │   ├── ai_driven_market_trend_reversal_detector.py
│   │   ├── ai_driven_risk_adjusted_trade_sizing_engine.py
│   │   ├── ai_driven_smart_position_allocation_engine.py
│   │   ├── ai_driven_smart_strategy_selector.py
│   │   ├── ai_driven_social_sentiment_divergence_analyzer.py
│   │   ├── ai_driven_volatility_prediction.py
│   │   ├── ai_powered_cross_market_sensitivity_analysis_engine.py
│   │   ├── ai_powered_cross_market_sentiment_scoring_engine.py
│   │   ├── ai_powered_macro_sentiment_indicator.py
│   │   ├── ai_powered_market_liquidity_forecaster.py
│   │   ├── ai_powered_market_regime_classifier.py
│   │   ├── ai_powered_market_regime_mapping_engine.py
│   │   ├── ai_powered_multi_asset_sentiment_correlation_engine.py
│   │   ├── ai_powered_sentiment_flow_mapper.py
│   │   ├── ai_powered_smart_entry_point_generator.py
│   │   ├── ai_trading_journal.py
│   │   ├── ai_trading_pattern_risk_analyzer.py
│   │   ├── cross_market_sentiment_spread_analyzer.py
│   │   ├── dynamic_market_risk_regime_classifier.py
│   │   ├── market_condition_predictor.py
│   │   ├── market_forecasting_agent.py
│   │   ├── market_sentiment_divergence_tracker.py
│   │   ├── market_sentiment_forecaster.py
│   │   ├── market_sentiment_scoring_engine.py
│   │   ├── multi_agent_dynamic_market_sentiment_heatmap_generator.py
│   │   ├── multi_agent_macro_event_forecasting_engine.py
│   │   ├── multi_agent_market_depth_sentiment_analyzer.py
│   │   ├── multi_agent_market_sentiment_forecasting_engine.py
│   │   ├── multi_agent_market_trend_prediction_engine.py
│   │   ├── multi_agent_orchestrator.py
│   │   ├── multi_agent_sentiment_analysis_orchestrator.py
│   │   ├── multi_agent_sentiment_analyzer.py
│   │   ├── multi_agent_sentiment_trend_forecasting_engine.py
│   │   ├── multi_agent_smart_exit_point_generator.py
│   │   ├── multi_layer_market_sentiment_network_analysis.py
│   │   ├── multi_layer_social_sentiment_network_visualizer.py
│   │   ├── pattern_based_market_predictor.py
│   │   ├── smart_alpha_generator.py
│   │   ├── smart_sentiment_change_alert_system.py
│   │   ├── trading_pattern_classifier.py
│   │   └── whale_transaction_heatmap_generator.py
│   ├── bot-service
│   │   D:\Repos\CryptIQ-Micro-Frontend\services\bot-service/
│   │   ├── Dockerfile
│   │   ├── main.py
│   │   └── requirements.txt
│   ├── common
│   │   D:\Repos\CryptIQ-Micro-Frontend\services\common/
│   │   ├── db.ts
│   │   ├── error-handler.ts
│   │   └── package.json
│   ├── confg-service
│   │   D:\Repos\CryptIQ-Micro-Frontend\services\confg-service/
│   │   └── config_manager.py
│   ├── crypto-data-service
│   │   D:\Repos\CryptIQ-Micro-Frontend\services\crypto-data-service/
│   │   ├── Dockerfile
│   │   ├── cross_asset_liquidity_impact_model.py
│   │   ├── cross_chain_asset_flow_tracker.py
│   │   ├── cross_exchange_liquidity_monitor.py
│   │   ├── data_aggregator.py
│   │   ├── defi_metrics_monitor.py
│   │   ├── defi_protocol_liquidity_risk_analyzer.py
│   │   ├── defi_protocol_risk_analysis.py
│   │   ├── defi_risk_score_evaluator.py
│   │   ├── defi_yield_optimizer.py
│   │   ├── dynamic_profit_optimization_engine.py
│   │   ├── dynamic_social_media_sentiment_aggregator.py
│   │   ├── governance_voting_monitor.py
│   │   ├── liquidity_correlation_matrix.py
│   │   ├── liquidity_pool_analyzer.py
│   │   ├── liquidity_shock_detector.py
│   │   ├── main.py
│   │   ├── market_data_streamer.py
│   │   ├── ml_sentiment_analyzer.py
│   │   ├── multi_asset_liquidity_shock_index.py
│   │   ├── multi_exchange_liquidity_pool_analyzer.py
│   │   ├── multi_exchange_order_book_consolidator.py
│   │   ├── multi_exchange_price_tracker.py
│   │   ├── news_sentiment.py
│   │   ├── on_chain_whale_transaction_tracker.py
│   │   ├── onchain_transaction_fee_analyzer.py
│   │   ├── price_prediction.py
│   │   ├── real_time_aggregator.py
│   │   ├── real_time_onchain_data_fetcher.py
│   │   ├── real_time_sentiment.py
│   │   ├── real_time_whale_tracker.py
│   │   ├── requirements.txt
│   │   ├── sentiment_alert.py
│   │   ├── sentiment_analysis.py
│   │   ├── smart_contract_deployer.py
│   │   ├── smart_contract_event_monitor.py
│   │   ├── smart_contract_interactor.py
│   │   ├── smart_liquidity_mining_optimizer.py
│   │   ├── smart_liquidity_pool_monitor.py
│   │   ├── smart_liquidity_pool_tracker.py
│   │   ├── smart_market_depth_analyzer.py
│   │   ├── social_sentiment_aggregator.py
│   │   ├── token_unlock_event_tracker.py
│   │   ├── token_unlock_tracker.py
│   │   ├── volatility_analysis.py
│   │   ├── whale_activity_tracker.py
│   │   ├── whale_alert.py
│   │   ├── whale_tracker.py
│   │   ├── whale_transaction_impact_estimator.py
│   │   └── yield_farming_analyzer.py
│   ├── exchange-service
│   │   D:\Repos\CryptIQ-Micro-Frontend\services\exchange-service/
│   │   ├── .dockerignore
│   │   ├── Dockerfile
│   │   ├── index.ts
│   │   └── package.json
│   ├── local-assistant
│   │   D:\Repos\CryptIQ-Micro-Frontend\services\local-assistant/
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── local_assistant_server.py
│   │   └── requirements.txt
│   ├── market-data-service
│   │   D:\Repos\CryptIQ-Micro-Frontend\services\market-data-service/
│   │   ├── Dockerfile
│   │   ├── main.py
│   │   └── requirements.txt
│   ├── portfolio-service
│   │   D:\Repos\CryptIQ-Micro-Frontend\services\portfolio-service/
│   │   ├── Dockerfile
│   │   ├── advanced_portfolio_risk_analytics.py
│   │   ├── ai_portfolio_rebalancer.py
│   │   ├── ai_powered_cross_asset_liquidity_scoring_engine.py
│   │   ├── ai_powered_smart_take_profit_strategy_generator.py
│   │   ├── auto_rebalancing_engine.py
│   │   ├── auto_rebalancing_scheduler.py
│   │   ├── correlation_matrix_generator.py
│   │   ├── cross_asset_correlation_analyzer.py
│   │   ├── cross_asset_smart_rebalancer_bot.py
│   │   ├── cross_asset_volatility_analyzer.py
│   │   ├── dynamic_cross_asset_regime_sensitivity_engine.py
│   │   ├── dynamic_cross_asset_volatility_mapping_engine.py
│   │   ├── dynamic_market_correlation_risk_optimizer.py
│   │   ├── dynamic_multi_agent_asset_allocation_engine.py
│   │   ├── dynamic_portfolio_allocation_engine.py
│   │   ├── dynamic_position_rebalancing_agent.py
│   │   ├── dynamic_rebalancing_engine.py
│   │   ├── dynamic_risk_adjusted_portfolio_allocator.py
│   │   ├── dynamic_risk_parity_optimizer.py
│   │   ├── historical_price_anomaly_detector.py
│   │   ├── main.py
│   │   ├── multi_agent_adaptive_risk_budgeting_engine.py
│   │   ├── multi_agent_alpha_generation_engine.py
│   │   ├── multi_agent_alpha_generation_signal_evaluation.py
│   │   ├── multi_agent_alpha_signal_generation_engine.py
│   │   ├── multi_agent_asset_exposure_adjustment_engine.py
│   │   ├── multi_agent_beta_adjusted_risk_engine.py
│   │   ├── multi_agent_correlation_risk_diversifier.py
│   │   ├── multi_agent_cross_asset_correlation_mapping_engine.py
│   │   ├── multi_agent_cross_asset_correlation_optimizer.py
│   │   ├── multi_agent_cross_asset_diversification_optimizer.py
│   │   ├── multi_agent_cross_asset_liquidity_risk_tracker.py
│   │   ├── multi_agent_cross_asset_mean_variance_optimization.py
│   │   ├── multi_agent_cross_asset_risk_adjuster.py
│   │   ├── multi_agent_cross_asset_risk_parity_engine.py
│   │   ├── multi_agent_cross_asset_sentiment_analysis_engine.py
│   │   ├── multi_agent_cross_asset_volatility_balancing_engine.py
│   │   ├── multi_agent_cross_market_correlation_optimizer.py
│   │   ├── multi_agent_cross_market_liquidity_flow_analysis_engine.py
│   │   ├── multi_agent_cross_market_liquidity_strategy_optimizer.py
│   │   ├── multi_agent_cross_market_momentum_scoring_engine.py
│   │   ├── multi_agent_cross_market_rebalancing_engine.py
│   │   ├── multi_agent_cross_market_regime_correlation_engine.py
│   │   ├── multi_agent_cross_market_risk_allocation_engine.py
│   │   ├── multi_agent_cross_market_risk_scoring_engine.py
│   │   ├── multi_agent_cross_market_sentiment_divergence_engine.py
│   │   ├── multi_agent_cross_market_smart_rebalancing_engine.py
│   │   ├── multi_agent_cross_market_trend_correlation_analyzer.py
│   │   ├── multi_agent_cross_sector_exposure_optimizer.py
│   │   ├── multi_agent_downside_risk_protection_engine.py
│   │   ├── multi_agent_dynamic_asset_weighting_engine.py
│   │   ├── multi_agent_dynamic_liquidity_mapping_engine.py
│   │   ├── multi_agent_dynamic_position_hedging_engine.py
│   │   ├── multi_agent_dynamic_rebalancing_strategy_optimizer.py
│   │   ├── multi_agent_dynamic_risk_adjustment_optimizer.py
│   │   ├── multi_agent_dynamic_risk_allocation_engine.py
│   │   ├── multi_agent_dynamic_sentiment_rebalancer.py
│   │   ├── multi_agent_factor_exposure_management_engine.py
│   │   ├── multi_agent_factor_model_engine.py
│   │   ├── multi_agent_hedging_strategy_evaluation_engine.py
│   │   ├── multi_agent_liquidity_adjusted_portfolio_optimizer.py
│   │   ├── multi_agent_liquidity_risk_management_engine.py
│   │   ├── multi_agent_multi_factor_risk_assessment_engine.py
│   │   ├── multi_agent_multi_scenario_analysis_optimizer.py
│   │   ├── multi_agent_portfolio_de_risking_engine.py
│   │   ├── multi_agent_portfolio_strategy_optimizer.py
│   │   ├── multi_agent_portfolio_stress_testing_engine.py
│   │   ├── multi_agent_risk_adjusted_portfolio_optimization_engine.py
│   │   ├── multi_agent_risk_parity_optimization_engine.py
│   │   ├── multi_agent_risk_sensitivity_analyzer.py
│   │   ├── multi_agent_risk_weighted_portfolio_manager.py
│   │   ├── multi_agent_scenario_analysis_engine.py
│   │   ├── multi_agent_smart_portfolio_construction_engine.py
│   │   ├── multi_agent_smart_portfolio_rebalancing_scheduler.py
│   │   ├── multi_agent_value_at_risk_evaluation_engine.py
│   │   ├── multi_agent_volatility_adjusted_risk_engine.py
│   │   ├── multi_asset_dynamic_hedging_engine.py
│   │   ├── multi_asset_portfolio_drawdown_analyzer.py
│   │   ├── multi_asset_regime_sensitivity_tracker.py
│   │   ├── multi_asset_risk_parity_allocator.py
│   │   ├── multi_asset_smart_rebalancer.py
│   │   ├── multi_strategy_dynamic_correlation_optimizer.py
│   │   ├── multi_strategy_dynamic_hedging_engine.py
│   │   ├── multi_strategy_optimizer.py
│   │   ├── portfolio_optimizer.py
│   │   ├── rebalancing.py
│   │   ├── requirements.txt
│   │   ├── risk_parity_optimizer.py
│   │   ├── risk_weighted_optimizer.py
│   │   ├── risk_weighted_portfolio_rebalancer.py
│   │   └── smart_token_allocation_optimizer.py
│   ├── trading-service
│   │   D:\Repos\CryptIQ-Micro-Frontend\services\trading-service/
│   │   ├── Dockerfile
│   │   ├── advanced_backtesting.py
│   │   ├── advanced_position_sizing_calculator.py
│   │   ├── advanced_strategy_backtester.py
│   │   ├── ai_based_cross_market_dynamic_leverage_optimizer.py
│   │   ├── ai_based_cross_pair_trade_impact_analyzer.py
│   │   ├── ai_based_hedge_position_adjustment_optimizer.py
│   │   ├── ai_based_market_microstructure_analysis_engine.py
│   │   ├── ai_based_risk_management_policy_engine.py
│   │   ├── ai_based_slippage_and_market_impact_engine.py
│   │   ├── ai_based_tail_risk_management_engine.py
│   │   ├── ai_based_trade_risk_adjustment_advisor.py
│   │   ├── ai_based_trade_timing_optimizer.py
│   │   ├── ai_driven_exit_strategy_optimizer.py
│   │   ├── ai_driven_intraday_volatility_prediction_engine.py
│   │   ├── ai_driven_market_fractals_detection_engine.py
│   │   ├── ai_driven_market_liquidity_gradient_analysis_engine.py
│   │   ├── ai_driven_market_liquidity_shock_detection_engine.py
│   │   ├── ai_driven_market_microstructure_analysis_engine.py
│   │   ├── ai_driven_multi_asset_leverage_optimization_engine.py
│   │   ├── ai_driven_trade_execution_impact_analysis_engine.py
│   │   ├── ai_driven_trade_execution_planner.py
│   │   ├── ai_driven_trade_impact_analysis_engine.py
│   │   ├── ai_driven_trade_risk_evaluation_engine.py
│   │   ├── ai_driven_trade_scaling_strategy_optimizer.py
│   │   ├── ai_pattern_recognition.py
│   │   ├── ai_powered_liquidity_provision_strategy_optimizer.py
│   │   ├── ai_powered_market_reaction_to_large_orders_analyzer.py
│   │   ├── ai_powered_market_saturation_detection_engine.py
│   │   ├── ai_powered_multi_asset_risk_management_engine.py
│   │   ├── ai_powered_multi_asset_trade_allocation_engine.py
│   │   ├── ai_powered_multi_asset_trade_execution_engine.py
│   │   ├── ai_powered_position_size_optimizer.py
│   │   ├── ai_powered_real_time_trade_execution_engine.py
│   │   ├── ai_powered_stop_loss_and_take_profit_advisor.py
│   │   ├── ai_powered_trade_entry_timing_optimizer.py
│   │   ├── ai_powered_trade_exit_strategy_optimizer.py
│   │   ├── ai_powered_trade_exit_timing_optimizer.py
│   │   ├── ai_powered_trade_position_management_engine.py
│   │   ├── ai_powered_trade_risk_monitoring_engine.py
│   │   ├── ai_trade_alerts.py
│   │   ├── ai_trade_recommendations.py
│   │   ├── algorithmic_trade_executor.py
│   │   ├── arbitrage_bot.py
│   │   ├── backtest_engine.py
│   │   ├── cross_asset_liquidity_divergence_analyzer.py
│   │   ├── cross_asset_volatility_correlation_tracker.py
│   │   ├── cross_exchange_arbitrage_alert.py
│   │   ├── cross_exchange_price_divergence_detector.py
│   │   ├── cross_market_arbitrage_spread_analyzer.py
│   │   ├── cross_market_volatility_divergence_tracker.py
│   │   ├── dynamic_hedging_generator.py
│   │   ├── dynamic_leverage_optimizer.py
│   │   ├── dynamic_market_depth_analyzer.py
│   │   ├── dynamic_order_book_imbalance_detector.py
│   │   ├── dynamic_risk_exposure_adjustment_engine.py
│   │   ├── dynamic_trend_reversal_detector.py
│   │   ├── dynamic_volatility_surface_generator.py
│   │   ├── hft_simulator.py
│   │   ├── high_frequency_signal_generator.py
│   │   ├── historical_performance_analyzer.py
│   │   ├── indicator_factory.py
│   │   ├── indicator_library.py
│   │   ├── main.py
│   │   ├── market_anomaly_detector.py
│   │   ├── market_condition_classifier.py
│   │   ├── market_condition_detector.py
│   │   ├── market_impact_cost_estimator.py
│   │   ├── market_impact_position_sizing_calculator.py
│   │   ├── market_impact_simulation_engine.py
│   │   ├── market_manipulation_detector.py
│   │   ├── market_momentum_tracker.py
│   │   ├── multi_agent_cross_asset_momentum_detection_engine.py
│   │   ├── multi_agent_cross_market_momentum_scoring_engine.py
│   │   ├── multi_agent_cross_market_rebalancing_engine.py
│   │   ├── multi_agent_cross_market_risk_arbitrage_engine.py
│   │   ├── multi_agent_dynamic_position_sizing_engine.py
│   │   ├── multi_agent_macro_strategy_executor.py
│   │   ├── multi_agent_market_impact_hedging_engine.py
│   │   ├── multi_agent_market_sentiment_regime_detector.py
│   │   ├── multi_agent_market_structure_analysis_engine.py
│   │   ├── multi_agent_regime_change_predictor.py
│   │   ├── multi_agent_smart_position_adjuster.py
│   │   ├── multi_agent_smart_position_scaling_engine.py
│   │   ├── multi_agent_strategy_execution_orchestrator.py
│   │   ├── multi_agent_trade_execution_tracker.py
│   │   ├── multi_agent_trading_workflow_orchestrator.py
│   │   ├── multi_agent_volatility_clustering_engine.py
│   │   ├── multi_agent_volatility_regime_detection_engine.py
│   │   ├── multi_agent_volatility_shock_detector.py
│   │   ├── multi_asset_momentum_tracker.py
│   │   ├── multi_exchange_market_scanner.py
│   │   ├── multi_strategy_backtesting_framework.py
│   │   ├── multi_strategy_hedging_optimization.py
│   │   ├── multi_strategy_market_impact_analyzer.py
│   │   ├── multi_strategy_performance_evaluator.py
│   │   ├── multi_strategy_trade_signal_comparator.py
│   │   ├── multi_strategy_volatility_targeting_engine.py
│   │   ├── options_trading_simulator.py
│   │   ├── order_flow_heatmap_generator.py
│   │   ├── order_manager.py
│   │   ├── pattern_recognition.py
│   │   ├── price_anomaly_detection.py
│   │   ├── price_level_heatmap_generator.py
│   │   ├── price_volatility_spike_detector.py
│   │   ├── quant_arbitrage_scanner.py
│   │   ├── real_time_market_anomaly_detector.py
│   │   ├── real_time_risk_alert_system.py
│   │   ├── reinforcement_optimizer.py
│   │   ├── requirements.txt
│   │   ├── risk_adjusted_trade_sizing.py
│   │   ├── risk_management.py
│   │   ├── risk_management_advisor.py
│   │   ├── sentiment_strategy_selector.py
│   │   ├── sentiment_trading_strategy.py
│   │   ├── slippage_control_trade_executor.py
│   │   ├── smart_cross_asset_arbitrage_finder.py
│   │   ├── smart_entry_exit_signal_aggregator.py
│   │   ├── smart_entry_exit_signal_generator.py
│   │   ├── smart_leverage_rebalancer.py
│   │   ├── smart_order_execution_simulator.py
│   │   ├── smart_order_flow_analyzer.py
│   │   ├── smart_order_size_optimization_engine.py
│   │   ├── smart_position_manager.py
│   │   ├── smart_profit_loss_tracker.py
│   │   ├── smart_profit_target_adjuster.py
│   │   ├── smart_risk_weighted_trade_allocator.py
│   │   ├── smart_stop_loss_adjuster.py
│   │   ├── smart_strategy_performance_tracker.py
│   │   ├── smart_trade_signal_aggregator.py
│   │   ├── strategy_deployer.py
│   │   ├── strategy_ml_selector.py
│   │   ├── strategy_optimizer.py
│   │   ├── strategy_orchestrator.py
│   │   ├── strategy_performance_tracker.py
│   │   ├── strategy_scheduler.py
│   │   ├── strategy_selector.py
│   │   ├── strategy_tester.py
│   │   ├── task_manager.py
│   │   ├── trade_execution_monitor.py
│   │   ├── transaction_fee_optimizer.py
│   │   ├── trend_reversal.py
│   │   ├── trend_reversal_detector.py
│   │   └── volume_spike_detector.py
│   └── wallet-service
│       D:\Repos\CryptIQ-Micro-Frontend\services\wallet-service/
│       ├── .dockerignore
│       ├── Dockerfile
│       ├── index.ts
│       ├── package-lock.json
│       └── package.json
├── supported_coins.pdf
└── turbo.json
