// AuthContext.js
//@ts-nocheck
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from 'react-native-auth0';

const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const AuthProvider = ({ children }) => {
  const { getCredentials } = useAuth0();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const credentials = await getCredentials();
        setIsAuthenticated(!!credentials);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
