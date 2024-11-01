# agents/scanner/technical_pattern_agent.py
from typing import Dict, List
import numpy as np
import pandas as pd
from dataclasses import dataclass
from services.common.agent_client import AgentClient
from services.indicators.indicator_library import (
    calculate_macd, calculate_rsi, calculate_bollinger_bands,
    identify_support_resistance, calculate_volume_profile
)

@dataclass
class PatternResult:
    pattern_type: str
    confidence: float
    entry_price: float
    stop_loss: float
    target_price: float
    timeframe: str
    supporting_indicators: Dict[str, float]

class TechnicalPatternAgent:
    def __init__(self, kafka_bootstrap_servers: List[str]):
        self.agent_client = AgentClient(
            agent_id="technical_pattern_scanner_1",
            capabilities=[
                "pattern_recognition",
                "technical_analysis",
                "support_resistance",
                "trend_detection"
            ],
            kafka_bootstrap_servers=kafka_bootstrap_servers
        )
        
        # Initialize pattern detection configs
        self.pattern_configs = self._load_pattern_configs()
        self.setup_handlers()

    async def start(self):
        """Start the technical pattern agent"""
        await self.agent_client.start()

    def setup_handlers(self):
        """Set up message handlers for different requests"""
        self.agent_client.register_handler("scan_patterns", self.handle_pattern_scan)
        self.agent_client.register_handler("analyze_trend", self.handle_trend_analysis)
        self.agent_client.register_handler("validate_setup", self.handle_setup_validation)

    async def handle_pattern_scan(self, data: Dict) -> Dict:
        """Handle pattern scanning requests"""
        try:
            df = pd.DataFrame(data['market_data'])
            timeframe = data.get('timeframe', '1h')
            
            # Parallel pattern detection
            patterns = await self._detect_patterns(df, timeframe)
            
            # Filter and rank patterns
            valid_patterns = self._validate_patterns(patterns, df)
            ranked_patterns = self._rank_patterns(valid_patterns)
            
            # Publish high-confidence patterns
            await self._publish_pattern_alerts(ranked_patterns)
            
            return {
                'status': 'success',
                'patterns': ranked_patterns,
                'timestamp': pd.Timestamp.now()
            }
            
        except Exception as e:
            await self.agent_client.publish_event('error', {
                'error_type': 'pattern_scan_error',
                'message': str(e)
            })
            raise

    async def _detect_patterns(self, df: pd.DataFrame, timeframe: str) -> List[PatternResult]:
        """Detect multiple technical patterns in parallel"""
        patterns = []
        
        # Calculate key indicators
        indicators = {
            'macd': calculate_macd(df['close']),
            'rsi': calculate_rsi(df['close']),
            'bbands': calculate_bollinger_bands(df['close']),
            'sup_res': identify_support_resistance(df['high'], df['low']),
            'volume_profile': calculate_volume_profile(df['close'], df['volume'])
        }
        
        # Pattern detection logic
        patterns.extend(self._detect_trend_patterns(df, indicators))
        patterns.extend(self._detect_reversal_patterns(df, indicators))
        patterns.extend(self._detect_continuation_patterns(df, indicators))
        
        return patterns

    def _detect_trend_patterns(self, df: pd.DataFrame, indicators: Dict) -> List[PatternResult]:
        """Detect trend-following patterns"""
        patterns = []
        
        # Trend Detection
        close_prices = df['close'].values
        high_prices = df['high'].values
        low_prices = df['low'].values
        
        # Bullish Trend Patterns
        if (indicators['macd']['histogram'][-1] > 0 and 
            indicators['rsi'][-1] > 40 and 
            close_prices[-1] > indicators['bbands']['middle'][-1]):
            
            # Calculate pattern metrics
            entry = close_prices[-1]
            stop = min(low_prices[-5:])
            target = entry + (entry - stop) * 2
            
            patterns.append(PatternResult(
                pattern_type="bullish_trend_continuation",
                confidence=self._calculate_pattern_confidence(indicators, 'bullish'),
                entry_price=entry,
                stop_loss=stop,
                target_price=target,
                timeframe="1h",
                supporting_indicators={
                    'macd': indicators['macd']['histogram'][-1],
                    'rsi': indicators['rsi'][-1],
                    'trend_strength': self._calculate_trend_strength(close_prices)
                }
            ))
            
        # Add more pattern detection logic...
        return patterns

    def _calculate_pattern_confidence(self, indicators: Dict, direction: str) -> float:
        """Calculate confidence score for a pattern"""
        confidence_factors = []
        
        # Trend Alignment
        if direction == 'bullish':
            confidence_factors.append(
                1 if indicators['macd']['histogram'][-1] > 0 else 0.5
            )
            confidence_factors.append(
                min(indicators['rsi'][-1] / 70, 1)
            )
        else:
            confidence_factors.append(
                1 if indicators['macd']['histogram'][-1] < 0 else 0.5
            )
            confidence_factors.append(
                min((100 - indicators['rsi'][-1]) / 70, 1)
            )
        
        # Volume Confirmation
        volume_trend = indicators['volume_profile']['trend']
        confidence_factors.append(
            1 if volume_trend == direction else 0.5
        )
        
        # Support/Resistance Proximity
        levels = indicators['sup_res']['levels']
        current_price = indicators['bbands']['middle'][-1]
        level_proximity = min(
            abs(current_price - level) / current_price 
            for level in levels
        )
        confidence_factors.append(max(1 - level_proximity, 0.2))
        
        return np.mean(confidence_factors)

    def _validate_patterns(self, patterns: List[PatternResult], df: pd.DataFrame) -> List[PatternResult]:
        """Validate patterns against multiple timeframes and conditions"""
        validated = []
        for pattern in patterns:
            if pattern.confidence >= 0.7:  # Confidence threshold
                # Add validation logic
                validated.append(pattern)
        return validated

    def _rank_patterns(self, patterns: List[PatternResult]) -> List[PatternResult]:
        """Rank patterns by confidence and potential reward/risk"""
        return sorted(
            patterns,
            key=lambda p: (p.confidence, (p.target_price - p.entry_price) / (p.entry_price - p.stop_loss)),
            reverse=True
        )

    async def _publish_pattern_alerts(self, patterns: List[PatternResult]):
        """Publish detected patterns to the event bus"""
        for pattern in patterns:
            await self.agent_client.publish_event('pattern_detected', {
                'pattern': pattern.__dict__,
                'priority': 'high' if pattern.confidence > 0.85 else 'medium'
            })

# Example Usage:
# agent = TechnicalPatternAgent(kafka_bootstrap_servers=['localhost:9092'])
# await agent.start()