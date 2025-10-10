import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';

// ----------------- Fallback Encryption -----------------
const fallbackEncrypt = (data: any): string => btoa(JSON.stringify(data));
const fallbackDecrypt = (encrypted: string): any => {
  try { return JSON.parse(atob(encrypted)); } 
  catch { return encrypted; }
};

// Try to import cryptoService
let encryptDataWithAES: any;
let decryptDataWithAES: any;
try {
  const cryptoService = require('../services/cryptoService');
  encryptDataWithAES = cryptoService.encryptDataWithAES || fallbackEncrypt;
  decryptDataWithAES = cryptoService.decryptDataWithAES || fallbackDecrypt;
} catch {
  console.warn('CryptoService not available, using fallback encryption');
  encryptDataWithAES = fallbackEncrypt;
  decryptDataWithAES = fallbackDecrypt;
}

// ----------------- Types -----------------
interface User {
  // Base fields from backend (snake_case)
  id: string;
  surname: string;
  first_name: string;
  date_of_birth?: string;
  phone: string;
  email?: string;
  address?: string;
  weight?: string;
  height?: string;
  blood_type?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_email?: string;

  // Optional camelCase fields for UI compatibility
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  bloodType?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactEmail?: string;
  phoneNumber?: string;

  // Old fields
  encryptedData?: string;
  iv?: string;
  wrappedAesKey?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { idPassport: string; surname: string; phoneNumber: string }) => Promise<any>;
  verifyOTP: (otp: string) => Promise<any>;
  simulateFaceID: () => Promise<any>;
  encryptData: (data: any) => any;
  decryptData: (encrypted: string, iv?: string) => any;
}

// ----------------- Context -----------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionAESKey, setSessionAESKey] = useState<string | null>(null);
  const [pendingCredentials, setPendingCredentials] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = !!user;

  // ----------------- LOGIN -----------------
  const login = async (credentials: { idPassport: string; surname: string; phoneNumber: string }) => {
    console.log('Login called with:', credentials);
    setIsLoading(true);
    
    try {
      // Store credentials for OTP verification
      setPendingCredentials(credentials);
      
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!res.ok) {
        // If user not found or other error, fallback to demo mode
        console.log('Backend login failed or user not found, using demo mode');
        setIsLoading(false);
        return { 
          success: true, 
          requiresOTP: true,
          message: 'Demo mode: Use OTP 1234'
        };
      }
      
      const data = await res.json();
      console.log('Login response:', data);
      setIsLoading(false);
      
      // Backend will send a message like 'OTP sent to your device.'
      // For the demo, the backend sends OTP '1234'
      return { 
        success: true, 
        requiresOTP: true,
        message: data.message || 'An OTP has been sent.'
      };
      
    } catch (err) {
      console.error('Login error:', err);
      setIsLoading(false);
      
      // Fallback to demo mode if backend is unavailable
      console.log('Backend unavailable, using demo mode');
      setPendingCredentials(credentials); // Keep credentials for demo OTP
      
      return { 
        success: true, 
        requiresOTP: true,
        message: 'Demo mode: Use OTP 1234'
      };
    }
  };

  // ----------------- VERIFY OTP -----------------
  const verifyOTP = async (otp: string) => {
    console.log('Verify OTP called with:', otp);
    setIsLoading(true);
    
    try {
      // Demo mode: if backend failed, OTP will be '1234'
      if (otp === '1234') {
        console.log('Demo OTP accepted, loading demo user...');
        const demoUser: User = {
            id: 'demo-123',
            surname: 'Demo',
            first_name: 'User',
            date_of_birth: '1990-01-01',
            phone: '+1234567890',
            email: 'demo@example.com',
            address: '123 Demo Street, Demo City',
            weight: '70',
            height: '175',
            blood_type: 'O+',
            allergies: 'None',
            emergency_contact_name: 'John Doe',
            emergency_contact_phone: '+0987654321',
            emergency_contact_email: 'john.doe@example.com',
        };
        setUser(demoUser);
        setPendingCredentials(null);
        setIsLoading(false);
        return { success: true };
      }
      
      // Real user branch: Try backend verification
      const res = await fetch('http://localhost:3001/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          otp, 
          idPassport: pendingCredentials?.idPassport 
        }),
      });
      
      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`OTP verification failed: ${res.statusText} - ${errorBody}`);
      }
      
      const data = await res.json();
      
      if (data.success && data.user) {
        const backendUser = data.user;

        // Transform snake_case from backend to camelCase for frontend UI
        const frontendUser = {
          ...backendUser,
          firstName: backendUser.first_name,
          lastName: backendUser.surname,
          dateOfBirth: backendUser.date_of_birth,
          bloodType: backendUser.blood_type,
          emergencyContactName: backendUser.emergency_contact_name,
          emergencyContactPhone: backendUser.emergency_contact_phone,
          emergencyContactEmail: backendUser.emergency_contact_email,
          phoneNumber: backendUser.phone,
          email: backendUser.email_address // Map email_address to email
        };

        setUser(frontendUser);
        // ✅ Save to sessionStorage for FaceID across reloads
        sessionStorage.setItem('lastRealUser', JSON.stringify(frontendUser));
        setPendingCredentials(null);
        console.log('Real user loaded and transformed successfully:', frontendUser);
      } else {
        throw new Error(data.message || 'Failed to get user data from backend.');
      }
      
      setIsLoading(false);
      return { success: true };
      
    } catch (err) {
      console.error('OTP verification error:', err);
      setIsLoading(false);
      // Provide a helpful message for the demo case
      return { 
        success: false, 
        message: (err as Error).message.includes('401') 
          ? 'Invalid OTP. Try 1234 for demo.'
          : (err as Error).message
      };
    }
  };

  // ----------------- SIMULATE FaceID -----------------
  const simulateFaceID = async () => {
    console.log('FaceID simulation started');
    setIsLoading(true);

    try {
      const stored = sessionStorage.getItem('lastRealUser');
      if (!stored) {
        setIsLoading(false);
        return { success: false, message: 'FaceID only available for real users' };
      }

      const lastUser: User = JSON.parse(stored);
      setUser(lastUser);

      if (!sessionAESKey) {
        const tempKey = window.crypto.getRandomValues(new Uint8Array(32));
        const base64Key = btoa(String.fromCharCode(...tempKey));
        setSessionAESKey(base64Key);
      }

      setIsLoading(false);
      console.log('FaceID successful, last real user loaded:', lastUser);
      return { success: true };

    } catch (err) {
      console.error('FaceID error:', err);
      setIsLoading(false);
      return { success: false, message: 'Failed to load last real user' };
    }
  };

  // ----------------- ENCRYPT/DECRYPT -----------------
  const encryptData = (data: any) => {
    if (!sessionAESKey) return fallbackEncrypt(data);
    try { return encryptDataWithAES(data, sessionAESKey); }
    catch { return fallbackEncrypt(data); }
  };

  const decryptData = (encrypted: string, iv?: string) => {
    if (!encrypted) return encrypted;
    if (!sessionAESKey) return fallbackDecrypt(encrypted);
    try {
      if (iv) return decryptDataWithAES(encrypted, iv, sessionAESKey);
      return fallbackDecrypt(encrypted);
    } catch { return fallbackDecrypt(encrypted); }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      verifyOTP,
      simulateFaceID,
      encryptData,
      decryptData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ----------------- Hook -----------------
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
