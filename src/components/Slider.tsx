'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  className?: string;
  totalItems?: number;
  showMarkers?: boolean;
}

export default function Slider({
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  value: controlledValue,
  onChange,
  onDragStart,
  onDragEnd,
  className = '',
}: SliderProps) {
  // Supports both controlled and uncontrolled modes
  const [internalValue, setInternalValue] = useState(defaultValue ?? min);
  const value = controlledValue ?? internalValue;
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  // requestAnimationFrame ID for optimized updates during drag
  const rafRef = useRef<number | null>(null);

  // Calculate thumb position as percentage of track
  const percentage = max !== min ? ((value - min) / (max - min)) * 100 : 0;
  const thumbPosition = percentage;

  // Snap value to step increments and clamp within min/max range
  const updateValue = useCallback(
    (newValue: number) => {
      const steppedValue = Math.round(newValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));

      if (controlledValue === undefined) {
        setInternalValue(clampedValue);
      }
      onChange?.(clampedValue);
    },
    [step, min, max, controlledValue, onChange]
  );

  // Convert mouse X position to slider value using RAF for smooth 60fps updates
  const updateValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;

      // Cancel previous frame to avoid queueing up updates
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (!trackRef.current) return;

        const rect = trackRef.current.getBoundingClientRect();
        const percentage = Math.max(
          0,
          Math.min(1, (clientX - rect.left) / rect.width)
        );
        const newValue = min + percentage * (max - min);
        updateValue(newValue);
      });
    },
    [min, max, updateValue]
  );

  // Start drag and jump to clicked position immediately
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!trackRef.current) return;

    setIsDragging(true);
    onDragStart?.();
    updateValueFromPosition(e.clientX);
  };

  // Global mouse handlers for smooth dragging outside component bounds
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      updateValueFromPosition(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd?.();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isDragging, updateValueFromPosition, onDragEnd]);

  // Keyboard accessibility: arrow keys, Home, End
  const handleKeyDown = (e: React.KeyboardEvent) => {
    let newValue = value;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = value - step;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = value + step;
        break;
      case 'Home':
        e.preventDefault();
        newValue = min;
        break;
      case 'End':
        e.preventDefault();
        newValue = max;
        break;
      default:
        return;
    }

    updateValue(newValue);
  };

  return (
    <div
      className={`relative w-full h-12 flex items-center ${className}`}
      onMouseDown={handleMouseDown}
    >
      {/* Track */}
      <div
        ref={trackRef}
        className="relative w-full h-[10px] cursor-pointer"
        style={{
          backgroundColor: '#e5e5e5',
          contain: 'layout style paint', // Performance: isolate layout/paint
        }}
      >
        {/* Rectangular Handle - performance optimized with transform3d */}
        <div
          ref={thumbRef}
          role="slider"
          tabIndex={0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          onKeyDown={handleKeyDown}
          className="absolute top-1/2 w-16 h-full cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-none"
          style={{
            backgroundColor: '#999999',
            left: `${thumbPosition}%`,
            transform: `translate3d(-50%, -50%, 0)`, // GPU acceleration
            willChange: isDragging ? 'transform' : 'auto', // Hint browser during drag
            backfaceVisibility: 'hidden',
            perspective: 1000,
          }}
        />
      </div>
    </div>
  );
}
