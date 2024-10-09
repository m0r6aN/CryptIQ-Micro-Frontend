import pandas as pd

class MultiAgentRiskAdjustedPortfolioOptimizationEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, optimization_function):
        self.agents.append({'agent_name': agent_name, 'optimize_portfolio': optimization_function})

    def optimize_portfolio(self, portfolio_data: pd.DataFrame):
        optimization_results = {}
        for agent in self.agents:
            optimization_results[agent['agent_name']] = agent['optimize_portfolio'](portfolio_data)
        return optimization_results

def dummy_optimization_agent_1(data):
    return f"Agent 1 optimized portfolio with {data.shape[0]} assets"

def dummy_optimization_agent_2(data):
    return f"Agent 2 used risk-adjusted optimization on columns: {data.columns}"

engine = MultiAgentRiskAdjustedPortfolioOptimizationEngine()
engine.register_agent('Dummy Optimization Agent 1', dummy_optimization_agent_1)
engine.register_agent('Dummy Optimization Agent 2', dummy_optimization_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'LTC'], 'Value': [10000, 5000, 2000]})
print("Risk-Adjusted Portfolio Optimization Results:", engine.optimize_portfolio(portfolio_data))
