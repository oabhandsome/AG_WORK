"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Simple route protection logic
      const isAuthRoute = pathname === '/login' || pathname === '/register' || pathname === '/';
      const isDashboard = pathname?.startsWith('/dashboard');

      if (currentUser && isAuthRoute) {
        // If logged in and on an auth page, go to dashboard
        router.push('/dashboard');
      } else if (!currentUser && isDashboard) {
        // If not logged in and trying to access dashboard, go to login
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-pastel-pink/10">
          <div className="animate-pulse text-2xl font-bold text-text-dark">Loading... 💖</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
