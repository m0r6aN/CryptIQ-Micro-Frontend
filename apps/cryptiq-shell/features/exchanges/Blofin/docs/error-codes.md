# Blofin Trading Error Codes

## Authentication Errors (60xxx)
- `60001`: Invalid API key
- `60002`: API key expired
- `60003`: Invalid signature
- `60004`: Invalid timestamp
- `60005`: Invalid passphrase
- `60006`: Invalid IP address
- `60009`: Login failed

## Order Errors (60xxx)
- `60012`: Invalid order parameters
- `60013`: Order size exceeds limit
- `60014`: Order price outside allowed range
- `60015`: Order already exists
- `60016`: Insufficient balance
- `60017`: Order not found
- `60018`: Order already canceled
- `60019`: Order already filled

## Position Errors (60xxx)
- `60041`: Position not found
- `60042`: Position already exists
- `60043`: Max position size exceeded
- `60044`: Invalid leverage
- `60045`: Invalid margin mode
- `60046`: Position mode not supported
- `60047`: Position locked
- `60048`: Position in liquidation
- `60049`: Position being liquidated

## Rate Limiting (429)
- `429`: Rate limit exceeded
  - IP-based: 500 requests/minute
  - User-based: 30 trading requests/10 seconds

## System Errors (50xxx)
- `50001`: Internal system error
- `50002`: Service unavailable
- `50003`: Endpoint maintenance
- `50004`: API version expired

## Response Structure
```typescript
interface ErrorResponse {
  code: string    // Error code
  msg: string     // Error message
  data?: any      // Optional error details
}
```

## Error Handling Best Practices

1. **Rate Limiting**
```typescript
if (error instanceof RateLimitError) {
  await delay(1000) // Wait 1s before retry
  return retryRequest()
}
```

2. **Authentication**
```typescript
if (error instanceof AuthenticationError) {
  await refreshCredentials()
  return retryRequest()
}
```

3. **Insufficient Balance**
```typescript
if (error instanceof InsufficientBalanceError) {
  const balance = await checkBalance()
  if (balance < requiredAmount) {
    await handleInsufficientFunds()
  }
}
```

4. **Position/Order Updates**
```typescript
if (error instanceof InvalidOrderError) {
  await syncOrderState()
  return retryWithUpdatedParams()
}
```