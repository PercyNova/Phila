// src/utils/encryption.ts
import * as Crypto from 'expo-crypto';

// Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return globalThis.btoa(binary);
}

// Convert Base64 back to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = globalThis.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate a random 256-bit AES key
export async function generateAESKey(): Promise<string> {
  const key = await Crypto.getRandomBytesAsync(32);
  return arrayBufferToBase64(key.buffer);
}

// Encrypt data using AES-GCM
export async function encryptData(
  data: any,
  base64Key: string
): Promise<{ encryptedData: string; iv: string }> {
  const text = typeof data === 'string' ? data : JSON.stringify(data);

  const iv = await Crypto.getRandomBytesAsync(12); // 96-bit IV
  const keyBuffer = base64ToArrayBuffer(base64Key);
  const algo = { name: 'AES-GCM', iv };

  // @ts-ignore — Expo crypto polyfill supports SubtleCrypto
  const key = await crypto.subtle.importKey('raw', keyBuffer, algo, false, ['encrypt']);
  const encoded = new TextEncoder().encode(text);
  const encrypted = await crypto.subtle.encrypt(algo, key, encoded);

  return {
    encryptedData: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv.buffer),
  };
}

// Decrypt AES-GCM data
export async function decryptData(
  encryptedData: string,
  ivBase64: string,
  base64Key: string
): Promise<any> {
  const encryptedBuffer = base64ToArrayBuffer(encryptedData);
  const iv = base64ToArrayBuffer(ivBase64);
  const keyBuffer = base64ToArrayBuffer(base64Key);
  const algo = { name: 'AES-GCM', iv };

  // @ts-ignore
  const key = await crypto.subtle.importKey('raw', keyBuffer, algo, false, ['decrypt']);
  const decrypted = await crypto.subtle.decrypt(algo, key, encryptedBuffer);
  const decoded = new TextDecoder().decode(decrypted);

  try {
    return JSON.parse(decoded);
  } catch {
    return decoded; // plain string
  }
}
