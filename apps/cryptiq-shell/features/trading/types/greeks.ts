export interface GreeksData {
    strike: number
    expiry: number // days to expiration
    delta: number
    gamma: number
    theta: number
    vega: number
    rho: number
    vanna: number
    charm: number
    vomma: number
    veta: number
    speed: number
    zomma: number
    color: number
    volga: number
  }
  
  export interface GreeksSurface {
    strikes: number[]
    expirations: number[]
    values: number[][]
    type: 'delta' | 'gamma' | 'theta' | 'vega' | 'charm' | 'vanna'
  }
  
  export interface PositionRisk {
    deltaDollar: number
    gammaScalp: number
    thetaDecay: number
    vegaExposure: number
    charmEffect: number
    spotGammaLevel: number
    hedgeEfficiency: number
    optimalHedgeRatio: number
    rebalanceUrgency: 'high' | 'medium' | 'low'
  }