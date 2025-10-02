'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import Slider from './Slider';
import { ProductWithPrice } from '@/utils/types';

export default function ProductCarousel({
  products,
}: {
  products: ProductWithPrice[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  // Slider synchronization state
  const [sliderValue, setSliderValue] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  // Prevents scroll updates while dragging slider to avoid feedback loop
  const [isSliderDragging, setIsSliderDragging] = useState(false);

  // Scroll by fixed amount when clicking arrow buttons
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 240; // Slightly more than card width (220px) + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Convert vertical mouse wheel to horizontal scroll
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        element.scrollLeft += e.deltaY;
      }
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleWheel);
  }, []);

  // Drag-to-scroll: capture starting position
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  // Calculate drag distance and update scroll (1.5x multiplier for smoother feel)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // Calculate maximum scrollable distance for slider range
  useEffect(() => {
    const updateMaxScroll = () => {
      if (scrollRef.current) {
        setMaxScroll(
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth
        );
      }
    };
    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);
    return () => window.removeEventListener('resize', updateMaxScroll);
  }, [products]);

  // Sync scroll position to slider value (but NOT while user drags slider)
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      if (!isSliderDragging) {
        setSliderValue(element.scrollLeft);
      }
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [isSliderDragging]);

  // Sync slider drag to scroll position (immediate update prevents lag)
  const handleSliderChange = (value: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = value;
    }
    // Update state immediately to avoid visual lag during slider drag
    setSliderValue(value);
  };

  return (
    <div className="relative w-full max-w-6xl">
      {/* Left button */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      {/* Scroll container - disable smooth scroll during drag for better responsiveness */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`flex gap-4 overflow-x-auto scrollbar-hide ${
          !isSliderDragging && !isDragging ? 'scroll-smooth' : ''
        } px-12 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {products.map((product, index) => (
          <div key={index} className="flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Right button */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Slider */}
      <div className="mt-8 px-12">
        <Slider
          value={sliderValue}
          onChange={handleSliderChange}
          onDragStart={() => setIsSliderDragging(true)}
          onDragEnd={() => setIsSliderDragging(false)}
          min={0}
          max={maxScroll}
          step={1}
          totalItems={products.length}
          showMarkers={true}
        />
      </div>
    </div>
  );
}
