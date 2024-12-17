import { createContext, useContext, useEffect, useState } from 'react';
import { type User } from '@/lib/firebase';
import { onAuthStateChange } from '@/lib/firebase';
import { useLocation } from 'wouter';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      
      // Redirect to login if not authenticated
      if (!user && window.location.pathname !== '/login') {
        setLocation('/login');
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, [setLocation]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
