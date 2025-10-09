
import { generateRandomUser, User } from '../utils/randomUser';
import { generateAESKey, encryptAES, wrapAESWithPublicKey } from './cryptoService';

// This should be loaded from environment variables, e.g., process.env.EXPO_PUBLIC_RSA_PUBLIC_KEY
const RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA...
-----END PUBLIC KEY-----`;

export interface EncryptedUser extends Omit<User, 'phone' | 'email' | 'dateOfBirth' | 'emergencyContact' | 'medicalHistory' | 'medications'> {
  phone: string;
  email: string;
  dateOfBirth: string;
  emergencyContact: string;
  medicalHistory: string[];
  medications: string[];
  wrappedAesKey: string;
}

// This is a hack for the mock implementation to simulate the backend unwrapping the key.
// In a real application, these raw keys would not be stored on the client.
export const mockUsersAesKeys: string[] = [];

/**
 * Takes a raw user object, generates a new AES key, encrypts sensitive fields,
 * and wraps the AES key with the public RSA key.
 * @param rawUser The raw user data
 * @param aesKey The AES key to use for encryption.
 * @returns An object containing the user with encrypted data and the wrapped AES key.
 */
export const generateMockUserWithEncryptedData = async (rawUser: User, aesKey: string): Promise<EncryptedUser> => {
  const encryptedUser: any = { ...rawUser };

  // Encrypt sensitive fields
  encryptedUser.phone = encryptAES(rawUser.phone, aesKey);
  encryptedUser.email = encryptAES(rawUser.email, aesKey);
  encryptedUser.dateOfBirth = encryptAES(rawUser.dateOfBirth, aesKey);
  encryptedUser.emergencyContact = encryptAES(rawUser.emergencyContact, aesKey);
  encryptedUser.medicalHistory = rawUser.medicalHistory.map(item => encryptAES(item, aesKey));
  encryptedUser.medications = rawUser.medications.map(item => encryptAES(item, aesKey));

  // Wrap the AES key with the RSA public key
  const wrappedAesKey = await wrapAESWithPublicKey(aesKey, RSA_PUBLIC_KEY);
  encryptedUser.wrappedAesKey = wrappedAesKey;

  return encryptedUser;
};

// Generate a list of mock users
const generateAllMockUsers = async (): Promise<EncryptedUser[]> => {
  const users: EncryptedUser[] = [];
  for (let i = 0; i < 10; i++) {
    const rawUser = generateRandomUser();
    const aesKey = generateAESKey();
    mockUsersAesKeys.push(aesKey);
    const encryptedUser = await generateMockUserWithEncryptedData(rawUser, aesKey);
    users.push(encryptedUser);
  }
  return users;
};

// We need to handle the async generation. For now, we can export a promise.
export const mockUsersPromise = generateAllMockUsers();

export const getMockUser = async (index?: number): Promise<EncryptedUser> => {
  const users = await mockUsersPromise;
  const userIndex = index !== undefined ? index % users.length : Math.floor(Math.random() * users.length);
  return { ...users[userIndex] };
};

export const getAllMockUsers = async (): Promise<EncryptedUser[]> => {
  const users = await mockUsersPromise;
  return [...users];
};
