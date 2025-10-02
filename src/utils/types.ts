export type Product = {
  name: string;
  popularityScore: number;
  weight: number;
  images: {
    yellow: string;
    rose: string;
    white: string;
  };
};

export type ProductWithPrice = Product & {
  price: number;
  rating: number;
};

export type ProductsResponse = {
  products: ProductWithPrice[];
  goldPrice: number;
  currency: string;
  timestamp: string;
  filters: {
    minPrice: number | null;
    maxPrice: number | null;
    minPopularity: number | null;
    maxPopularity: number | null;
  };
};
