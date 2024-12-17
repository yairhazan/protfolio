// Mock stock data for demonstration
const MOCK_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, currency: 'USD' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 332.58, currency: 'USD' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 125.23, currency: 'USD' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 127.74, currency: 'USD' },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 292.87, currency: 'USD' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 238.45, currency: 'USD' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 454.85, currency: 'USD' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 146.43, currency: 'USD' },
  { symbol: 'V', name: 'Visa Inc.', price: 245.73, currency: 'USD' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.85, currency: 'USD' },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 154.34, currency: 'USD' },
  { symbol: 'PG', name: 'Procter & Gamble Co.', price: 147.23, currency: 'USD' },
  { symbol: 'MA', name: 'Mastercard Inc.', price: 398.75, currency: 'USD' },
  { symbol: 'HD', name: 'Home Depot Inc.', price: 310.54, currency: 'USD' },
  { symbol: 'DIS', name: 'Walt Disney Co.', price: 90.45, currency: 'USD' },
];

// Add some price variation to make it look more realistic
const getRandomPriceChange = (basePrice: number) => {
  const maxChange = basePrice * 0.02; // 2% max change
  return basePrice + (Math.random() * maxChange * 2 - maxChange);
};

export interface MockStock {
  symbol: string;
  name: string;
  price: number;
  currency: string;
}

export const searchStocks = (query: string): MockStock[] => {
  const searchTerm = query.toLowerCase().trim();
  
  return MOCK_STOCKS
    .filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm) ||
      stock.name.toLowerCase().includes(searchTerm)
    )
    .map(stock => ({
      ...stock,
      price: Number(getRandomPriceChange(stock.price).toFixed(2))
    }))
    .slice(0, 5);
};

export const getStockBySymbol = (symbol: string): MockStock | null => {
  const stock = MOCK_STOCKS.find(s => s.symbol === symbol.toUpperCase());
  if (!stock) return null;
  
  return {
    ...stock,
    price: Number(getRandomPriceChange(stock.price).toFixed(2))
  };
}; 