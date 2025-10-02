import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Using multiple fallback gold price APIs for reliability
async function fetchGoldPrice(): Promise<number> {
  try {
    // Primary: Gold API (free tier)
    //metals.dev API has limit usage of 25 requests per month
    const response = await fetch(
      `https://api.metals.dev/v1/latest?api_key=${process.env.METALS_API_KEY}&currency=TRY&unit=g`,
      {
        cache: 'no-store',
        next: { revalidate: 0 },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.metals?.gold; // Fallback if gold not in response
    }
  } catch (error) {
    console.error('Primary gold API failed:', error);
  }

  try {
    // Secondary: Alternative gold price source
    const response = await fetch('https://api.gold-api.com/price/XAU', {
      cache: 'no-store',
      next: { revalidate: 0 },
    });


    if (response.ok) {
      const data = await response.json();
      // Convert from troy ounce to gram (1 troy ounce = 31.1035 grams)
      return data.price ? data.price / 31.1035 : 85.0;
    }
  } catch (error) {
    console.error('Secondary gold API failed:', error);
  }

  // Fallback: Return approximate current gold price per gram in USD
  // As of 2025, gold is approximately $85-90 per gram
  console.warn('Using fallback gold price');
  return 85.0;
}

export async function GET() {
  try {
    const goldPrice = await fetchGoldPrice();

    return NextResponse.json({
      goldPrice,
      currency: 'USD',
      unit: 'gram',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching gold price:', error);
    return NextResponse.json({ error: 'Failed to fetch gold price', goldPrice: 85.0 }, { status: 500 });
  }
}
