import { Switch, Route } from "wouter";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import InvestmentsPage from "@/pages/InvestmentsPage";
import PensionPage from "@/pages/PensionPage";
import StocksPage from "@/pages/StocksPage";
import SettingsPage from "@/pages/SettingsPage";
import { AuthProvider } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/investments" component={InvestmentsPage} />
        <Route path="/pension" component={PensionPage} />
        <Route path="/stocks" component={StocksPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/" component={DashboardPage} />
        <Route component={NotFound} />
      </Switch>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
      <Card className="w-full max-w-md mx-4 bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-100">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            The page you're looking for doesn't exist.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
