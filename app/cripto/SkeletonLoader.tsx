import React from 'react';

// Skeleton row component
const SkeletonRow = () => (
  <div className="animate-pulse">
    <div className="flex items-center py-3 border-b border-gray-700">
      {/* Coin column */}
      <div className="flex items-center space-x-3 flex-1 px-2">
        <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
        <div className="w-16 h-4 bg-gray-600 rounded"></div>
      </div>
      
      {/* Price column */}
      <div className="flex-1 px-2">
        <div className="w-20 h-4 bg-gray-600 rounded"></div>
      </div>
      
      {/* Market Cap column */}
      <div className="flex-1 px-2">
        <div className="w-24 h-4 bg-gray-600 rounded"></div>
      </div>
      
      {/* Volume column */}
      <div className="flex-1 px-2">
        <div className="w-24 h-4 bg-gray-600 rounded"></div>
      </div>
      
      {/* 24h Change column */}
      <div className="flex-1 px-2">
        <div className="w-20 h-4 bg-gray-600 rounded"></div>
      </div>
      
      {/* Price Chart column */}
      <div className="flex-1 px-2">
        <div className="w-28 h-8 bg-gray-600 rounded"></div>
      </div>
    </div>
  </div>
);

// Skeleton table component
const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="w-full h-full flex flex-col">
    {/* Header skeleton */}
    <div className="animate-pulse">
      <div className="flex items-center py-3 border-b-2 border-gray-600 bg-gray-800">
        <div className="flex-1 px-2">
          <div className="w-24 h-5 bg-gray-500 rounded"></div>
        </div>
        <div className="flex-1 px-2">
          <div className="w-20 h-5 bg-gray-500 rounded"></div>
        </div>
        <div className="flex-1 px-2">
          <div className="w-24 h-5 bg-gray-500 rounded"></div>
        </div>
        <div className="flex-1 px-2">
          <div className="w-24 h-5 bg-gray-500 rounded"></div>
        </div>
        <div className="flex-1 px-2">
          <div className="w-20 h-5 bg-gray-500 rounded"></div>
        </div>
        <div className="flex-1 px-2">
          <div className="w-28 h-5 bg-gray-500 rounded"></div>
        </div>
      </div>
    </div>
    
    {/* Rows skeleton - fill remaining space */}
    <div className="flex-1 space-y-1">
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </div>
  </div>
);

// Charts loading skeleton
const ChartsLoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-center space-x-4 py-3 border-b border-gray-200">
      {/* Coin column */}
      <div className="flex items-center space-x-3 w-32">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
      </div>
      
      {/* Price column */}
      <div className="w-24">
        <div className="w-20 h-4 bg-gray-300 rounded"></div>
      </div>
      
      {/* Market Cap column */}
      <div className="w-28">
        <div className="w-24 h-4 bg-gray-300 rounded"></div>
      </div>
      
      {/* Volume column */}
      <div className="w-28">
        <div className="w-24 h-4 bg-gray-300 rounded"></div>
      </div>
      
      {/* 24h Change column */}
      <div className="w-24">
        <div className="w-20 h-4 bg-gray-300 rounded"></div>
      </div>
      
      {/* Price Chart column - Loading state */}
      <div className="w-32">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-20 h-4 bg-blue-300 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export { SkeletonTable, SkeletonRow, ChartsLoadingSkeleton };
