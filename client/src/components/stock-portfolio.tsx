import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TrendingDown, TrendingUp, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth";
import { getUserData } from "@/lib/userService";
import { AddStockModal } from "./AddStockModal";

interface Stock {
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  purchasePrice: number;
  addedAt: string;
}

// Alpha Vantage API key should be in your environment variables
const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

export function StockPortfolio() {
  const { user } = useAuth();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchStocks = async () => {
      if (!user) return;

      try {
        const userData = await getUserData(user.uid);
        if (!userData?.stocks) {
          setStocks([]);
          return;
        }

        // Fetch current prices for all stocks
        const updatedStocks = await Promise.all(
          userData.stocks.map(async (stock) => {
            try {
              const response = await fetch(
                `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
              );
              const data = await response.json();
              const currentPrice = data['Global Quote']?.['05. price'] 
                ? parseFloat(data['Global Quote']['05. price'])
                : stock.purchasePrice;

              // Get company name
              const searchResponse = await fetch(
                `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stock.symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
              );
              const searchData = await searchResponse.json();
              const name = searchData.bestMatches?.[0]?.['2. name'] || stock.symbol;

              return {
                ...stock,
                currentPrice,
                name,
              };
            } catch (error) {
              console.error(`Error fetching data for ${stock.symbol}:`, error);
              return {
                ...stock,
                currentPrice: stock.purchasePrice,
                name: stock.symbol,
              };
            }
          })
        );

        setStocks(updatedStocks);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [user, refreshTrigger]);

  const handleStockAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const calculateProfit = (stock: Stock) => {
    const totalPurchaseValue = stock.shares * stock.purchasePrice;
    const totalCurrentValue = stock.shares * stock.currentPrice;
    const profitValue = totalCurrentValue - totalPurchaseValue;
    const profitPercentage = (profitValue / totalPurchaseValue) * 100;
    
    return {
      value: profitValue,
      percentage: profitPercentage,
    };
  };

  const totalPortfolioValue = stocks.reduce((total, stock) => 
    total + (stock.shares * stock.currentPrice), 0
  );

  const totalProfitValue = stocks.reduce((total, stock) => 
    total + calculateProfit(stock).value, 0
  );

  const totalProfitPercentage = stocks.length > 0 ? (totalProfitValue / 
    stocks.reduce((total, stock) => total + (stock.shares * stock.purchasePrice), 0)
  ) * 100 : 0;

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700 mt-6">
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700 mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-gray-100">Stock Portfolio</CardTitle>
          <p className="text-sm text-gray-400 mt-1">
            Total Value: ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            {stocks.length > 0 && (
              <>
                <div className={`flex items-center ${totalProfitValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalProfitValue >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  <span className="font-medium">
                    {totalProfitValue >= 0 ? '+' : ''}
                    ${Math.abs(totalProfitValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className={`text-sm ${totalProfitPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalProfitPercentage >= 0 ? '+' : ''}
                  {totalProfitPercentage.toFixed(2)}%
                </p>
              </>
            )}
          </div>
          <AddStockModal onStockAdded={handleStockAdded} />
        </div>
      </CardHeader>
      <CardContent>
        {stocks.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <p>No stocks in your portfolio yet.</p>
            <p className="text-sm">Click the Add Stock button to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Symbol</TableHead>
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Shares</TableHead>
                  <TableHead className="text-gray-300">Current Price</TableHead>
                  <TableHead className="text-gray-300">Purchase Price</TableHead>
                  <TableHead className="text-gray-300">Profit/Loss</TableHead>
                  <TableHead className="text-right text-gray-300">Total Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock) => {
                  const profit = calculateProfit(stock);
                  return (
                    <TableRow key={stock.symbol}>
                      <TableCell className="font-medium text-gray-300">{stock.symbol}</TableCell>
                      <TableCell className="text-gray-300">{stock.name}</TableCell>
                      <TableCell className="text-gray-300">{stock.shares}</TableCell>
                      <TableCell className="text-gray-300">
                        ${stock.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        ${stock.purchasePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <div className={profit.value >= 0 ? 'text-green-500' : 'text-red-500'}>
                          <div className="flex items-center">
                            {profit.value >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            <span>
                              {profit.value >= 0 ? '+' : ''}
                              ${Math.abs(profit.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <span className="text-sm">
                            {profit.percentage >= 0 ? '+' : ''}
                            {profit.percentage.toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-gray-300">
                        ${(stock.shares * stock.currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
