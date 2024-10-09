import pandas as pd

class MultiAgentCrossAssetMeanVarianceOptimizer:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, optimization_function):
        self.agents.append({'agent_name': agent_name, 'optimize_mean_variance': optimization_function})

    def optimize_mean_variance(self, portfolio_data: pd.DataFrame):
        optimization_results = {}
        for agent in self.agents:
            optimization_results[agent['agent_name']] = agent['optimize_mean_variance'](portfolio_data)
        return optimization_results

def dummy_optimizer_agent_1(data):
    return f"Agent 1 optimized mean-variance for {data.shape[0]} assets"

def dummy_optimizer_agent_2(data):
    return f"Agent 2 calculated optimal allocation using columns: {data.columns}"

engine = MultiAgentCrossAssetMeanVarianceOptimizer()
engine.register_agent('Dummy Optimizer Agent 1', dummy_optimizer_agent_1)
engine.register_agent('Dummy Optimizer Agent 2', dummy_optimizer_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'BNB'], 'Return': [0.1, 0.08, 0.07], 'Volatility': [0.3, 0.25, 0.2]})
print("Cross-Asset Mean-Variance Optimization Results:", engine.optimize_mean_variance(portfolio_data))
