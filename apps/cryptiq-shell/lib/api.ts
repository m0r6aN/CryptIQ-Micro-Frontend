

const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000'; // Point to Docker container

// Generic fetch wrapper
const request = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(`${apiBaseUrl}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// API calls
export const api = {
  getPortfolio: async (userId: string) => {
    return request(`/portfolio/${userId}`);
  },

  executeTrade: async (tradeData: {
    userId: string;
    coinSymbol: string;
    amount: number;
    tradeType: string;
  }) => {
    return request(`/trade`, {
      method: 'POST',
      body: JSON.stringify(tradeData),
    });
  },

  getTopCoins: async (queryParams?: { limit?: string; day_trading_filter?: string }) => {
    const query = new URLSearchParams(queryParams).toString();
    return request(`/top-coins?${query}`);
  },

  getBotStrategy: async () => {
    return request(`/bot-strategy`);
  },

  executeBotTrade: async (tradeData: { symbol: string; amount: number }) => {
    return request(`/execute-trade`, {
      method: 'POST',
      body: JSON.stringify(tradeData),
    });
  },
};
