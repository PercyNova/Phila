
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'health-app-secret-key-2024'; // In production, this should be from secure storage

export const encryptData = (data: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    console.log('Data encrypted successfully');
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return data; // Return original data if encryption fails
  }
};

export const decryptData = (encryptedData: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    console.log('Data decrypted successfully');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedData; // Return encrypted data if decryption fails
  }
};

export const encryptObject = (obj: any): any => {
  try {
    const jsonString = JSON.stringify(obj);
    return encryptData(jsonString);
  } catch (error) {
    console.error('Object encryption error:', error);
    return obj;
  }
};

export const decryptObject = (encryptedData: string): any => {
  try {
    const decrypted = decryptData(encryptedData);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Object decryption error:', error);
    return null;
  }
};
