
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from '../screens/Login/LoginPage';

interface AppNavigatorProps {
  children: React.ReactNode;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
};
