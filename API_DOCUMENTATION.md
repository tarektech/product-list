# API Documentation

## Overview

This REST API serves product data with dynamically calculated prices based on real-time gold prices.

## Base URL

```
http://localhost:3000/api
```

---

## Endpoints

### 1. Get Gold Price

**Endpoint:** `GET /api/gold-price`

**Description:** Fetches the current gold price per gram in USD from real-time data sources.

**Response:**

```json
{
  "goldPrice": 85.0,
  "currency": "USD",
  "unit": "gram",
  "timestamp": "2025-10-01T12:00:00.000Z"
}
```

**Response Fields:**

- `goldPrice` (number): Current price of gold per gram in USD
- `currency` (string): Currency code (always "USD")
- `unit` (string): Unit of measurement (always "gram")
- `timestamp` (string): ISO 8601 timestamp of when the data was fetched

---

### 2. Get Products

**Endpoint:** `GET /api/products`

**Description:** Returns all products with dynamically calculated prices based on the formula:

```
Price = (popularityScore + 1) × weight × goldPrice
```

**Query Parameters (Optional):**

| Parameter       | Type   | Description                          | Example              |
| --------------- | ------ | ------------------------------------ | -------------------- |
| `minPrice`      | number | Minimum price filter (in USD)        | `?minPrice=100`      |
| `maxPrice`      | number | Maximum price filter (in USD)        | `?maxPrice=1000`     |
| `minPopularity` | number | Minimum popularity score (0-1 range) | `?minPopularity=0.5` |
| `maxPopularity` | number | Maximum popularity score (0-1 range) | `?maxPopularity=0.9` |

**Example Requests:**

```bash
# Get all products
GET /api/products

# Filter by price range
GET /api/products?minPrice=200&maxPrice=800

# Filter by popularity
GET /api/products?minPopularity=0.8

# Combine filters
GET /api/products?minPrice=300&maxPrice=700&minPopularity=0.7&maxPopularity=0.95
```

**Response:**

```json
{
  "products": [
    {
      "name": "Engagement Ring 1",
      "popularityScore": 0.85,
      "weight": 2.1,
      "images": {
        "yellow": "https://...",
        "rose": "https://...",
        "white": "https://..."
      },
      "price": 328.65,
      "rating": 4.3
    }
  ],
  "goldPrice": 85.0,
  "currency": "USD",
  "timestamp": "2025-10-01T12:00:00.000Z",
  "filters": {
    "minPrice": null,
    "maxPrice": null,
    "minPopularity": null,
    "maxPopularity": null
  }
}
```

**Response Fields:**

- `products` (array): Array of product objects with calculated prices
  - `name` (string): Product name
  - `popularityScore` (number): Popularity score (0-1 range)
  - `weight` (number): Weight in grams
  - `images` (object): Product images for each color variant
    - `yellow` (string): URL for yellow gold variant
    - `rose` (string): URL for rose gold variant
    - `white` (string): URL for white gold variant
  - `price` (number): Calculated price in USD
  - `rating` (number): Popularity converted to 5-star rating (1 decimal place)
- `goldPrice` (number): Current gold price used for calculations
- `currency` (string): Currency code
- `timestamp` (string): ISO 8601 timestamp
- `filters` (object): Applied filters (null if not applied)

---

## Price Calculation Formula

The price for each product is dynamically calculated using:

```
Price = (popularityScore + 1) × weight × goldPrice
```

**Where:**

- `popularityScore`: A value between 0 and 1 representing product popularity
- `weight`: Product weight in grams
- `goldPrice`: Real-time gold price per gram in USD

**Example:**

For a product with:

- Popularity Score: 0.85
- Weight: 2.1 grams
- Gold Price: $85.00/gram

```
Price = (0.85 + 1) × 2.1 × 85.00
     = 1.85 × 2.1 × 85.00
     = $330.33 USD
```

---

## Rating Calculation

Popularity scores (0-1) are converted to 5-star ratings:

```
Rating = popularityScore × 5
```

Rounded to 1 decimal place.

**Example:**

- Popularity Score: 0.85 → Rating: 4.3/5

---

## Error Handling

**Error Response Format:**

```json
{
  "error": "Error message description"
}
```

**Status Codes:**

- `200 OK`: Success
- `500 Internal Server Error`: Server error or API failure

---

## Data Source

- **Gold Price:** Fetched from real-time gold price APIs with fallback mechanisms
- **Product Data:** Served from `src/utils/products.json`

---

## Notes

1. All prices are in USD
2. Gold prices are cached for performance but refreshed on each request
3. Filtering is case-sensitive for string values
4. Empty results are returned as empty arrays, not errors
5. The API automatically falls back to an approximate gold price if external APIs fail
