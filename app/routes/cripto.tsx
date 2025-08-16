import { useEffect, useState, useRef } from "react";
import type { Route } from "./+types/home";
import { MockCryptoApiService, type CryptoData } from "../cripto/mockApiService";
import CryptoTable, { type CryptoTableRef } from "../cripto/CryptoTable";
import { FaSync } from "react-icons/fa";
import "../cripto/styles.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cripto Coins" },
    { name: "description", content: "Cripto Coins" },
  ];
}



export default function Cripto() {
  const [rowData, setRowData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const tableRef = useRef<CryptoTableRef>(null);

  // Common function to load all data
  const loadAllData = async () => {
    try {
      setLoading(true);
      setChartsLoading(true);
      
      // Phase 1: Load general data for all cryptos (fast)
      const currentPrices = await MockCryptoApiService.getCurrentPrices();
      
      // Transform to table format with empty prices (will be filled in phase 2)
      const transformedData: CryptoData[] = Object.keys(currentPrices).map(coinId => {
        const currentData = currentPrices[coinId];
        
        return {
          coin: coinId,
          usd: currentData.usd,
          usd_market_cap: currentData.usd_market_cap,
          usd_24h_vol: currentData.usd_24h_vol,
          usd_24h_change: currentData.usd_24h_change,
          prices: [] // Empty initially, will be populated in phase 2
        };
      });
      
      setRowData(transformedData);
      setLoading(false);
      
      // Phase 2: Load chart data for each crypto (progressive enhancement)
      await loadChartData(transformedData);
      setChartsLoading(false);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
      setChartsLoading(false);
    }
  };

  // Phase 2: Load chart data progressively
  const loadChartData = async (data: CryptoData[]) => {
    try {
      for (const crypto of data) {
        const chartData = await MockCryptoApiService.getMarketChart(crypto.coin);
        
        // Update individual row using AgGrid's API (no full re-render)
        if (tableRef.current) {
          const prices = chartData.prices.map((priceData: [number, number]) => priceData[1]);
          tableRef.current.updateRowData(crypto.coin, prices);
        }
        
        // Small delay to show progressive loading
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  // Initial data loading
  useEffect(() => {
    loadAllData();
  }, []);

  // Refresh function to reload all data
  const handleRefresh = async () => {
    await loadAllData();
  };



    return (
    <div className="app-container p-6">
      <div className="crypto-card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Cryptocurrency Market Data</h1>
            <p className="text-gray-300">Real-time market information and price trends</p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading || chartsLoading}
            className="btn-primary p-3"
            title="Refresh data"
          >
            <FaSync className={`w-5 h-5 ${loading || chartsLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      <CryptoTable 
        ref={tableRef}
        rowData={rowData} 
        loading={loading} 
        chartsLoading={chartsLoading} 
      />
    </div>
  );


}
