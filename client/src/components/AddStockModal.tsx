import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { addStock } from "@/lib/userService";
import { useToast } from "@/components/ui/use-toast";

// Alpha Vantage API key should be in your environment variables
const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

interface StockSearchResult {
  symbol: string;
  name: string;
  price: number;
}

interface AddStockModalProps {
  onStockAdded?: () => void;
}

export function AddStockModal({ onStockAdded }: AddStockModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(null);
  const [shares, setShares] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [adding, setAdding] = useState(false);

  const resetForm = () => {
    setSelectedStock(null);
    setShares("");
    setPurchasePrice("");
    setSearchQuery("");
    setSearchResults([]);
  };

  const searchStocks = async () => {
    if (!searchQuery) return;
    
    setSearching(true);
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchQuery}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();
      
      if (data.bestMatches) {
        // Get current price for each match
        const results = await Promise.all(
          data.bestMatches.slice(0, 5).map(async (match: any) => {
            const priceResponse = await fetch(
              `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${match['1. symbol']}&apikey=${ALPHA_VANTAGE_API_KEY}`
            );
            const priceData = await priceResponse.json();
            const price = priceData['Global Quote']?.['05. price'] 
              ? parseFloat(priceData['Global Quote']['05. price'])
              : 0;

            return {
              symbol: match['1. symbol'],
              name: match['2. name'],
              price,
            };
          })
        );
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Error searching stocks:', error);
      toast({
        title: "Error",
        description: "Failed to search for stocks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleStockSelect = (stock: StockSearchResult) => {
    setSelectedStock(stock);
    setPurchasePrice(stock.price.toString());
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleAddStock = async () => {
    if (!selectedStock || !shares || !purchasePrice || !user) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const sharesNum = parseInt(shares);
    const priceNum = parseFloat(purchasePrice);

    if (isNaN(sharesNum) || sharesNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid number of shares",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid purchase price",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);
    try {
      await addStock(user.uid, {
        symbol: selectedStock.symbol,
        shares: sharesNum,
        purchasePrice: priceNum,
      });

      toast({
        title: "Success",
        description: `Added ${sharesNum} shares of ${selectedStock.symbol} to your portfolio`,
      });

      // Reset form and close modal
      resetForm();
      setOpen(false);
      
      // Notify parent component
      onStockAdded?.();
    } catch (error) {
      console.error('Error adding stock:', error);
      toast({
        title: "Error",
        description: "Failed to add stock to portfolio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      if (!selectedStock) {
        searchStocks();
      } else {
        handleAddStock();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAddStock();
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          resetForm();
        }
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 text-gray-100">
        <DialogHeader>
          <DialogTitle>Add Stock to Portfolio</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!selectedStock ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for a stock..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
                <Button 
                  type="button"
                  onClick={searchStocks}
                  disabled={searching || !searchQuery}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {searching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {searchResults.length > 0 && (
                <div className="border border-gray-700 rounded-lg divide-y divide-gray-700">
                  {searchResults.map((result) => (
                    <button
                      key={result.symbol}
                      type="button"
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex justify-between items-center"
                      onClick={() => handleStockSelect(result)}
                    >
                      <div>
                        <div className="font-medium">{result.symbol}</div>
                        <div className="text-sm text-gray-400">{result.name}</div>
                      </div>
                      <div className="text-green-500">
                        ${result.price.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">{selectedStock.symbol}</div>
                  <div className="text-sm text-gray-400">{selectedStock.name}</div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-400 hover:text-gray-100"
                  onClick={() => setSelectedStock(null)}
                >
                  Change
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Number of Shares</label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddStock();
                    }
                  }}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                  placeholder="Enter number of shares"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Purchase Price per Share</label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddStock();
                    }
                  }}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                  placeholder="Enter purchase price"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600"
                disabled={adding || !shares || !purchasePrice}
              >
                {adding ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add to Portfolio
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 