import React, { useState } from 'react';
import { FaSync } from 'react-icons/fa';
import SparklineCellRenderer from './SparklineCellRenderer';

interface ChartRefreshRendererProps {
  value: number[];
  data: any;
  onRefresh: (coinId: string) => Promise<void>;
}

const ChartRefreshRenderer: React.FC<ChartRefreshRendererProps> = ({ value, data, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(value && value.length > 0);
  
  const coinId = data?.coin;
  
  const handleRefresh = async () => {
    if (!coinId || isLoading) return;
    
    setIsLoading(true);
    try {
      await onRefresh(coinId);
      setHasData(true);
    } catch (error) {
      console.warn(`Failed to load chart data for ${coinId}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // If we have data, show the actual sparkline chart
  if (hasData && value && value.length > 0) {
    return <SparklineCellRenderer value={value} data={data} />;
  }

  // Show refresh button
  return (
    <div className="flex items-center justify-center h-full">
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 transition-colors duration-200"
        title={`Load 7-day price chart for ${coinId}`}
      >
        <FaSync 
          className={`w-3 h-3 text-white ${isLoading ? 'animate-spin' : ''}`} 
        />
      </button>
    </div>
  );
};

export default ChartRefreshRenderer;
