import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import SparklineCellRenderer from "./SparklineCellRenderer";
import { SkeletonTable } from "./SkeletonLoader";
import ChartRefreshRenderer from "./ChartRefreshRenderer";
import { 
  FaBitcoin, 
  FaEthereum,
  FaCoins
} from "react-icons/fa";
import { 
  SiSolana, 
  SiPolkadot, 
  SiLitecoin, 
  SiPolygon, 
  SiStellar, 
  SiOptimism, 
  SiChainlink, 
  SiBitcoincash, 
  SiCardano, 
  SiNear, 
  SiAlgorand 
} from "react-icons/si";
import type { CryptoData } from "../cripto/index";
import { useChartData } from "./useCryptoData";  

// Function to get the appropriate icon for each cryptocurrency
const getCryptoIcon = (coinName: string) => {
  const iconMap: Record<string, React.ReactElement> = {
    'bitcoin': <FaBitcoin className="text-orange-500" />,
    'ethereum': <FaEthereum className="text-blue-500" />,
    'solana': <SiSolana className="text-purple-500" />,
    'polkadot': <SiPolkadot className="text-pink-500" />,
    'litecoin': <SiLitecoin className="text-gray-500" />,
    'polygon': <SiPolygon className="text-purple-600" />,
    'stellar': <SiStellar className="text-blue-400" />,
    'optimism': <SiOptimism className="text-red-500" />,
    'chainlink': <SiChainlink className="text-blue-600" />,
    'bitcoin-cash': <SiBitcoincash className="text-green-500" />,
    'cardano': <SiCardano className="text-blue-700" />,
    'near': <SiNear className="text-black" />,
    'algorand': <SiAlgorand className="text-black" />
  };
  
  return iconMap[coinName.toLowerCase()] || <FaCoins className="text-gray-400" />;
};

interface CryptoTableProps {
  rowData: CryptoData[];
  loading: boolean;
  chartsLoading?: boolean; // Made optional since we're not using it anymore
}

// Custom ref type for the table
export interface CryptoTableRef {
  updateRowData: (coinId: string, newPrices: number[]) => void;
}

const CryptoTable = React.forwardRef<CryptoTableRef, CryptoTableProps>(({ rowData, loading, chartsLoading }, ref) => {
  const gridRef = React.useRef<AgGridReact>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  // Check screen size and update column visibility
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Function to load chart data for a specific cryptocurrency
  const loadChartDataForCoin = async (coinId: string) => {
    try {
      const chartUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`;
      const response = await fetch(chartUrl);
      const chartData = await response.json();
      
      if (chartData.prices && Array.isArray(chartData.prices)) {
        const prices = chartData.prices.map((priceData: [number, number]) => priceData[1]);
        
        // Update the specific row with chart data
        if (gridRef.current?.api) {
          const rowNode = gridRef.current.api.getRowNode(coinId);
          if (rowNode) {
            rowNode.setDataValue('prices', prices);
          }
        }
        
        return prices;
      }
    } catch (error) {
      console.warn(`Failed to load chart data for ${coinId}:`, error);
      throw error;
    }
  };
  
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Coin',
      field: 'coin',
      flex: 1,
      minWidth: 120,
      cellClass: 'ag-cell-vertical-center',
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 flex items-center justify-center">
            {getCryptoIcon(params.value)}
          </div>
          <span className="font-semibold capitalize text-sm sm:text-base">{params.value}</span>
        </div>
      )
    },
    {
      headerName: 'Price (USD)',
      field: 'usd',
      width: 200,
      minWidth: 150,
      valueFormatter: (params) => `$${params.value.toLocaleString()}`,
      cellClass: 'text-sm sm:text-base'
    },
    {
      headerName: 'Market Cap',
      field: 'usd_market_cap',
      width: 150,
      minWidth: 120,
      valueFormatter: (params) => `$${(params.value / 1e9).toFixed(2)}B`,
      hide: isMobile, // Hide on mobile
      cellClass: 'text-sm sm:text-base'
    },
    {
      headerName: '24h Volume',
      field: 'usd_24h_vol',
      width: 150,
      minWidth: 120,
      valueFormatter: (params) => `$${(params.value / 1e9).toFixed(2)}B`,
      hide: isMobile, // Hide on mobile
      cellClass: 'text-sm sm:text-base'
    },
    {
      headerName: '24h Change',
      field: 'usd_24h_change',
      width: 150,
      minWidth: 100,
      cellClass: 'ag-cell-vertical-center',
      cellRenderer: (params: ICellRendererParams) => (
        <div className={`font-semibold text-sm sm:text-base ${
          params.value >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {params.value >= 0 ? '+' : ''}{params.value.toFixed(2)}%
        </div>
      ),
      hide: isMobile, // Hide on mobile
    },
    {
      headerName: 'Price Chart',
      field: 'prices',
      width: 180,
      minWidth: 150,
      cellRenderer: (params: ICellRendererParams) => (
        <ChartRefreshRenderer
          value={params.value}
          data={params.data}
          onRefresh={loadChartDataForCoin}
        />
      ),
      hide: isMobile, // Hide on mobile
      headerTooltip: 'Click refresh button to load 7-day price chart'
    }
  ], [isMobile, loadChartDataForCoin]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  // Chart data loading disabled - no need for updateRowData
  // Expose empty update method to maintain interface compatibility
  React.useImperativeHandle(ref, () => ({
    updateRowData: () => {} // No-op since chart data is not loaded
  }), []);

  // Chart data loading disabled to avoid rate limiting
  // Just show placeholders for now

  // Conditional return after all hooks
  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-2rem-1.5rem-2rem-7rem)]">
        <SkeletonTable rows={3} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="ag-theme-alpine w-full h-[calc(100vh-3rem-1.5rem-2rem-6rem)]">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={(params) => params.data.coin} // Use coin as unique row ID
        />
      </div>
    </div>
  );
});

export default CryptoTable;
