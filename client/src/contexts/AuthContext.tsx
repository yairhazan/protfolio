import { createContext, useContext, useEffect, useState } from 'react';
import { type User } from '@/lib/firebase';
import { onAuthStateChange } from '@/lib/firebase';
import { useLocation } from 'wouter';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");

    const unsubscribe = onAuthStateChange((user) => {
      console.log("AuthProvider: Auth state changed", {
        user: user ? "Logged in" : "Logged out",
        currentPath: window.location.pathname
      });

      setUser(user);
      setLoading(false);
      
      // Only redirect if not on login page and not authenticated
      if (!user && window.location.pathname !== '/login') {
        console.log("AuthProvider: Redirecting to login");
        setLocation('/login');
      }
      
      // Redirect to dashboard if authenticated and on login page
      if (user && window.location.pathname === '/login') {
        console.log("AuthProvider: Redirecting to dashboard");
        setLocation('/dashboard');
      }
    });

    // Cleanup subscription on unmount
    return () => {
      console.log("AuthProvider: Cleaning up auth state listener");
      unsubscribe();
    };
  }, [setLocation]);

  if (loading) {
    console.log("AuthProvider: Loading auth state");
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
