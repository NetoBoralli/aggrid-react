// Mock API service for development - returns static data to avoid API limits
export interface CryptoData {
  coin: string;
  usd: number;
  usd_market_cap: number;
  usd_24h_vol: number;
  usd_24h_change: number;
  prices: number[];
}

// Mock data matching the current structure
const mockCryptoData: CryptoData[] = [
  {
    "coin": "bitcoin",
    "usd": 64829,
    "usd_market_cap": 1273948573920,
    "usd_24h_vol": 32498374512,
    "usd_24h_change": 2.14,
    "prices": [64200, 64500, 64829, 65050, 65500, 65200, 64829]
  },
  {
    "coin": "ethereum",
    "usd": 3229,
    "usd_market_cap": 387483920183,
    "usd_24h_vol": 18923748392,
    "usd_24h_change": -0.47,
    "prices": [3180, 3200, 3229, 3250, 3230, 3210, 3229]
  },
  {
    "coin": "solana",
    "usd": 145.2,
    "usd_market_cap": 63194738291,
    "usd_24h_vol": 4829384721,
    "usd_24h_change": 5.89,
    "prices": [138, 140, 142, 145, 147, 146, 145.2]
  }
];

// Simulate API delay
const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock API service
export class MockCryptoApiService {
  // Get current prices and market data
  static async getCurrentPrices(): Promise<Record<string, any>> {
    await simulateApiDelay();
    
    // Transform the data to match CoinGecko API format
    const result: Record<string, any> = {};
    
    mockCryptoData.forEach(crypto => {
      result[crypto.coin] = {
        usd: crypto.usd,
        usd_market_cap: crypto.usd_market_cap,
        usd_24h_vol: crypto.usd_24h_vol,
        usd_24h_change: crypto.usd_24h_change,
        last_updated_at: Math.floor(Date.now() / 1000)
      };
    });
    
    return result;
  }

  // Get market chart data for a specific cryptocurrency
  static async getMarketChart(cryptoId: string, days: number = 7): Promise<any> {
    await simulateApiDelay();
    
    const crypto = mockCryptoData.find(c => c.coin === cryptoId);
    if (!crypto) {
      throw new Error(`Cryptocurrency ${cryptoId} not found`);
    }

    // Generate timestamps for the last 7 days
    const now = Date.now();
    const timestamps = Array.from({ length: days }, (_, i) => {
      const date = new Date(now - (days - 1 - i) * 24 * 60 * 60 * 1000);
      return date.getTime();
    });

    return {
      prices: timestamps.map((timestamp, index) => [timestamp, crypto.prices[index] || crypto.prices[crypto.prices.length - 1]]),
      market_caps: timestamps.map((timestamp, index) => [timestamp, crypto.usd_market_cap]),
      total_volumes: timestamps.map((timestamp, index) => [timestamp, crypto.usd_24h_vol])
    };
  }

  // Get all market chart data at once
  static async getAllMarketCharts(days: number = 7): Promise<Record<string, any>> {
    await simulateApiDelay();
    
    const result: Record<string, any> = {};
    
    for (const crypto of mockCryptoData) {
      result[crypto.coin] = await this.getMarketChart(crypto.coin, days);
    }
    
    return result;
  }

  // Get combined data (current prices + market charts)
  static async getCombinedData(days: number = 7): Promise<{
    currentPrices: Record<string, any>;
    marketCharts: Record<string, any>;
  }> {
    const [currentPrices, marketCharts] = await Promise.all([
      this.getCurrentPrices(),
      this.getAllMarketCharts(days)
    ]);

    return {
      currentPrices,
      marketCharts
    };
  }
}

// Export the mock data for direct use if needed
export { mockCryptoData };
