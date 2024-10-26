// utils/riskManagement.ts

import { GreeksData } from '../types/greeks';

export function calculatePositionRisk(
  data: GreeksData[],
  spotPrice: number
) {
  const deltaDollar = data.reduce((sum, item) => sum + item.delta * spotPrice, 0);
  const gammaScalp = data.reduce((sum, item) => sum + item.gamma * spotPrice, 0);
  const thetaDecay = data.reduce((sum, item) => sum + item.theta, 0);
  const vegaExposure = data.reduce((sum, item) => sum + item.vega, 0);

  return {
    deltaDollar,
    gammaScalp,
    thetaDecay,
    vegaExposure,
    optimalHedgeRatio: gammaScalp / deltaDollar,
    hedgeEfficiency: 1 - Math.abs(thetaDecay / vegaExposure),
    spotGammaLevel: deltaDollar / (spotPrice * 100),
    rebalanceUrgency: gammaScalp > 1 ? 'high' : gammaScalp > 0.5 ? 'medium' : 'low'
  };
}

export function generateHedgingSuggestions(riskMetrics: ReturnType<typeof calculatePositionRisk>) {
  const suggestions = [];

  if (riskMetrics.deltaDollar > 10000) {
    suggestions.push({
      action: 'Sell Calls to Reduce Delta',
      params: { type: 'sell', option: 'call', quantity: 10 }
    });
  }

  if (riskMetrics.thetaDecay < -500) {
    suggestions.push({
      action: 'Buy Puts to Hedge Theta',
      params: { type: 'buy', option: 'put', quantity: 5 }
    });
  }

  if (riskMetrics.optimalHedgeRatio < 0.5) {
    suggestions.push({
      action: 'Increase Hedge Ratio',
      params: { type: 'hedge', quantity: 15 }
    });
  }

  return suggestions;
}
