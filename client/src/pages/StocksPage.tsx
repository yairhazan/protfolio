import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StockPortfolio } from "@/components/stock-portfolio"
import { PortfolioPerformanceGraph } from "@/components/portfolio-performance-graph"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function StocksPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-900">
        {/* Mobile sidebar */}
        <div className={`
          fixed inset-0 z-50 lg:hidden
          ${mobileSidebarOpen ? 'block' : 'hidden'}
        `}>
          <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" 
            onClick={() => setMobileSidebarOpen(false)} 
          />
          <div className="fixed inset-y-0 left-0">
            <Sidebar />
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-400 hover:text-green-500 bg-gray-900 hover:bg-gray-950"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </Header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 py-8">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-100">Stocks</h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-100 text-lg sm:text-xl">Total Stock Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-green-500">$87,500</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-100 text-lg sm:text-xl">Today's Gain/Loss</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl sm:text-3xl font-bold text-green-500">+$1,250 (1.45%)</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <div className="overflow-hidden">
                  <PortfolioPerformanceGraph />
                </div>
                <div className="overflow-x-auto">
                  <StockPortfolio />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
