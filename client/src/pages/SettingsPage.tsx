import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signOutUser } from "@/lib/firebase";
import { useLocation } from "wouter";

export default function SettingsPage() {
  const [, setLocation] = useLocation();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setLocation('/login');
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold text-gray-100 mb-6">Settings</h1>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleSignOut}
            className="w-full sm:w-auto"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
