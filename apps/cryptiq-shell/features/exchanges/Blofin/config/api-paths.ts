// config/api-paths.ts

export const API_PATHS = {
    // Account & Balance
    BALANCES: '/api/v1/asset/balances',
    ACCOUNT_BALANCE: '/api/v1/account/balance',
    
    // Trading
    POSITIONS: '/api/v1/account/positions',
    ORDERS: '/api/v1/trade/order',
    BATCH_ORDERS: '/api/v1/trade/batch-orders',
    CANCEL_ORDER: '/api/v1/trade/cancel-order',
    CANCEL_BATCH_ORDERS: '/api/v1/trade/cancel-batch-orders',
    ORDER_TPSL: '/api/v1/trade/order-tpsl',
    CLOSE_POSITION: '/api/v1/trade/close-position',
    ACTIVE_ORDERS: '/api/v1/trade/orders-pending',
    ORDER_HISTORY: '/api/v1/trade/orders-history',
    
    // Asset Transfer
    TRANSFER: '/api/v1/asset/transfer',
    TRANSFER_HISTORY: '/api/v1/asset/bills'
  } as const