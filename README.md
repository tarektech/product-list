# Full Stack Product Display System

A modern Next.js application that displays jewelry products with real-time gold pricing, dynamic price calculation, and advanced filtering capabilities.

## 🚀 Features

### Backend (RESTful API)

- **Real-time Gold Pricing**: Fetches current gold prices from live APIs with automatic fallbacks
- **Dynamic Price Calculation**: Prices calculated using `(popularityScore + 1) × weight × goldPrice`
- **Product Filtering**: Filter by price range and popularity score
- **Type-safe API**: Full TypeScript support with proper types

### Frontend

- **Product Carousel**: Smooth scrolling with arrow navigation and swipe gestures
- **Color Picker**: Interactive color selection that changes product images
- **Star Ratings**: Visual popularity display converted to 5-star rating system
- **Interactive Filters**: Client-side filtering with live updates
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and custom fonts (Montserrat & Avenir)

### Bonus Features ✨

- Advanced filtering by price range and popularity score
- Real-time filter updates without page reload
- Loading states and empty state handling
- Product count display
- Gold price display with timestamp

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── gold-price/
│   │   │   │   └── route.ts          # Gold price API endpoint
│   │   │   └── products/
│   │   │       └── route.ts          # Products API with filtering
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Main page (server component)
│   │   └── globals.css
│   ├── components/
│   │   ├── ProductCard.tsx           # Individual product card
│   │   ├── ProductCarousel.tsx       # Carousel with navigation
│   │   ├── ProductFilter.tsx         # Filter UI component
│   │   ├── ProductsClient.tsx        # Client wrapper with filter logic
│   │   └── Slider.tsx                # Custom slider component
│   └── utils/
│       ├── products.json             # Product data source
│       └── types.ts                  # TypeScript type definitions
├── public/
│   └── fonts/                        # Custom fonts
└── API_DOCUMENTATION.md              # Detailed API docs
```

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- npm or pnpm

### Steps

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run development server:**

   ```bash
   npm run dev
   ```

3. **Open in browser:**

   ```
   http://localhost:3000
   ```

---

## 🔌 API Endpoints

### 1. Gold Price Endpoint

```
GET /api/gold-price
```

Returns current gold price per gram in USD.

**Response:**

```json
{
  "goldPrice": 85.0,
  "currency": "USD",
  "unit": "gram",
  "timestamp": "2025-10-01T12:00:00.000Z"
}
```

### 2. Products Endpoint

```
GET /api/products
```

Returns all products with calculated prices.

**Query Parameters:**

- `minPrice` - Minimum price filter (USD)
- `maxPrice` - Maximum price filter (USD)
- `minPopularity` - Minimum popularity score (0-1)
- `maxPopularity` - Maximum popularity score (0-1)

**Examples:**

```bash
# Get all products
GET /api/products

# Filter by price range
GET /api/products?minPrice=200&maxPrice=800

# Filter by popularity
GET /api/products?minPopularity=0.8&maxPopularity=1.0

# Combined filters
GET /api/products?minPrice=300&maxPrice=700&minPopularity=0.7
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

📖 **Full API documentation:** See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 💰 Price Calculation

Each product's price is dynamically calculated using:

```
Price = (popularityScore + 1) × weight × goldPrice
```

**Example:**

- Popularity Score: 0.85
- Weight: 2.1 grams
- Gold Price: $85.00/gram

```
Price = (0.85 + 1) × 2.1 × 85.00
     = 1.85 × 2.1 × 85.00
     = $330.33 USD
```

---

## ⭐ Rating System

Popularity scores (0-1 range) are converted to 5-star ratings:

```
Rating = popularityScore × 5
```

Displayed with 1 decimal place (e.g., 4.3/5)

---

## 🎨 Features Details

### Color Picker

- Three color variants per product: Yellow Gold, Rose Gold, White Gold
- Click color circles to switch product images
- Active color indicated with darker border and scale effect

### Carousel Navigation

- **Arrow Buttons**: Navigate left/right
- **Drag to Scroll**: Click and drag horizontally
- **Swipe Support**: Touch gestures on mobile
- **Mouse Wheel**: Scroll vertically to move carousel horizontally
- **Slider**: Visual progress indicator with clickable navigation

### Product Filtering

- **Filter Button**: Click to open filter panel
- **Price Range**: Set minimum and maximum price
- **Popularity Range**: Filter by popularity score (0-1)
- **Apply Filters**: Updates products in real-time
- **Clear Filters**: Reset all filters at once
- **Active Filter Indicator**: Button changes color when filters applied

---

## 🧪 Testing API with cURL

```bash
# Test gold price endpoint
curl http://localhost:3000/api/gold-price

# Test products endpoint
curl http://localhost:3000/api/products

# Test filtering
curl "http://localhost:3000/api/products?minPrice=200&maxPrice=600"

curl "http://localhost:3000/api/products?minPopularity=0.8"
```

---

## 📦 Technology Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with Lucide React icons
- **Fonts**: Montserrat, Avenir (self-hosted)
- **API**: Next.js API Routes (RESTful)

---

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

This is used for API calls. Defaults to `http://localhost:3000` if not set.

---

## 📊 Product Data Format

Products are stored in `src/utils/products.json`:

```json
{
  "name": "Product Name",
  "popularityScore": 0.85,
  "weight": 2.1,
  "images": {
    "yellow": "image-url",
    "rose": "image-url",
    "white": "image-url"
  }
}
```

---

## 🚀 Build for Production

```bash
# Build
npm run build

# Start production server
npm start
```

---

## 📝 Scripts

```json
{
  "dev": "next dev --turbopack",
  "build": "next build --turbopack",
  "start": "next start",
  "lint": "eslint"
}
```

---

## 🎯 Key Implementation Highlights

1. **Server-Side Rendering**: Initial data fetched server-side for better SEO and performance
2. **Client-Side Filtering**: Filter updates happen client-side without full page reload
3. **Type Safety**: Full TypeScript coverage across frontend and backend
4. **Error Handling**: Graceful fallbacks for API failures
5. **Responsive Design**: Mobile-first approach with touch gesture support
6. **Performance**: Optimized images with Next.js Image component
7. **Real-time Data**: Gold prices fetched from live APIs with fallback mechanisms

---

## 🐛 Troubleshooting

### Gold Price API Issues

If gold price APIs fail, the system automatically falls back to an approximate price of $85/gram. Check console for API error messages.

### Build Errors

Make sure you're using Node.js 18 or higher:

```bash
node --version
```

### Port Already in Use

If port 3000 is busy:

```bash
npm run dev -- -p 3001
```

---

## 📄 License

This project is for internship assessment purposes.

---

## 👨‍💻 Author

Full Stack Developer Internship Project

---

## 🎉 Bonus Features Implemented

✅ Backend filtering by price range  
✅ Backend filtering by popularity score  
✅ Interactive filter UI component  
✅ Real-time filter updates  
✅ Combined filter support  
✅ Empty state handling  
✅ Loading states  
✅ Filter status indicators

---

## 📞 Support

For questions or issues, refer to the API documentation or check the console for detailed error messages.
