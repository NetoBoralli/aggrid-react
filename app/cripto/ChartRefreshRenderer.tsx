import React, { useState } from 'react';
import { FaChartLine, FaChartBar } from 'react-icons/fa';
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
        className="btn-primary p-2 rounded-lg bg-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        title={`Load 7-day price chart for ${coinId}`}
      >
        {isLoading ? (
          <FaChartBar className="w-4 h-4 text-white animate-pulse" />
        ) : (
          <FaChartLine className="w-4 h-4 text-white hover:text-gray-200 transition-colors duration-200" />
        )}
      </button>
    </div>
  );
};

export default ChartRefreshRenderer;
