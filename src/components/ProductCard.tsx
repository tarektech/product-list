'use client';
import { ProductWithPrice } from '@/utils/types';
import Image from 'next/image';
import { useState } from 'react';
import { Star } from 'lucide-react';

type ColorType = 'yellow' | 'rose' | 'white';

export default function ProductCard({
  product,
}: {
  product: ProductWithPrice;
}) {
  // Track which color variant is currently selected
  const [selectedColor, setSelectedColor] = useState<ColorType>('yellow');

  const colorLabels: Record<ColorType, string> = {
    yellow: 'Yellow Gold',
    white: 'White Gold',
    rose: 'Rose Gold',
  };

  const colorStyles: Record<ColorType, string> = {
    yellow: 'bg-[#E6CA97]',
    white: 'bg-[#D9D9D9]',
    rose: 'bg-[#E1A4A9]',
  };

  // Use the price and rating calculated by the API
  const price = product.price.toFixed(2);
  const rating = product.rating.toFixed(1);

  return (
    <div className="flex flex-col items-start bg-[#F5F5F5] rounded-lg p-4 w-[220px] h-[340px]">
      {/* Product image dynamically changes based on selectedColor */}
      <div className="w-full h-[180px] bg-white rounded-lg flex items-center justify-center mb-3 overflow-hidden">
        <Image
          src={product.images[selectedColor]}
          alt={product.name}
          width={180}
          height={180}
          className="object-contain"
        />
      </div>

      <div className="w-full flex flex-col gap-1">
        <h3 className="text-[15px] font-medium text-gray-900 font-montserrat">
          {product.name}
        </h3>
        <p className="text-[15px] font-regular font-montserrat text-gray-900">
          ${price} USD
        </p>

        {/* Color selector buttons - renders available colors from product.images */}
        <div className="flex gap-2 items-center mt-2">
          {(Object.keys(product.images) as ColorType[]).map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-5 h-5 rounded-full border-2 transition-all ${
                selectedColor === color
                  ? 'border-gray-900 scale-110'
                  : 'border-gray-300'
              } ${colorStyles[color]}`}
              aria-label={colorLabels[color]}
            />
          ))}
        </div>

        <p className="text-[12px] font-regular font-avenir text-gray-600 mt-1">
          {colorLabels[selectedColor]}
        </p>

        {/* Star rating visualization - fills stars based on rating value */}
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(Number(rating))
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          ))}
          <span className="text-xs text-black ml-1 font-avenir text-[14px]">{rating}/5</span>
        </div>
      </div>
    </div>
  );
}
