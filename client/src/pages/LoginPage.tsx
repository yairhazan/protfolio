import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithGoogle } from "@/lib/firebase";
import { useLocation } from "wouter";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log("LoginPage: Starting Google sign in");
      await signInWithGoogle();
      console.log("LoginPage: Sign in successful");
      setLocation('/dashboard');
    } catch (error) {
      console.error("LoginPage: Failed to sign in:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to sign in with Google. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Card className="w-full max-w-md mx-4 bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-100">
            Welcome to Pro-tfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button 
            variant="outline" 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="bg-white text-gray-900 hover:bg-gray-100 relative"
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
