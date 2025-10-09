
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../utils/randomUser';
import { authService, LoginCredentials, AuthResponse, OTPVerificationResponse } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  verifyOTP: (otp: string) => Promise<OTPVerificationResponse>;
  simulateFaceID: () => Promise<OTPVerificationResponse>;
  logout: () => void;
  switchToRandomUser: () => User;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated on app start
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string): Promise<OTPVerificationResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.verifyOTP(otp);
      if (response.success && response.user) {
        setUser(response.user);
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
      if (response.success && response.user) {
        setUser(response.user);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const switchToRandomUser = (): User => {
    const newUser = authService.switchToRandomUser();
    setUser(newUser);
    return newUser;
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    verifyOTP,
    simulateFaceID,
    logout,
    switchToRandomUser,
    updateUser,
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
