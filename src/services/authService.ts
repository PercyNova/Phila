import { mockUsersPromise, mockUsersAesKeys, EncryptedUser } from './mockUsers';
import { User } from '../utils/randomUser';

export interface LoginCredentials {
  idPassport: string;
  surname: string;
  phoneNumber: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  requiresOTP?: boolean;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  user?: User;
  aesKey?: string;
}

class AuthService {
  private currentUser: User | null = null;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // This is a mock login. In a real app, you would send the encrypted
    // credentials to the backend for verification.
    console.log('Login attempt with:', credentials);
    return { success: true, requiresOTP: true, message: 'OTP sent to your phone.' };
  }

  async verifyOTP(otp: string): Promise<OTPVerificationResponse> {
    if (otp !== '1234') {
      return { success: false, message: 'Invalid OTP' };
    }

    const users = await mockUsersPromise;
    const user = users[0]; // Just log in the first user for this mock implementation
    const aesKey = mockUsersAesKeys[0];

    this.currentUser = user as any; // Type casting for simplicity

    return { success: true, message: 'Login successful', user: user as any, aesKey };
  }

  async simulateFaceID(): Promise<OTPVerificationResponse> {
    const users = await mockUsersPromise;
    const user = users[1]; // Just log in the second user for this mock implementation
    const aesKey = mockUsersAesKeys[1];

    this.currentUser = user as any;

    return { success: true, message: 'Login successful', user: user as any, aesKey };
  }

  logout(): void {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  switchToRandomUser(): User {
    // This function is not implemented in the new flow
    throw new Error('switchToRandomUser is not supported in this implementation.');
  }
}

export const authService = new AuthService();