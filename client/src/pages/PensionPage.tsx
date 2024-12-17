import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Pension } from "@/components/pension";

export default function PensionPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold text-gray-100 mb-6">Pension</h1>
      <Pension />
    </DashboardLayout>
  );
}
