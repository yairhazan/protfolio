import { createContext, useContext, useEffect, useState } from 'react';
import { type User } from '@/lib/firebase';
import { onAuthStateChange } from '@/lib/firebase';
import { useLocation } from 'wouter';
import { createUserDocument, getUserData } from '@/lib/userService';
import type { UserData } from '@/lib/userService';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");

    const unsubscribe = onAuthStateChange(async (user) => {
      console.log("AuthProvider: Auth state changed", {
        user: user ? "Logged in" : "Logged out",
        currentPath: window.location.pathname
      });

      setUser(user);

      if (user) {
        try {
          // Get or create user document
          let userDoc = await getUserData(user.uid);
          
          if (!userDoc) {
            // Create new user document if it doesn't exist
            await createUserDocument({
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              photoURL: user.photoURL || undefined,
            });
            userDoc = await getUserData(user.uid);
          }
          
          setUserData(userDoc);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
      
      // Define public routes that don't require authentication
      const publicRoutes = ['/', '/login', '/register'];
      const currentPath = window.location.pathname;
      
      // Only redirect if not on a public page and not authenticated
      if (!user && !publicRoutes.includes(currentPath)) {
        console.log("AuthProvider: Redirecting to login");
        setLocation('/login');
      }
      
      // Redirect to dashboard if authenticated and on login/register page
      if (user && ['/login', '/register'].includes(currentPath)) {
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

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
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
