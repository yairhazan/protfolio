import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // API routes for portfolio data
  app.get('/api/portfolio', (req, res) => {
    res.json({
      total_balance: 45231.89,
      investments: 21324.50,
      pension: 12456.00,
      stocks: 11451.39
    });
  });

  // Stock data endpoint
  app.get('/api/stocks', (req, res) => {
    res.json({
      stocks: [
        { symbol: "AAPL", name: "Apple Inc.", shares: 10, price: 150.25, change: 2.5 },
        { symbol: "GOOGL", name: "Alphabet Inc.", shares: 5, price: 2750.80, change: -1.2 },
        { symbol: "MSFT", name: "Microsoft Corporation", shares: 15, price: 305.50, change: 0.8 },
        { symbol: "AMZN", name: "Amazon.com, Inc.", shares: 8, price: 3380.00, change: 1.5 },
        { symbol: "TSLA", name: "Tesla, Inc.", shares: 20, price: 725.60, change: -0.5 }
      ]
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
