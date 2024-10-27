# File: services/trading-service/ml/arbitrage/training/impact_trainer.py

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader, TensorDataset
from typing import Dict, List, Tuple, Optional
import numpy as np
from collections import deque
import pandas as pd
from ..models.impact_networks import create_impact_models
from ..utils.metrics import calculate_sharpe_ratio, calculate_sortino_ratio

class ImpactModelTrainer:
    def __init__(
        self,
        num_pools: int,
        device: str = 'cuda' if torch.cuda.is_available() else 'cpu',
        buffer_size: int = 100000
    ):
        self.device = torch.device(device)
        
        # Initialize models
        self.models = create_impact_models(num_pools, self.device)
        self.impact_model, self.reversal_model, \
        self.cross_impact, self.param_adapter = self.models
        
        # Experience replay buffer
        self.replay_buffer = deque(maxlen=buffer_size)
        
        # Separate optimizers for each model
        self.optimizers = {
            'impact': torch.optim.Adam(self.impact_model.parameters()),
            'reversal': torch.optim.Adam(self.reversal_model.parameters()),
            'cross': torch.optim.Adam(self.cross_impact.parameters()),
            'adapter': torch.optim.Adam(self.param_adapter.parameters())
        }
        
        # Initialize target networks for stability
        self.target_models = create_impact_models(num_pools, self.device)
        self.update_target_networks(tau=1.0)  # Initial copy
        
        # Performance tracking
        self.train_metrics = {
            'impact_loss': [],
            'reversal_loss': [],
            'cross_impact_loss': [],
            'param_loss': [],
            'sharpe_ratio': [],
            'sortino_ratio': []
        }
        
        self.validation_window = deque(maxlen=1000)

    def store_experience(
        self,
        state: Dict[str, torch.Tensor],
        action: Dict[str, torch.Tensor],
        next_state: Dict[str, torch.Tensor],
        reward: float,
        done: bool
    ):
        """Store experience in replay buffer"""
        self.replay_buffer.append((
            state, action, next_state, reward, done
        ))

    def train_step(
        self,
        batch_size: int = 64,
        gamma: float = 0.99
    ) -> Dict[str, float]:
        """Execute single training step on all models"""
        if len(self.replay_buffer) < batch_size:
            return {}
            
        # Sample from replay buffer
        batch = self._sample_batch(batch_size)
        states, actions, next_states, rewards, dones = batch
        
        # Train impact prediction
        impact_loss = self._train_impact_model(
            states, actions, next_states, rewards
        )
        
        # Train reversal prediction
        reversal_loss = self._train_reversal_model(
            states, next_states
        )
        
        # Train cross-impact analysis
        cross_loss = self._train_cross_impact(
            states, next_states
        )
        
        # Train parameter adaptation
        param_loss = self._train_param_adapter(
            states, actions, rewards
        )
        
        # Soft update target networks
        self.update_target_networks()
        
        metrics = {
            'impact_loss': impact_loss,
            'reversal_loss': reversal_loss,
            'cross_impact_loss': cross_loss,
            'param_loss': param_loss
        }
        
        # Update metrics
        for key, value in metrics.items():
            self.train_metrics[key].append(value)
            
        return metrics

    def _train_impact_model(
        self,
        states: Dict[str, torch.Tensor],
        actions: Dict[str, torch.Tensor],
        next_states: Dict[str, torch.Tensor],
        rewards: torch.Tensor
    ) -> float:
        """Train main impact prediction model using TD learning"""
        self.optimizers['impact'].zero_grad()
        
        # Current state predictions
        predicted_impact, predicted_uncertainty = self.impact_model(
            states['pool_features'],
            states['market_features']
        )
        
        # Target values from next state
        with torch.no_grad():
            next_impact, next_uncertainty = self.target_models[0](
                next_states['pool_features'],
                next_states['market_features']
            )
        
        # Calculate TD target with uncertainty penalization
        uncertainty_penalty = torch.exp(predicted_uncertainty)
        td_target = rewards + uncertainty_penalty * next_impact
        
        # Compute losses
        impact_loss = F.mse_loss(predicted_impact, td_target)
        uncertainty_loss = self._uncertainty_loss(
            predicted_uncertainty,
            predicted_impact,
            td_target
        )
        
        # Combined loss
        total_loss = impact_loss + 0.1 * uncertainty_loss
        total_loss.backward()
        
        # Gradient clipping
        torch.nn.utils.clip_grad_norm_(
            self.impact_model.parameters(), 
            max_norm=1.0
        )
        
        self.optimizers['impact'].step()
        
        return total_loss.item()

    def _train_reversal_model(
        self,
        states: Dict[str, torch.Tensor],
        next_states: Dict[str, torch.Tensor]
    ) -> float:
        """Train price reversal prediction using actual market data"""
        self.optimizers['reversal'].zero_grad()
        
        # Calculate actual reversal times from data
        actual_times = self._calculate_reversal_times(
            states['price_history'],
            next_states['price_history']
        )
        
        # Predict reversal times
        predicted_times = self.reversal_model(
            states['sequence'],
            states['lengths']
        )
        
        # Custom loss that penalizes underestimation more
        loss = self._asymmetric_reversal_loss(
            predicted_times,
            actual_times
        )
        
        loss.backward()
        self.optimizers['reversal'].step()
        
        return loss.item()

    def _train_cross_impact(
        self,
        states: Dict[str, torch.Tensor],
        next_states: Dict[str, torch.Tensor]
    ) -> float:
        """Train cross-impact analysis using graph neural network"""
        self.optimizers['cross'].zero_grad()
        
        # Predict cross-impacts
        node_embeddings, predicted_impacts = self.cross_impact(
            states['node_features'],
            states['edge_index']
        )
        
        # Calculate actual cross-impacts from market data
        actual_impacts = self._calculate_cross_impacts(
            states['pool_states'],
            next_states['pool_states']
        )
        
        # Graph-based loss
        loss = F.mse_loss(predicted_impacts, actual_impacts)
        
        # Add structural regularization
        reg_loss = self._graph_regularization(
            node_embeddings,
            states['edge_index']
        )
        
        total_loss = loss + 0.01 * reg_loss
        total_loss.backward()
        
        self.optimizers['cross'].step()
        
        return total_loss.item()

    def _train_param_adapter(
        self,
        states: Dict[str, torch.Tensor],
        actions: Dict[str, torch.Tensor],
        rewards: torch.Tensor
    ) -> float:
        """Train adaptive parameter prediction"""
        self.optimizers['adapter'].zero_grad()
        
        # Predict pool parameters
        alpha, beta, gamma = self.param_adapter(states['pool_features'])
        
        # Calculate expected returns using predicted parameters
        expected_returns = self._calculate_expected_returns(
            states, actions, alpha, beta, gamma
        )
        
        # Loss based on actual vs expected returns
        loss = F.smooth_l1_loss(expected_returns, rewards)
        
        # Add regularization to prevent extreme parameters
        reg_loss = (
            torch.mean(torch.abs(alpha - 0.5)) +
            torch.mean(F.relu(beta - 3.0)) +
            torch.mean(torch.abs(gamma))
        )
        
        total_loss = loss + 0.1 * reg_loss
        total_loss.backward()
        
        self.optimizers['adapter'].step()
        
        return total_loss.item()

    def update_target_networks(self, tau: float = 0.001):
        """Soft update target networks"""
        for target_model, online_model in zip(
            self.target_models, self.models
        ):
            for target_param, online_param in zip(
                target_model.parameters(),
                online_model.parameters()
            ):
                target_param.data.copy_(
                    tau * online_param.data +
                    (1.0 - tau) * target_param.data
                )

    def validate(
        self,
        validation_data: DataLoader
    ) -> Dict[str, float]:
        """Validate models on held-out data"""
        self.impact_model.eval()
        self.reversal_model.eval()
        self.cross_impact.eval()
        self.param_adapter.eval()
        
        validation_metrics = defaultdict(list)
        
        with torch.no_grad():
            for batch in validation_data:
                # Run predictions
                impact_pred = self.impact_model(
                    batch['pool_features'],
                    batch['market_features']
                )
                
                reversal_pred = self.reversal_model(
                    batch['sequence'],
                    batch['lengths']
                )
                
                cross_pred = self.cross_impact(
                    batch['node_features'],
                    batch['edge_index']
                )
                
                # Calculate metrics
                impact_error = F.mse_loss(
                    impact_pred[0],
                    batch['actual_impact']
                )
                
                reversal_error = F.mse_loss(
                    reversal_pred,
                    batch['actual_reversal']
                )
                
                cross_error = F.mse_loss(
                    cross_pred[1],
                    batch['actual_cross']
                )
                
                # Store metrics
                validation_metrics['impact_error'].append(impact_error.item())
                validation_metrics['reversal_error'].append(reversal_error.item())
                validation_metrics['cross_error'].append(cross_error.item())
        
        # Calculate final metrics
        final_metrics = {
            k: np.mean(v) for k, v in validation_metrics.items()
        }
        
        # Calculate Sharpe ratio on validation set
        returns = self._calculate_validation_returns(validation_data)
        final_metrics['sharpe_ratio'] = calculate_sharpe_ratio(returns)
        final_metrics['sortino_ratio'] = calculate_sortino_ratio(returns)
        
        self.validation_window.append(final_metrics)
        
        return final_metrics

    def _asymmetric_reversal_loss(
        self,
        pred: torch.Tensor,
        target: torch.Tensor,
        alpha: float = 2.0
    ) -> torch.Tensor:
        """Custom loss that penalizes underestimation more"""
        diff = pred - target
        return torch.mean(
            torch.where(
                diff < 0,
                alpha * torch.pow(torch.abs(diff), 2),
                torch.pow(diff, 2)
            )
        )

    def _uncertainty_loss(
        self,
        uncertainty: torch.Tensor,
        pred: torch.Tensor,
        target: torch.Tensor
    ) -> torch.Tensor:
        """Calculate uncertainty loss using negative log likelihood"""
        squared_error = (pred - target) ** 2
        uncertainty_term = torch.log(uncertainty)
        return torch.mean(squared_error / uncertainty + uncertainty_term)

    def _graph_regularization(
        self,
        node_embeddings: torch.Tensor,
        edge_index: torch.Tensor
    ) -> torch.Tensor:
        """Structural regularization for graph embeddings"""
        row, col = edge_index
        
        # Encourage connected nodes to have similar embeddings
        similarity = F.cosine_similarity(
            node_embeddings[row],
            node_embeddings[col]
        )
        
        return -torch.mean(similarity)

    def save_models(self, path: str):
        """Save all models and optimizers"""
        torch.save({
            'impact_model': self.impact_model.state_dict(),
            'reversal_model': self.reversal_model.state_dict(),
            'cross_impact': self.cross_impact.state_dict(),
            'param_adapter': self.param_adapter.state_dict(),
            'optimizers': self.optimizers,
            'train_metrics': self.train_metrics
        }, path)

    def load_models(self, path: str):
        """Load all models and optimizers"""
        checkpoint = torch.load(path)
        self.impact_model.load_state_dict(checkpoint['impact_model'])
        self.reversal_model.load_state_dict(checkpoint['reversal_model'])
        self.cross_impact.load_state_dict(checkpoint['cross_impact'])
        self.param_adapter.load_state_dict(checkpoint['param_adapter'])
        self.optimizers = checkpoint['optimizers']
        self.train_metrics = checkpoint['train_metrics']
