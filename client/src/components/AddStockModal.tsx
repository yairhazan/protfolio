import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { addStock } from "@/lib/userService";
import { useToast } from "@/hooks/use-toast";
import { debounce } from "@/lib/utils";
import { searchStocks, getStockBySymbol, type MockStock } from "@/lib/mockStockData";

interface StockSearchResult {
  symbol: string;
  name: string;
  price: number;
  currency: string;
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
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setSelectedStock(null);
    setShares("");
    setPurchasePrice("");
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    setError(null);
    try {
      // First, try exact symbol match
      const exactSymbol = searchQuery.toUpperCase().trim();
      const exactMatch = getStockBySymbol(exactSymbol);

      if (exactMatch) {
        setSearchResults([exactMatch]);
        setError(null);
        setSearching(false);
        return;
      }

      // If no exact match, search for stocks
      const results = searchStocks(searchQuery);

      if (!results.length) {
        setError("No stocks found. Try a different search term.");
        setSearchResults([]);
      } else {
        setSearchResults(results);
        setError(null);
      }
    } catch (error) {
      console.error('Error searching stocks:', error);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) return;
      await handleSearch();
    }, 300),
    []
  );

  // Update search when query changes
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, debouncedSearch]);

  const handleStockSelect = (stock: StockSearchResult) => {
    setSelectedStock(stock);
    setPurchasePrice(stock.price.toString());
    setSearchResults([]);
    setSearchQuery("");
    setError(null);
  };

  const handleAddStock = async () => {
    if (!selectedStock || !shares || !purchasePrice || !user) return;

    setAdding(true);
    try {
      await addStock(user.uid, {
        symbol: selectedStock.symbol,
        shares: parseInt(shares),
        purchasePrice: parseFloat(purchasePrice),
      });

      toast({
        title: "Stock Added",
        description: `Successfully added ${shares} shares of ${selectedStock.symbol}`,
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
        description: "Failed to add stock. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim().length >= 2 && !searching) {
      handleSearch();
    }
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
      <DialogContent 
        className="bg-gray-800 text-gray-100"
        aria-describedby="add-stock-description"
      >
        <DialogHeader>
          <DialogTitle>Add Stock to Portfolio</DialogTitle>
          <DialogDescription id="add-stock-description" className="text-gray-400">
            Search for a stock by symbol or company name and add it to your portfolio.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!selectedStock ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter stock symbol (e.g., AAPL) or company name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                  autoFocus
                />
                <Button 
                  onClick={() => handleSearch()}
                  disabled={searching || searchQuery.trim().length < 2}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {searching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {error && (
                <div className="text-red-400 text-sm">
                  {error}
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="border border-gray-700 rounded-lg divide-y divide-gray-700 max-h-60 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.symbol}
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
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">{selectedStock.symbol}</div>
                  <div className="text-sm text-gray-400">{selectedStock.name}</div>
                </div>
                <Button
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
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                  placeholder="Enter number of shares"
                  min="0"
                  step="1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Purchase Price per Share</label>
                <Input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                  placeholder="Enter purchase price"
                  min="0"
                  step="0.01"
                />
              </div>
              <Button
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={handleAddStock}
                disabled={adding || !shares || !purchasePrice}
              >
                {adding ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add to Portfolio
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 