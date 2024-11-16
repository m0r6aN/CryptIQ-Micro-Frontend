// errors/trading-errors.ts

export class TradingError extends Error {
  constructor(message: string, public code: string, public status?: number) {
    super(message)
    this.name = 'TradingError'
  }
}

export class InsufficientBalanceError extends TradingError {
  constructor(message: string, code: string, status?: number) {
    super(message, code, status)
    this.name = 'InsufficientBalanceError'
  }
}

export class InvalidOrderError extends TradingError {
  constructor(message: string, code: string, status?: number) {
    super(message, code, status)
    this.name = 'InvalidOrderError'
  }
}

export class LiquidationError extends TradingError {
  constructor(message: string, code: string, status?: number) {
    super(message, code, status)
    this.name = 'LiquidationError'
  }
}

export class RateLimitError extends TradingError {
  constructor(message: string, code: string, status?: number) {
    super(message, code, status)
    this.name = 'RateLimitError'
  }
}

export class AuthenticationError extends TradingError {
  constructor(message: string, code: string, status?: number) {
    super(message, code, status)
    this.name = 'AuthenticationError'
  }
}

export const ErrorCodes: Record<string, typeof TradingError> = {
  // Authentication
  '60001': AuthenticationError,
  '60002': AuthenticationError,
  '60003': AuthenticationError,
  '60004': AuthenticationError,
  '60005': AuthenticationError,
  '60006': AuthenticationError,
  '60009': AuthenticationError,

  // Orders
  '60012': InvalidOrderError,
  '60013': InvalidOrderError,
  '60014': InvalidOrderError,
  '60015': InvalidOrderError,
  '60016': InsufficientBalanceError,
  '60017': InvalidOrderError,
  '60018': InvalidOrderError,
  '60019': InvalidOrderError,

  // Positions
  '60041': InvalidOrderError,
  '60042': InvalidOrderError,
  '60043': InvalidOrderError,
  '60044': InvalidOrderError,
  '60045': InvalidOrderError,
  '60046': InvalidOrderError,
  '60047': LiquidationError,
  '60048': LiquidationError,
  '60049': LiquidationError,

  // Rate Limiting
  '429': RateLimitError,

  // System Errors
  '50001': TradingError,
  '50002': TradingError,
  '50003': TradingError,
  '50004': TradingError
} as const