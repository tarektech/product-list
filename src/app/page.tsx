import ProductsClient from '@/components/ProductsClient';
import { ProductsResponse } from '@/utils/types';

async function getProducts(): Promise<ProductsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/products`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty state on error
    return {
      products: [],
      goldPrice: 0,
      currency: 'USD',
      timestamp: new Date().toISOString(),
      filters: {
        minPrice: null,
        maxPrice: null,
        minPopularity: null,
        maxPopularity: null,
      },
    };
  }
}

export default async function Home() {
  const initialData = await getProducts();

  return <ProductsClient initialData={initialData} />;
}
