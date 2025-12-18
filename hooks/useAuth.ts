import { useAccount, useSignMessage } from 'wagmi';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Setup axios interceptor to automatically add auth token to all requests
axios.interceptors.request.use(
  (config) => {
    // Get token from cookie
    const cookieToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('authToken='))
      ?.split('=')[1];
    
    if (cookieToken && config.headers) {
      config.headers.Authorization = `Bearer ${cookieToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function useAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for cookie first
      const cookieToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];
      
      if (cookieToken) {
        setToken(cookieToken);
      } else {
        // Fallback to localStorage if needed, or just clear
        const localToken = localStorage.getItem('authToken');
        if (localToken) {
           setToken(localToken);
           // Migrate to cookie
           const date = new Date();
           date.setTime(date.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
           document.cookie = `authToken=${localToken}; expires=${date.toUTCString()}; path=/`;
        }
      }
    }
  }, []);

  const login = async () => {
    if (!address) throw new Error('No wallet connected');

    setIsLoading(true);
    try {
      // Step 1: Get challenge
      const { data } = await axios.post(`${API_URL}/auth/challenge`, {
        address,
      });

      // Step 2: Sign message with MetaMask
      const signature = await signMessageAsync({
        message: data.message,
      });

      // Step 3: Verify signature and get JWT
      const { data: authData } = await axios.post(`${API_URL}/auth/verify`, {
        address,
        message: data.message,
        signature,
      });

      // Store token in cookie (24 hours)
      const date = new Date();
      date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
      document.cookie = `authToken=${authData.token}; expires=${date.toUTCString()}; path=/`;
      
      // Also keep in localStorage for backup/compatibility
      localStorage.setItem('authToken', authData.token);
      
      setToken(authData.token);

      return authData;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('authToken');
    setToken(null);
  };

  return {
    address,
    isConnected,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!token,
  };
}
