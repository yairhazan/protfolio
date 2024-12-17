import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StockPortfolio } from "@/components/stock-portfolio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StocksPage() {
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-100 mb-6">Stocks</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-100">Total Stock Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-500">$87,500</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-100">Today's Gain/Loss</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-500">+$1,250 (1.45%)</p>
                </CardContent>
              </Card>
            </div>
            <StockPortfolio />
          </div>
        </main>
      </div>
    </div>
  )
}

