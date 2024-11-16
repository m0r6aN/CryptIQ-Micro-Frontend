export const API_CONFIG = {
    apiKey: process.env.BLOFIN_API_KEY || '',
    secretKey: process.env.BLOFIN_SECRET_KEY || '',
    passphrase: process.env.BLOFIN_PASSPHRASE || '',
    restUrl: 'https://openapi.blofin.com',
    wsPublicUrl: 'wss://openapi.blofin.com/ws/public',
    wsPrivateUrl: 'wss://openapi.blofin.com/ws/private',
    // Demo endpoints
    demoRestUrl: 'https://demo-trading-openapi.blofin.com',
    demoWsPublicUrl: 'wss://demo-trading-openapi.blofin.com/ws/public',
    demoWsPrivateUrl: 'wss://demo-trading-openapi.blofin.com/ws/private',
  } as const
