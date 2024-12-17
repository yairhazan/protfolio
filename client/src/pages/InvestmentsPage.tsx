import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Investments } from "@/components/investments";

export default function InvestmentsPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold text-gray-100 mb-6">Investments</h1>
      <Investments />
    </DashboardLayout>
  );
}
