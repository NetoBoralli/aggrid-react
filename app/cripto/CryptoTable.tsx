import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import SparklineCellRenderer from "./SparklineCellRenderer";
import { SkeletonTable } from "./SkeletonLoader";
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
import type { CryptoData } from "./mockApiService";

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
  chartsLoading: boolean;
}

// Custom ref type for the table
export interface CryptoTableRef {
  updateRowData: (coinId: string, newPrices: number[]) => void;
}

const CryptoTable = React.forwardRef<CryptoTableRef, CryptoTableProps>(({ rowData, loading, chartsLoading }, ref) => {
  const gridRef = React.useRef<AgGridReact>(null);
  
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Coin',
      field: 'coin',
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 flex items-center justify-center">
            {getCryptoIcon(params.value)}
          </div>
          <span className="font-semibold capitalize">{params.value}</span>
        </div>
      )
    },
    {
      headerName: 'Price (USD)',
      field: 'usd',
      width: 200,
      valueFormatter: (params) => `$${params.value.toLocaleString()}`
    },
    {
      headerName: 'Market Cap',
      field: 'usd_market_cap',
      width: 150,
      valueFormatter: (params) => `$${(params.value / 1e9).toFixed(2)}B`
    },
    {
      headerName: '24h Volume',
      field: 'usd_24h_vol',
      width: 150,
      valueFormatter: (params) => `$${(params.value / 1e9).toFixed(2)}B`
    },
    {
      headerName: '24h Change',
      field: 'usd_24h_change',
      width: 120,
      cellRenderer: (params: ICellRendererParams) => (
        <div className={`font-semibold ${
          params.value >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {params.value >= 0 ? '+' : ''}{params.value.toFixed(2)}%
        </div>
      )
    },
    {
      headerName: 'Price (7d)',
      field: 'prices',
      width: 180,
      cellRenderer: SparklineCellRenderer
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  // Method to update individual row data without full re-render
  const updateRowData = React.useCallback((coinId: string, newPrices: number[]) => {
    if (gridRef.current?.api) {
      const rowNode = gridRef.current.api.getRowNode(coinId);
      if (rowNode) {
        rowNode.setDataValue('prices', newPrices);
      }
    }
  }, []);

  // Expose the update method to parent component
  React.useImperativeHandle(ref, () => ({
    updateRowData
  }), [updateRowData]);

  // Conditional return after all hooks
  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-2rem-1.5rem-2rem-7rem)]">
        <SkeletonTable rows={3} />
      </div>
    );
  }

  return (
    <div className="ag-theme-alpine w-full h-[calc(100vh-3rem-1.5rem-2rem-6rem)]">
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={(params) => params.data.coin} // Use coin as unique row ID
      />
    </div>
  );
});

export default CryptoTable;
