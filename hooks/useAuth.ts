import { useAccount, useSignMessage } from 'wagmi';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('authToken'));
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

      // Store token
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
