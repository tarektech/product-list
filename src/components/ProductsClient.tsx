'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import ProductCarousel from './ProductCarousel';
import ProductFilter from './ProductFilter';
import { ProductsResponse } from '@/utils/types';
import { RefreshCcw } from 'lucide-react';

interface ProductsClientProps {
  initialData: ProductsResponse;
}

export default function ProductsClient({ initialData }: ProductsClientProps) {
  const [data, setData] = useState<ProductsResponse>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date(initialData.timestamp));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const currentFiltersRef = useRef<{
    minPrice?: number;
    maxPrice?: number;
    minPopularity?: number;
    maxPopularity?: number;
  }>({});

  // Fetch products
  const fetchProducts = useCallback(
    async (
      filters: {
        minPrice?: number;
        maxPrice?: number;
        minPopularity?: number;
        maxPopularity?: number;
      },
      isBackgroundUpdate = false,
    ) => {
      try {
        if (isBackgroundUpdate) setIsUpdating(true);

        const params = new URLSearchParams();
        if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.minPopularity !== undefined) params.append('minPopularity', filters.minPopularity.toString());
        if (filters.maxPopularity !== undefined) params.append('maxPopularity', filters.maxPopularity.toString());

        const response = await fetch(`/api/products?${params.toString()}`);

        if (response.ok) {
          const newData = await response.json();
          setData(newData);
          setLastUpdate(new Date(newData.timestamp));
        }
      } catch (error) {
        console.error('Error fetching filtered products:', error);
      } finally {
        if (isBackgroundUpdate) {
          setTimeout(() => setIsUpdating(false), 2000);
        }
      }
    },
    [],
  );

  // Handle filter change event
  //usecallback used for performance optimization
  const handleFilterChange = useCallback(
    async (filters: { minPrice?: number; maxPrice?: number; minPopularity?: number; maxPopularity?: number }) => {
      setIsLoading(true);
      currentFiltersRef.current = filters;

      try {
        await fetchProducts(filters);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProducts],
  );

  // Mark as mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products every minute to get updated gold prices
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProducts(currentFiltersRef.current, true);
    }, 60000); // 60 seconds = 1 minute

    return () => clearInterval(interval);
  }, [fetchProducts]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white p-8">
      <div className="mb-4 text-center">
        <div className="flex justify-between items-center gap-2">
          <p className="text-sm text-gray-600 font-bold flex items-center justify-center gap-2">
            Current Gold Price: <span className="font-semibold text-black">${data.goldPrice.toFixed(2)}</span> per gram
            {isUpdating && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full animate-pulse">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating
              </span>
            )}
          </p>
          {/* refresh button */}
          <button
            onClick={() => fetchProducts(currentFiltersRef.current, false)}
            className="bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer rounded-full p-2"
          >
            {isLoading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
          </button>
        </div>

        {/* Display time */}
        {mounted && (
          <>
            <p className="text-sm text-black font-bold">
              {currentTime.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </p>
            <p className="text-sm text-black mt-1 font-bold">
              Last price update:{' '}
              {lastUpdate.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </p>
          </>
        )}
      </div>

      <div className="mb-6">
        <ProductFilter onFilterChange={handleFilterChange} isLoading={isLoading} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : data.products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products match your filters</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria</p>
        </div>
      ) : (
        <ProductCarousel products={data.products} />
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        Showing {data.products.length} product
        {data.products.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
