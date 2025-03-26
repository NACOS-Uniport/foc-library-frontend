import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("authToken");
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await axios.get(`${API_BASE_URL}/materials`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAuthenticated(true);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          setToken(null);
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
        }
      }
    };

    validateToken();
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
