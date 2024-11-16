// blofinRestClient.ts
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import * as crypto from 'crypto'
import { API_CONFIG } from '../config/blofin_config'
import { TradingError, ErrorCodes } from '../errors/trading-errors'

interface BlofinResponse<T = any> {
  code: string
  msg: string
  data: T
}

export class BlofinRestClient {
  private axiosInstance: AxiosInstance
  private apiKey: string
  private secretKey: string
  private passphrase: string

  constructor() {
    this.apiKey = API_CONFIG.apiKey
    this.secretKey = API_CONFIG.secretKey
    this.passphrase = API_CONFIG.passphrase
    
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.restUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.axiosInstance.interceptors.response.use(
      this.handleResponse,
      this.handleError.bind(this)
    )
  }

  protected async get<T>(path: string, params?: any): Promise<BlofinResponse<T>> {
    const timestamp = Date.now().toString()
    const headers = this.generateHeaders('GET', path, timestamp)
    return this.axiosInstance.get(path, { headers, params })
  }

  protected async post<T>(path: string, body: any = {}): Promise<BlofinResponse<T>> {
    const timestamp = Date.now().toString()
    const bodyStr = JSON.stringify(body)
    const headers = this.generateHeaders('POST', path, timestamp, bodyStr)
    return this.axiosInstance.post(path, body, { headers })
  }

  private generateHeaders(method: string, path: string, timestamp: string, body: string = '') {
    const nonce = Date.now().toString()
    const prehashString = `${path}${method}${timestamp}${nonce}${body}`
    const hmac = crypto.createHmac('sha256', this.secretKey)
    const signature = hmac.update(prehashString).digest('hex')
    const signatureBase64 = Buffer.from(signature).toString('base64')

    return {
      'ACCESS-KEY': this.apiKey,
      'ACCESS-SIGN': signatureBase64,
      'ACCESS-TIMESTAMP': timestamp,
      'ACCESS-NONCE': nonce,
      'ACCESS-PASSPHRASE': this.passphrase
    }
  }

  private handleResponse(response: AxiosResponse<BlofinResponse>) {
    const { code, msg, data } = response.data

    if (code !== '0' && code !== '200') {
      const ErrorClass = ErrorCodes[code as keyof typeof ErrorCodes] || TradingError
      throw new ErrorClass(msg || 'Unknown error', code || 'UNKNOWN_ERROR', response.status)
    }

    return data
  }

  private handleError(error: Error | AxiosError<BlofinResponse>) {
    if (axios.isAxiosError(error)) {
      const response = error.response

      if (response?.data) {
        const { code, msg } = response.data
        const ErrorClass = ErrorCodes[code as keyof typeof ErrorCodes] || TradingError
        throw new ErrorClass(msg || 'API request failed', code || 'UNKNOWN_ERROR', response.status)
      }

      throw new TradingError(
        error.message || 'Network error',
        'NETWORK_ERROR',
        response?.status
      )
    }

    throw new TradingError(error.message, 'UNKNOWN_ERROR')
  }

  public setConfig(config: Partial<typeof API_CONFIG>) {
    if (config.apiKey) this.apiKey = config.apiKey
    if (config.secretKey) this.secretKey = config.secretKey
    if (config.passphrase) this.passphrase = config.passphrase
    if (config.restUrl) {
      this.axiosInstance.defaults.baseURL = config.restUrl
    }
  }
}