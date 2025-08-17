import { useRef } from "react";
import type { Route } from "./+types/home";
import CryptoTable, { type CryptoTableRef } from "../cripto/CryptoTable";
import { FaSync } from "react-icons/fa";
import "../cripto/styles.css";
import { useCryptoData } from "../cripto/useCryptoData";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cripto Coins" },
    { name: "description", content: "Cripto Coins" },
  ];
}

export default function Cripto() {
  const tableRef = useRef<CryptoTableRef>(null);
  
  // Use React Query hook for cryptocurrency data
  const { 
    data: rowData, 
    isLoading: loading, 
    isError, 
    isUsingFallback, 
    refreshMainData
  } = useCryptoData();

  // Refresh function to reload only main data (not chart data)
  const handleRefresh = async () => {
    refreshMainData();
  };

  return (
    <div className="app-container p-3 sm:p-6">
      <div className="crypto-card p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Cryptocurrency Market Data
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              {isUsingFallback 
                ? "⚠️ Using cached data - API may be unavailable" 
                : "Real-time market information and price trends (click price chart buttons to load charts)"
              }
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="btn-primary p-3 self-start sm:self-auto"
            title="Refresh data"
          >
            <FaSync
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      <CryptoTable 
        ref={tableRef}
        rowData={rowData || []} 
        loading={loading} 
        chartsLoading={false} 
      />
    </div>
  );
}
