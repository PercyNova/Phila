
import { User, getRandomUser } from '../utils/randomUser';
import { getMockUser } from './mockUsers';

export interface LoginCredentials {
  idPassport: string;
  surname: string;
  phoneNumber: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  requiresOTP?: boolean;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  user?: User;
}

class AuthService {
  private currentUser: User | null = null;
  private pendingCredentials: LoginCredentials | null = null;
  private readonly VALID_OTP = '1234'; // Simulated OTP

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('Attempting login with credentials:', credentials);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Basic validation
    if (!credentials.idPassport || !credentials.surname || !credentials.phoneNumber) {
      return {
        success: false,
        message: 'All fields are required',
      };
    }
    
    // Store credentials for OTP verification
    this.pendingCredentials = credentials;
    
    return {
      success: true,
      message: 'OTP sent to your phone number',
      requiresOTP: true,
    };
  }

  async verifyOTP(otp: string): Promise<OTPVerificationResponse> {
    console.log('Verifying OTP:', otp);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!this.pendingCredentials) {
      return {
        success: false,
        message: 'No pending login found. Please try logging in again.',
      };
    }
    
    if (otp !== this.VALID_OTP) {
      return {
        success: false,
        message: 'Invalid OTP. Please try again.',
      };
    }
    
    // Assign a random mock user upon successful verification
    const user = getMockUser();
    this.currentUser = user;
    this.pendingCredentials = null;
    
    console.log('Login successful, assigned user:', user.firstName, user.lastName);
    
    return {
      success: true,
      message: 'Login successful',
      user,
    };
  }

  async simulateFaceID(): Promise<OTPVerificationResponse> {
    console.log('Simulating FaceID authentication');
    
    // Simulate FaceID delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate 90% success rate
    const success = Math.random() > 0.1;
    
    if (!success) {
      return {
        success: false,
        message: 'FaceID authentication failed. Please try again.',
      };
    }
    
    // Assign a random mock user upon successful FaceID
    const user = getMockUser();
    this.currentUser = user;
    
    console.log('FaceID successful, assigned user:', user.firstName, user.lastName);
    
    return {
      success: true,
      message: 'FaceID authentication successful',
      user,
    };
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  logout(): void {
    console.log('User logged out');
    this.currentUser = null;
    this.pendingCredentials = null;
  }

  switchToRandomUser(): User {
    console.log('Switching to random user for demo');
    const user = getMockUser();
    this.currentUser = user;
    return user;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const authService = new AuthService();
