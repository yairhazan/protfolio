import { DashboardLayout } from "@/layouts/DashboardLayout";
import { StockPortfolio } from "@/components/stock-portfolio";

export default function StocksPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold text-gray-100 mb-6">Stocks</h1>
      <StockPortfolio />
    </DashboardLayout>
  );
}
