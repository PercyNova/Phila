
import { User, generateRandomUser } from '../utils/randomUser';
import { encryptData } from '../utils/encryption';

// Generate initial mock users with encrypted sensitive data
const generateMockUsers = (): User[] => {
  const users: User[] = [];
  
  // Generate 10 mock users
  for (let i = 0; i < 10; i++) {
    const user = generateRandomUser();
    
    // Encrypt sensitive data
    user.phone = encryptData(user.phone);
    user.email = encryptData(user.email);
    user.dateOfBirth = encryptData(user.dateOfBirth);
    user.emergencyContact = encryptData(user.emergencyContact);
    user.medicalHistory = user.medicalHistory.map(item => encryptData(item));
    user.medications = user.medications.map(item => encryptData(item));
    
    users.push(user);
  }
  
  return users;
};

export const mockUsers: User[] = generateMockUsers();

export const getMockUser = (index?: number): User => {
  const userIndex = index !== undefined ? index % mockUsers.length : Math.floor(Math.random() * mockUsers.length);
  return { ...mockUsers[userIndex] };
};

export const getAllMockUsers = (): User[] => {
  return [...mockUsers];
};
