// api/trading.ts
import { BlofinRestClient } from './blofinRestClient'
import { API_PATHS } from '../config/api-paths'
import type {
  OrderRequest,
  TPSLOrderRequest,
  Position,
  AccountBalance,
  Transfer,
  Order,
  OrderResponse
} from '../types/trading'

export class TradingAPI extends BlofinRestClient {
  
  async getPositions(instId?: string): Promise<Position[]> {
    const params = instId ? { instId } : undefined
    const response = await this.get(API_PATHS.POSITIONS, params)
    return response.data as Position[]
  }

  async getAccountBalance(): Promise<AccountBalance> {
    const response = await this.get(API_PATHS.ACCOUNT_BALANCE)
    return response.data as AccountBalance
  }

  async getBalances(accountType: 'funding' | 'futures' | 'spot'): Promise<AccountBalance> {
    const response = await this.get(API_PATHS.BALANCES, { accountType })
    return response.data as AccountBalance
  }

  async transferFunds(transferDetails: Transfer): Promise<{
    transferId: string
    clientId?: string
  }> {
    const response = await this.post(API_PATHS.TRANSFER, transferDetails)
    return response.data
  }

  async placeOrder(orderRequest: OrderRequest): Promise<OrderResponse> {
    const response = await this.post(API_PATHS.ORDERS, orderRequest)
    return response.data
  }

  async placeBatchOrders(orders: OrderRequest[]): Promise<OrderResponse[]> {
    const response = await this.post(API_PATHS.BATCH_ORDERS, orders)
    return response.data
  }

  async cancelOrder(orderId: string, instId?: string): Promise<OrderResponse> {
    const response = await this.post(API_PATHS.CANCEL_ORDER, { orderId, instId })
    return response.data
  }

  async cancelBatchOrders(
    orders: Array<{ orderId: string; instId?: string }>
  ): Promise<OrderResponse[]> {
    const response = await this.post(API_PATHS.CANCEL_BATCH_ORDERS, orders)
    return response.data
  }

  async placeTPSLOrder(tpslRequest: TPSLOrderRequest): Promise<{
    tpslId: string
    clientOrderId?: string
    code: string
    msg?: string
  }> {
    const response = await this.post(API_PATHS.ORDER_TPSL, tpslRequest)
    return response.data
  }

  async getActiveOrders(params?: {
    instId?: string
    orderType?: string
    state?: string
    after?: string
    before?: string
    limit?: string
  }): Promise<Order[]> {
    const response = await this.get(API_PATHS.ACTIVE_ORDERS, params)
    return response.data as Order[]
  }

  async getOrderHistory(params?: {
    instId?: string
    orderType?: string
    state?: string
    after?: string
    before?: string
    begin?: string
    end?: string
    limit?: string
  }): Promise<Order[]> {
    const response = await this.get(API_PATHS.ORDER_HISTORY, params)
    return response.data as Order[]
  }

  async closePosition(params: {
    instId: string
    marginMode: string
    positionSide: string
  }): Promise<{
    instId: string
    positionSide: string
    clientOrderId?: string
  }> {
    const response = await this.post(API_PATHS.CLOSE_POSITION, params)
    return response.data
  }
}