import pandas as pd

class MultiAgentCrossMarketLiquidityFlowAnalysisEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, flow_analysis_function):
        self.agents.append({'agent_name': agent_name, 'analyze_flow': flow_analysis_function})

    def analyze_liquidity_flow(self, liquidity_data: pd.DataFrame):
        flow_results = {}
        for agent in self.agents:
            flow_results[agent['agent_name']] = agent['analyze_flow'](liquidity_data)
        return flow_results

def dummy_flow_agent_1(data):
    return f"Agent 1 analyzed flow patterns on {data.shape[0]} rows"

def dummy_flow_agent_2(data):
    return f"Agent 2 identified flow trends using columns: {data.columns}"

engine = MultiAgentCrossMarketLiquidityFlowAnalysisEngine()
engine.register_agent('Dummy Flow Agent 1', dummy_flow_agent_1)
engine.register_agent('Dummy Flow Agent 2', dummy_flow_agent_2)

liquidity_data = pd.DataFrame({'BTC_flow': [1000, 1500, 2000, 3000], 'ETH_flow': [500, 800, 900, 1200]})
print("Cross-Market Liquidity Flow Analysis Results:", engine.analyze_liquidity_flow(liquidity_data))
