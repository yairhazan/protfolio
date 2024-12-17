import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const stocks = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 10, price: 150.25, change: 2.5 },
  { symbol: "GOOGL", name: "Alphabet Inc.", shares: 5, price: 2750.80, change: -1.2 },
  { symbol: "MSFT", name: "Microsoft Corporation", shares: 15, price: 305.50, change: 0.8 },
  { symbol: "AMZN", name: "Amazon.com, Inc.", shares: 8, price: 3380.00, change: 1.5 },
  { symbol: "TSLA", name: "Tesla, Inc.", shares: 20, price: 725.60, change: -0.5 },
]

export function StockPortfolio() {
  return (
    <Card className="bg-gray-800 border-gray-700 mt-6">
      <CardHeader>
        <CardTitle className="text-gray-100">Stock Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Symbol</TableHead>
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Shares</TableHead>
              <TableHead className="text-gray-300">Price</TableHead>
              <TableHead className="text-gray-300">Change</TableHead>
              <TableHead className="text-right text-gray-300">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell className="font-medium text-gray-300">{stock.symbol}</TableCell>
                <TableCell className="text-gray-300">{stock.name}</TableCell>
                <TableCell className="text-gray-300">{stock.shares}</TableCell>
                <TableCell className="text-gray-300">${stock.price.toFixed(2)}</TableCell>
                <TableCell className={stock.change >= 0 ? "text-green-500" : "text-red-500"}>
                  {stock.change > 0 ? "+" : ""}{stock.change}%
                </TableCell>
                <TableCell className="text-right text-gray-300">
                  ${(stock.shares * stock.price).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
