import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { clearAuth, getAuth, loginRequest, saveAuth } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getAuth());

  const login = useCallback(async (credentials) => {
    const nextAuth = await loginRequest(credentials);
    saveAuth(nextAuth);
    setAuth(nextAuth);
    return nextAuth;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuth(null);
  }, []);

  const value = useMemo(() => {
    const user = auth?.user || null;
    const token = auth?.token || null;
    const isAuthenticated = Boolean(token && user);
    const isAdmin = user?.role === 'admin';

    return {
      auth,
      user,
      token,
      isAuthenticated,
      isAdmin,
      login,
      logout,
      setAuth,
    };
  }, [auth, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
