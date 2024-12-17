import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signInWithGoogle } from "@/lib/firebase";
import { useLocation } from "wouter";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      console.log("RegisterPage: Starting Google sign up");
      await signInWithGoogle();
      console.log("RegisterPage: Sign up successful");
      setLocation('/dashboard');
    } catch (error) {
      console.error("RegisterPage: Failed to sign up:", error);
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: "Failed to sign up with Google. Please try again."
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
            Create your Pro-tfolio Account
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Start managing your portfolio today
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button 
            variant="outline" 
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="bg-white text-gray-900 hover:bg-gray-100 relative"
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            {loading ? "Creating account..." : "Sign up with Google"}
          </Button>
          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-green-500 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 