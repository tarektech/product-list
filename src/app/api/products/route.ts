import { NextResponse } from 'next/server';
import productsData from '@/utils/products.json';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Product {
  name: string;
  popularityScore: number;
  weight: number;
  images: {
    yellow: string;
    rose: string;
    white: string;
  };
}

interface ProductWithPrice extends Product {
  price: number;
  rating: number;
}

async function fetchGoldPrice(): Promise<number> {
  try {
    // Use absolute URL only in development, relative in production
    const baseUrl =
      process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_API_URL;

    // Fetch from our gold price endpoint
    const response = await fetch(`${baseUrl}/api/gold-price`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (response.ok) {
      const data = await response.json();
      return data.goldPrice;
    }
  } catch (error) {
    console.error('Error fetching gold price:', error);
  }

  // Fallback price
  return 85.0;
}

function calculatePrice(popularityScore: number, weight: number, goldPrice: number): number {
  // Price = (popularityScore + 1) * weight * goldPrice
  return (popularityScore + 1) * weight * goldPrice;
}

function calculateRating(popularityScore: number): number {
  // Convert 0-1 score to 0-5 rating with 1 decimal place
  return Math.round(popularityScore * 5 * 10) / 10;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get query parameters for filtering
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minPopularity = searchParams.get('minPopularity');
    const maxPopularity = searchParams.get('maxPopularity');

    // Fetch current gold price
    const goldPrice = await fetchGoldPrice();

    // Calculate prices for all products
    let products: ProductWithPrice[] = (productsData as Product[]).map((product) => ({
      ...product,
      price: calculatePrice(product.popularityScore, product.weight, goldPrice),
      rating: calculateRating(product.popularityScore),
    }));

    // Apply filters if provided
    if (minPrice) {
      products = products.filter((p) => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      products = products.filter((p) => p.price <= parseFloat(maxPrice));
    }

    if (minPopularity) {
      products = products.filter((p) => p.popularityScore >= parseFloat(minPopularity));
    }

    if (maxPopularity) {
      products = products.filter((p) => p.popularityScore <= parseFloat(maxPopularity));
    }

    return NextResponse.json({
      products,
      goldPrice,
      currency: 'USD',
      timestamp: new Date().toISOString(),
      filters: {
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        minPopularity: minPopularity ? parseFloat(minPopularity) : null,
        maxPopularity: maxPopularity ? parseFloat(maxPopularity) : null,
      },
    });
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
