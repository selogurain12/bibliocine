import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localStorageBasePrefixVariable } from "../utils/local-storage-base-prefix-variable";

type AuthContextType = {
  token: string | null;
  setToken: (token: string) => Promise<void>;
  clearToken: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(localStorageBasePrefixVariable("idToken"));
        if (storedToken) {
          setTokenState(storedToken);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du token :", error);
      } finally {
        setLoading(false);
      }
    };
    loadToken();
  }, []);

  const setToken = async (newToken: string) => {
    try {
      await AsyncStorage.setItem(localStorageBasePrefixVariable("idToken"), newToken);
      setTokenState(newToken);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du token :", error);
    }
  };

  const clearToken = async () => {
    try {
      await AsyncStorage.removeItem(localStorageBasePrefixVariable("idToken"));
      setTokenState(null);
    } catch (error) {
      console.error("Erreur lors de la suppression du token :", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken, clearToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};