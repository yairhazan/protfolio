import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Overview } from "@/components/overview";
import { Investments } from "@/components/investments";
import { Pension } from "@/components/pension";
import { StockPortfolio } from "@/components/stock-portfolio";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold text-gray-100 mb-6">Dashboard</h1>
      <Overview />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Investments />
        <Pension />
      </div>
      <StockPortfolio />
    </DashboardLayout>
  );
}
