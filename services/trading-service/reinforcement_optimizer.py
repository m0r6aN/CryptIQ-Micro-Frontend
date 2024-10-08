# File path: CryptIQ-Micro-Frontend/services/trading-service/reinforcement_optimizer.py

import pandas as pd
import numpy as np

"""
Reinforcement Learning Strategy Optimizer
"""

class RLStrategyOptimizer:
    def __init__(self, strategy_function, data: pd.DataFrame, episodes: int = 1000):
        self.strategy_function = strategy_function
        self.data = data
        self.episodes = episodes
        self.state_space = self.data.shape[0]
        self.action_space = 3  # 0: Hold, 1: Buy, 2: Sell

    def train(self):
        """
        Train a reinforcement learning agent to optimize the trading strategy.
        """
        q_table = np.zeros((self.state_space, self.action_space))
        learning_rate = 0.1
        discount_factor = 0.95
        epsilon = 1.0

        for episode in range(self.episodes):
            state = np.random.randint(0, self.state_space - 1)
            for _ in range(200):  # Limit steps per episode
                if np.random.random() < epsilon:
                    action = np.random.randint(0, self.action_space)
                else:
                    action = np.argmax(q_table[state])

                reward, next_state = self.execute_action(state, action)
                q_table[state, action] = q_table[state, action] + learning_rate * (
                    reward + discount_factor * np.max(q_table[next_state]) - q_table[state, action]
                )

                state = next_state

            epsilon = max(0.1, epsilon * 0.99)  # Decay epsilon

        return q_table

    def execute_action(self, state, action):
        """
        Simulates an action and returns reward and next state.
        """
        current_price = self.data['close'].iloc[state]
        next_state = min(state + 1, self.state_space - 1)
        next_price = self.data['close'].iloc[next_state]

        if action == 1:  # Buy
            reward = next_price - current_price
        elif action == 2:  # Sell
            reward = current_price - next_price
        else:  # Hold
            reward = 0

        return reward, next_state
