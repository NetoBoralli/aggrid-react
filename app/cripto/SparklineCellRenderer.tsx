import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import type { TooltipItem } from 'chart.js';

const SparklineCellRenderer = ({ value, data }: { value: number[], data: any }) => {
  // value: array of prices
  // data: full row data from Ag-Grid
  
  // Show skeleton loader if no price data is available yet
  if (!value || value.length === 0) {
    return (
      <div className="animate-pulse">
        <div className="w-[100px] h-9 bg-gray-600 rounded"></div>
      </div>
    );
  }
  
  // Use 24h change to determine graph color
  const change24h = data?.usd_24h_change || 0;
  const graphColor = change24h >= 0 ? '#4caf50' : '#f44336'; // Green for positive, red for negative

  // Calculate trend for each bar (positive = above line, negative = below line)
  const trendData = value.map((price, i) => {
    if (i === 0) return 0; // First point has no trend
    const change = price - value[i - 1];
    return change >= 0 ? Math.abs(change) : -Math.abs(change);
  });

  const chartData = {
    labels: value.map((_, i) => i),
    datasets: [
      {
        data: trendData,
        backgroundColor: value.map((price, i) => {
          if (i === 0) return 'transparent';
          return graphColor; // Use consistent color for entire graph
        }),
        borderColor: value.map((price, i) => {
          if (i === 0) return 'transparent';
          return graphColor; // Use consistent color for entire graph
        }),
        borderWidth: 1,
        borderRadius: 2,
        borderSkipped: false,
        categoryPercentage: 0.8,
        barPercentage: 0.9
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          title: () => '',
          label: (context: TooltipItem<'bar'>) => {
            const index = context.dataIndex;
            if (index === 0) return '';
            const price = value[index];
            return `$${price.toLocaleString()}`;
          }
        }
      }
    },
    scales: { 
      x: { display: false }, 
      y: { 
        display: false,
        beginAtZero: true
      } 
    },
    interaction: {
      mode: 'index' as const,
      intersect: false
    }
  };

  return (
    <div style={{ width: '100px', height: '40px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SparklineCellRenderer;
