"use client";

import { ParsedToken, signInWithEmailAndPassword, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { auth } from "../firebase/client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { removeToken, setToken } from "./actions";

type AuthContextType = {
  currentUser: User | null;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  customClaims: ParsedToken | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [customClaims, setCustomClaims] = useState<ParsedToken | null>(null);
  const [loading, setLoading] = useState(true);
  const tokenRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simple token refresh function that doesn't call server actions unnecessarily
  const refreshAndSetToken = async (
    user: User,
    forceRefresh: boolean = false
  ) => {
    try {
      const tokenResult = await user.getIdTokenResult(forceRefresh);
      const token = tokenResult.token;
      const refreshToken = user.refreshToken;
      const claims = tokenResult.claims;

      setCustomClaims(claims ?? null);

      // Only update server cookies on initial auth or forced refresh
      if (token && refreshToken && forceRefresh) {
        await setToken({ token, refreshToken });
        console.log("Token refreshed and updated in cookies");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  // Set up less aggressive token refresh - only when needed
  const setupTokenRefresh = (user: User) => {
    // Clear any existing interval
    if (tokenRefreshIntervalRef.current) {
      clearInterval(tokenRefreshIntervalRef.current);
    }

    // Check token every 45 minutes and only refresh if needed
    tokenRefreshIntervalRef.current = setInterval(async () => {
      if (user && !loading) {
        try {
          const tokenResult = await user.getIdTokenResult(false);
          // Only refresh if token expires in the next 10 minutes
          const tenMinutesFromNow = new Date(Date.now() + 10 * 60 * 1000);

          if (
            tokenResult.expirationTime &&
            new Date(tokenResult.expirationTime) <= tenMinutesFromNow
          ) {
            console.log("Token expires soon, performing refresh");
            await refreshAndSetToken(user, true);
          }
        } catch {
          // If token check fails, force refresh
          console.log("Token check failed, performing refresh");
          await refreshAndSetToken(user, true);
        }
      }
    }, 45 * 60 * 1000); // Check every 45 minutes
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user ?? null);

      if (user) {
        // Initial token setup - force refresh to sync with server
        await refreshAndSetToken(user, true);

        // Set up periodic refresh
        setupTokenRefresh(user);
      } else {
        // Clear tokens and refresh interval when user logs out
        await removeToken();
        if (tokenRefreshIntervalRef.current) {
          clearInterval(tokenRefreshIntervalRef.current);
          tokenRefreshIntervalRef.current = null;
        }
      }

      setLoading(false);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      if (tokenRefreshIntervalRef.current) {
        clearInterval(tokenRefreshIntervalRef.current);
      }
    };
  }, []);

  // Only refresh on focus if token is close to expiry
  useEffect(() => {
    const handleFocus = async () => {
      if (currentUser && !loading) {
        try {
          const tokenResult = await currentUser.getIdTokenResult(false);
          const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);

          // Only refresh if token expires within 5 minutes
          if (
            tokenResult.expirationTime &&
            new Date(tokenResult.expirationTime) <= fiveMinutesFromNow
          ) {
            console.log(
              "Page focus detected and token expires soon, refreshing"
            );
            await refreshAndSetToken(currentUser, true);
          }
        } catch {
          // If token check fails, refresh
          console.log("Page focus detected and token check failed, refreshing");
          await refreshAndSetToken(currentUser, true);
        }
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [currentUser, loading]);

  const logout = async () => {
    if (tokenRefreshIntervalRef.current) {
      clearInterval(tokenRefreshIntervalRef.current);
      tokenRefreshIntervalRef.current = null;
    }
    await auth.signOut();
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        logout,
        loginWithGoogle,
        loginWithEmail,
        customClaims,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
