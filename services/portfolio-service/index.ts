import ccxt from 'ccxt';

interface ExchangeCredentials {
  apiKey: string;
  secretKey: string;
}

export const connectExchange = async (exchangeId: string, credentials: ExchangeCredentials) => {
  try {
    // Ensure that the exchangeId is supported by ccxt
    if (!ccxt.exchanges.includes(exchangeId)) {
      throw new Error(`Unsupported exchange: ${exchangeId}`);
    }

    // Dynamically create an exchange instance using the provided exchangeId
    const exchange = new ccxt[exchangeId]({
      apiKey: credentials.apiKey,
      secret: credentials.secretKey,
    });

    // Set some common options for better performance (optional)
    exchange.enableRateLimit = true;

    // Fetch the account balance to verify the connection
    const balance = await exchange.fetchBalance();
    console.log(`Connected to ${exchangeId} successfully.`);
    return balance;
  } catch (error) {
    console.error('Failed to connect to the exchange:', error.message);
    throw new Error(`Connection to exchange failed: ${error.message}`);
  }
};
