# File: services/trading-service/ml/arbitrage/models/impact_networks.py

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Tuple, List, Optional
import numpy as np

class AttentionPoolBlock(nn.Module):
    """Multi-head attention for pool state analysis"""
    def __init__(self, hidden_size: int, num_heads: int = 4):
        super().__init__()
        self.attention = nn.MultiheadAttention(
            embed_dim=hidden_size,
            num_heads=num_heads,
            dropout=0.1
        )
        self.layer_norm = nn.LayerNorm(hidden_size)
        self.dropout = nn.Dropout(0.1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        attended, _ = self.attention(x, x, x)
        x = self.layer_norm(x + self.dropout(attended))
        return x

class ImpactTransformer(nn.Module):
    """Main market impact prediction model"""
    def __init__(
        self, 
        num_pools: int,
        hidden_size: int = 256,
        num_layers: int = 4
    ):
        super().__init__()
        
        # Pool feature embedding
        self.pool_embedding = nn.Sequential(
            nn.Linear(7, hidden_size),  # 7 features per pool
            nn.LayerNorm(hidden_size),
            nn.GELU()
        )
        
        # Market state embedding
        self.market_embedding = nn.Sequential(
            nn.Linear(13, hidden_size),  # 13 market features
            nn.LayerNorm(hidden_size),
            nn.GELU()
        )
        
        # Transformer layers
        self.transformer_layers = nn.ModuleList([
            AttentionPoolBlock(hidden_size) 
            for _ in range(num_layers)
        ])
        
        # Pool interaction layer
        self.pool_interaction = nn.Parameter(
            torch.randn(num_pools, num_pools) / np.sqrt(num_pools)
        )
        
        # Output heads
        self.impact_head = nn.Sequential(
            nn.Linear(hidden_size * 2, hidden_size),
            nn.GELU(),
            nn.Dropout(0.1),
            nn.Linear(hidden_size, 1),
            nn.Sigmoid()
        )
        
        self.uncertainty_head = nn.Sequential(
            nn.Linear(hidden_size * 2, hidden_size),
            nn.GELU(),
            nn.Dropout(0.1),
            nn.Linear(hidden_size, 1),
            nn.Sigmoid()
        )

    def forward(
        self,
        pool_features: torch.Tensor,
        market_features: torch.Tensor,
        mask: Optional[torch.Tensor] = None
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        # Embed pool and market features
        pool_embed = self.pool_embedding(pool_features)
        market_embed = self.market_embedding(market_features)
        
        # Apply transformer layers
        x = pool_embed
        for layer in self.transformer_layers:
            x = layer(x)
            
        # Pool interactions
        if mask is not None:
            interaction_weights = self.pool_interaction.masked_fill(
                mask.unsqueeze(1) == 0, float('-inf')
            )
        else:
            interaction_weights = self.pool_interaction
            
        pool_interactions = torch.matmul(
            F.softmax(interaction_weights, dim=-1),
            x
        )
        
        # Combine embeddings
        combined = torch.cat([
            x.mean(dim=1),
            market_embed
        ], dim=-1)
        
        # Generate predictions
        impact = self.impact_head(combined)
        uncertainty = self.uncertainty_head(combined)
        
        return impact, uncertainty

class PriceReversalPredictor(nn.Module):
    """LSTM-based price reversal time predictor"""
    def __init__(self, hidden_size: int = 128):
        super().__init__()
        
        self.lstm = nn.LSTM(
            input_size=5,  # Impact + volume features
            hidden_size=hidden_size,
            num_layers=2,
            dropout=0.1,
            bidirectional=True
        )
        
        self.attention = nn.Sequential(
            nn.Linear(hidden_size * 2, hidden_size),
            nn.Tanh(),
            nn.Linear(hidden_size, 1),
            nn.Softmax(dim=1)
        )
        
        self.output = nn.Sequential(
            nn.Linear(hidden_size * 2, hidden_size),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(hidden_size, 1),
            nn.Softplus()  # Always positive time prediction
        )

    def forward(
        self,
        sequence: torch.Tensor,
        lengths: torch.Tensor
    ) -> torch.Tensor:
        # Pack sequence for LSTM
        packed = nn.utils.rnn.pack_padded_sequence(
            sequence, lengths, enforce_sorted=False
        )
        
        # Run LSTM
        output, _ = self.lstm(packed)
        output, _ = nn.utils.rnn.pad_packed_sequence(output)
        
        # Attention mechanism
        attention_weights = self.attention(output)
        context = torch.sum(output * attention_weights, dim=1)
        
        # Predict reversal time
        return self.output(context)

class CrossImpactAnalyzer(nn.Module):
    """Graph neural network for cross-pool impact analysis"""
    def __init__(
        self,
        hidden_size: int = 64,
        num_layers: int = 3
    ):
        super().__init__()
        
        self.node_embedding = nn.Linear(5, hidden_size)  # 5 features per pool
        
        # Graph attention layers
        self.gat_layers = nn.ModuleList([
            GATLayer(hidden_size) for _ in range(num_layers)
        ])
        
        self.edge_predictor = nn.Sequential(
            nn.Linear(hidden_size * 2, hidden_size),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(hidden_size, 1),
            nn.Sigmoid()
        )

    def forward(
        self,
        node_features: torch.Tensor,
        edge_index: torch.Tensor
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        # Initial node embeddings
        x = self.node_embedding(node_features)
        
        # Apply GAT layers
        for layer in self.gat_layers:
            x = layer(x, edge_index)
            
        # Predict cross-impacts
        row, col = edge_index
        edge_features = torch.cat([x[row], x[col]], dim=-1)
        cross_impacts = self.edge_predictor(edge_features)
        
        return x, cross_impacts

class GATLayer(nn.Module):
    """Graph attention layer"""
    def __init__(self, hidden_size: int, heads: int = 4):
        super().__init__()
        
        self.attention = nn.Parameter(torch.Tensor(1, heads, hidden_size * 2))
        self.linear = nn.Linear(hidden_size * heads, hidden_size)
        self.dropout = nn.Dropout(0.1)
        
        nn.init.xavier_uniform_(self.attention)

    def forward(
        self,
        x: torch.Tensor,
        edge_index: torch.Tensor
    ) -> torch.Tensor:
        # Multi-head attention
        row, col = edge_index
        
        # Calculate attention scores
        edge_features = torch.cat([x[row], x[col]], dim=-1)
        attention_scores = (edge_features.unsqueeze(1) * self.attention).sum(dim=-1)
        attention_scores = F.leaky_relu(attention_scores)
        
        # Normalize attention scores
        attention_scores = F.softmax(attention_scores, dim=1)
        attention_scores = self.dropout(attention_scores)
        
        # Apply attention
        out = self.linear(
            torch.cat([
                scatter_softmax(
                    attention_scores[:, i],
                    row,
                    dim=0,
                    dim_size=x.size(0)
                ).unsqueeze(-1) * x[col]
                for i in range(attention_scores.size(1))
            ], dim=-1)
        )
        
        return out + x  # Residual connection

class AdaptivePoolParameters(nn.Module):
    """Neural network for adapting pool-specific parameters"""
    def __init__(self, hidden_size: int = 64):
        super().__init__()
        
        self.feature_encoder = nn.Sequential(
            nn.Linear(10, hidden_size),
            nn.ReLU(),
            nn.Dropout(0.1)
        )
        
        self.alpha_predictor = nn.Sequential(
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU(),
            nn.Linear(hidden_size // 2, 1),
            nn.Sigmoid()
        )
        
        self.beta_predictor = nn.Sequential(
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU(),
            nn.Linear(hidden_size // 2, 1),
            nn.Softplus()
        )
        
        self.gamma_predictor = nn.Sequential(
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU(),
            nn.Linear(hidden_size // 2, 1),
            nn.Sigmoid()
        )

    def forward(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        features = self.feature_encoder(x)
        
        alpha = self.alpha_predictor(features)
        beta = self.beta_predictor(features) + 1  # Beta >= 1
        gamma = self.gamma_predictor(features)
        
        return alpha, beta, gamma

def create_impact_models(
    num_pools: int,
    device: torch.device
) -> Tuple[nn.Module, nn.Module, nn.Module, nn.Module]:
    """Create and initialize all impact prediction models"""
    
    impact_model = ImpactTransformer(num_pools=num_pools).to(device)
    reversal_model = PriceReversalPredictor().to(device)
    cross_impact = CrossImpactAnalyzer().to(device)
    param_adapter = AdaptivePoolParameters().to(device)
    
    return impact_model, reversal_model, cross_impact, param_adapter
