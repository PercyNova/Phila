
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../utils/randomUser';
import { authService, LoginCredentials, AuthResponse, OTPVerificationResponse } from '../services/authService';
import { encryptAES, decryptAES } from '../services/cryptoService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  aesKey: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  verifyOTP: (otp: string) => Promise<OTPVerificationResponse>;
  simulateFaceID: () => Promise<OTPVerificationResponse>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  encryptData: (data: string | object) => string;
  decryptData: (ciphertext: string) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aesKey, setAesKey] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // In a real app, the AES key would be securely stored and retrieved.
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      return await authService.login(credentials);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string): Promise<OTPVerificationResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.verifyOTP(otp);
      if (response.success && response.user && response.aesKey) {
        setUser(response.user);
        setAesKey(response.aesKey);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const simulateFaceID = async (): Promise<OTPVerificationResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.simulateFaceID();
      if (response.success && response.user && response.aesKey) {
        setUser(response.user);
        setAesKey(response.aesKey);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setAesKey(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const encryptData = (data: string | object): string => {
    if (!aesKey) throw new Error("AES key not available. User may not be logged in.");
    return encryptAES(data, aesKey);
  };

  const decryptData = (ciphertext: string): string => {
    if (!aesKey) throw new Error("AES key not available. User may not be logged in.");
    try {
      return decryptAES(ciphertext, aesKey);
    } catch (error) {
      console.error("Decryption failed:", error);
      return ciphertext; // Return original text if decryption fails
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    aesKey,
    login,
    verifyOTP,
    simulateFaceID,
    logout,
    updateUser,
    encryptData,
    decryptData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
