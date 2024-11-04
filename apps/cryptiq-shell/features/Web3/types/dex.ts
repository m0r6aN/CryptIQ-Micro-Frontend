// types/dex.ts
export interface UniswapAddresses {
    factory: string
    router: string
    quoter: string
  }
  
  export interface SushiswapAddresses {
    factory: string
    router: string
  }
  
  export interface CurveAddresses {
    registry: string
    addressProvider: string
  }
  
  export interface NetworkAddresses {
    uniswap: UniswapAddresses
    sushiswap: SushiswapAddresses
    curve?: CurveAddresses
  }
  