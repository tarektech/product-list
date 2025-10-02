'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterProps {
  onFilterChange: (filters: {
    minPrice?: number;
    maxPrice?: number;
    minPopularity?: number;
    maxPopularity?: number;
  }) => void;
  isLoading?: boolean;
}

export default function ProductFilter({
  onFilterChange,
  isLoading = false,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPopularity, setMinPopularity] = useState('');
  const [maxPopularity, setMaxPopularity] = useState('');

  const handleApplyFilters = () => {
    const filters: {
      minPrice?: number;
      maxPrice?: number;
      minPopularity?: number;
      maxPopularity?: number;
    } = {};

    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (minPopularity) filters.minPopularity = parseFloat(minPopularity);
    if (maxPopularity) filters.maxPopularity = parseFloat(maxPopularity);

    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinPopularity('');
    setMaxPopularity('');
    onFilterChange({});
    setIsOpen(false);
  };

  const hasActiveFilters =
    minPrice || maxPrice || minPopularity || maxPopularity;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          hasActiveFilters
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        disabled={isLoading}
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">
          {hasActiveFilters ? 'Filters Applied' : 'Filter Products'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 sm:right-0 left-0 sm:left-auto bg-white rounded-lg shadow-xl border border-gray-200 p-4 sm:p-6 w-full sm:w-80 max-w-md sm:max-w-none z-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Filters
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 touch-manipulation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (USD)
            </label>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-black px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
                min="0"
                step="10"
              />
              <span className="text-gray-500 hidden sm:inline">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-black px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
                min="0"
                step="10"
              />
            </div>
          </div>

          {/* Popularity Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Popularity Score (0-1)
            </label>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input
                type="number"
                placeholder="Min"
                value={minPopularity}
                onChange={(e) => setMinPopularity(e.target.value)}
                className="w-full text-black px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
                min="0"
                max="1"
                step="0.1"
              />
              <span className="text-gray-500 hidden sm:inline">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPopularity}
                onChange={(e) => setMaxPopularity(e.target.value)}
                className="w-full text-black px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
                min="0"
                max="1"
                step="0.1"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleApplyFilters}
              disabled={isLoading}
              className="flex-1 bg-blue-500 text-white px-4 py-2.5 sm:py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {isLoading ? 'Loading...' : 'Apply Filters'}
            </button>
            <button
              onClick={handleClearFilters}
              disabled={isLoading || !hasActiveFilters}
              className="px-4 py-2.5 sm:py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              Clear
            </button>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-xs text-blue-800 font-medium mb-1">
                Active Filters:
              </p>
              <div className="text-xs text-blue-600 space-y-1">
                {minPrice && <p>Min Price: ${minPrice}</p>}
                {maxPrice && <p>Max Price: ${maxPrice}</p>}
                {minPopularity && <p>Min Popularity: {minPopularity}</p>}
                {maxPopularity && <p>Max Popularity: {maxPopularity}</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
