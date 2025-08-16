import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { buildCryptoApiUrl, buildMarketChartApiUrl, type CryptoData } from './index';

// Fallback data with all values set to 0 for display purposes when API fails
const FALLBACK_DATA = {
  "aave": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "algorand": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "arbitrum": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "bitcoin": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "bitcoin-cash": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "cardano": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "chainlink": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "cosmos": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "ethereum": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "litecoin": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "near": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "optimism": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "polkadot": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "solana": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "stellar": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0},
  "uniswap": {"usd": 0, "usd_market_cap": 0, "usd_24h_vol": 0, "usd_24h_change": 0, "last_updated_at": 0}
};

// Fetch current prices data
const fetchCurrentPrices = async () => {
  console.log('🔄 Fetching fresh cryptocurrency data from API...');
  try {
    const response = await fetch(buildCryptoApiUrl());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ Fresh data fetched successfully');
    return data;
  } catch (error) {
    console.warn('⚠️ Using fallback data due to API error:', error);
    return FALLBACK_DATA;
  }
};

// Fetch chart data for a specific cryptocurrency
const fetchChartData = async (coinId: string) => {
  try {
    const response = await fetch(buildMarketChartApiUrl(coinId as any));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.prices.map((priceData: [number, number]) => priceData[1]);
  } catch (error) {
    console.warn(`Failed to fetch chart data for ${coinId}:`, error);
    return []; // Return empty array for failed chart data
  }
};

// Custom hook for cryptocurrency data
export const useCryptoData = () => {
  // Query for current prices
  const currentPricesQuery = useQuery({
    queryKey: ['crypto', 'current-prices'],
    queryFn: fetchCurrentPrices,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - data stays fresh for 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours - keep in cache for 24 hours
    refetchOnMount: false, // Don't refetch if data exists
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Log cache status
  React.useEffect(() => {
    if (currentPricesQuery.data && !currentPricesQuery.isFetching) {
      if (currentPricesQuery.isStale) {
        console.log('📊 Data loaded from cache (stale - will refresh in background after 24 hours)');
      } else {
        console.log('📊 Data loaded from cache (fresh - cached for 24 hours)');
      }
    }
  }, [currentPricesQuery.data, currentPricesQuery.isFetching, currentPricesQuery.isStale]);

  // Transform data for the table
  const transformedData: CryptoData[] = currentPricesQuery.data 
    ? Object.keys(currentPricesQuery.data).map(coinId => {
        const currentData = currentPricesQuery.data[coinId];
        return {
          coin: coinId,
          usd: currentData.usd,
          usd_market_cap: currentData.usd_market_cap,
          usd_24h_vol: currentData.usd_24h_vol,
          usd_24h_change: currentData.usd_24h_change,
          prices: [] // Will be populated by individual chart queries
        };
      })
    : [];

  // Check if we're using fallback data
  const isUsingFallback = currentPricesQuery.data && 
    Object.values(currentPricesQuery.data).some((data: any) => data.usd === 0);

  return {
    data: transformedData,
    isLoading: currentPricesQuery.isLoading,
    isError: currentPricesQuery.isError,
    isUsingFallback,
    refetch: currentPricesQuery.refetch,
    error: currentPricesQuery.error,
    isStale: currentPricesQuery.isStale,
    isFetching: currentPricesQuery.isFetching,
    dataUpdatedAt: currentPricesQuery.dataUpdatedAt,
    // Custom refresh function that only refreshes main data, not chart data
    refreshMainData: () => {
      console.log('🔄 Refresh button clicked - fetching new main cryptocurrency data only (chart data remains cached)');
      return currentPricesQuery.refetch();
    }
  };
};

// Custom hook for chart data
export const useChartData = (coinId: string) => {
  return useQuery({
    queryKey: ['crypto', 'chart', coinId],
    queryFn: () => fetchChartData(coinId),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours for chart data (less frequently changing)
    gcTime: 24 * 60 * 60 * 1000, // 24 hours in cache
    enabled: !!coinId, // Only run when coinId is provided
    refetchOnMount: false, // Don't refetch if data exists
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};
