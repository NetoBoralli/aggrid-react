// Cryptocurrency IDs for CoinGecko API
export const CRYPTO_IDS = [
  'bitcoin',
  'ethereum', 
  'polkadot',
  'litecoin',
  'polygon',
  'uniswap',
  'stellar',
  'arbitrum',
  'optimism',
  'chainlink',
  'solana',
  'bitcoin-cash',
  'aave',
  'cardano',
  'near',
  'cosmos',
  'algorand'
] as const;

// Type for the crypto IDs
export type CryptoId = typeof CRYPTO_IDS[number];

// Define the data interface
export interface CryptoData {
  coin: string;
  usd: number;
  usd_market_cap: number;
  usd_24h_vol: number;
  usd_24h_change: number;
  prices: number[];
}

// Function to join all IDs for API request
export const getCryptoIdsParam = (): string => {
  return CRYPTO_IDS.join(',');
};

// Base URL for CoinGecko API
export const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Function to build the full API URL for current prices
export const buildCryptoApiUrl = (): string => {
  const ids = getCryptoIdsParam();
  return `${COINGECKO_BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`;
};

// Function to build market chart API URL for a specific cryptocurrency
export const buildMarketChartApiUrl = (cryptoId: CryptoId, days: number = 7, interval: 'daily' | 'hourly' = 'daily'): string => {
  return `${COINGECKO_BASE_URL}/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`;
};

// Function to build market chart API URLs for all cryptocurrencies
export const buildAllMarketChartApiUrls = (days: number = 7, interval: 'daily' | 'hourly' = 'daily'): Record<CryptoId, string> => {
  const urls: Record<CryptoId, string> = {} as Record<CryptoId, string>;
  
  CRYPTO_IDS.forEach(id => {
    urls[id] = buildMarketChartApiUrl(id, days, interval);
  });
  
  return urls;
};
