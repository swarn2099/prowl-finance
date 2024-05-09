// Auth.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from 'react-native-auth0';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { authorize, clearSession, getCredentials } = useAuth0();
  const [authState, setAuthState] = useState({
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    user: null,
  });

  const signIn = async () => {
    try {
      const credentials: any = await authorize({
        scope: 'openid profile email offline_access',
      });
      setAuthState({
        accessToken: credentials.accessToken,
        refreshToken: credentials.refreshToken,
        expiresAt: credentials.expiresIn
          ? Date.now() + credentials.expiresIn * 1000
          : null,
        user: credentials.idTokenPayload || null,
      });
    } catch (error) {
      console.error('SignIn Error:', error);
    }
  };

  const signOut = async () => {
    try {
      await clearSession();
      setAuthState({
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        user: null,
      });
    } catch (error) {
      console.error('SignOut Error:', error);
    }
  };

  const refreshToken = async () => {
    if (authState.refreshToken) {
      const newCredentials: any = await getCredentials({
        refreshToken: authState.refreshToken,
        scope: 'openid profile email',
      });
      setAuthState((prevState) => ({
        ...prevState,
        accessToken: newCredentials.accessToken,
        expiresAt: newCredentials.expiresIn
          ? Date.now() + newCredentials.expiresIn * 1000
          : null,
      }));
    }
  };

  useEffect(() => {
    // Refresh the token a minute before it expires
    const timeout = setTimeout(
      () => {
        if (authState.expiresAt && Date.now() > authState.expiresAt - 60000) {
          refreshToken();
        }
      },
      authState.expiresAt - Date.now() - 60000 > 0
        ? authState.expiresAt - Date.now() - 60000
        : 0
    );

    return () => clearTimeout(timeout);
  }, [authState.expiresAt]);

  return (
    <AuthContext.Provider value={{ authState, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
