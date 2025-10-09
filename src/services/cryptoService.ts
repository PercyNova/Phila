// src/services/cryptoService.ts
// Hybrid AES-256 + RSA-4096 encryption system for Phila MVP

import CryptoJS from "crypto-js";

/**
 * Encrypt data using AES-256 with a random IV.
 * @param data string | object to encrypt
 * @param aesKey string (hex-encoded 256-bit key)
 * @returns string in format "iv:ciphertext"
 */
export const encryptAES = (data: string | object, aesKey: string): string => {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  const key = CryptoJS.enc.Hex.parse(aesKey);
  const iv = CryptoJS.lib.WordArray.random(128 / 8); // 16 bytes IV
  const encrypted = CryptoJS.AES.encrypt(payload, key, { iv: iv });
  return iv.toString(CryptoJS.enc.Base64) + ":" + encrypted.toString();
};

/**
 * Decrypt AES ciphertext that includes an IV.
 * @param encryptedData string in format "iv:ciphertext"
 * @param aesKey string (hex-encoded 256-bit key)
 */
export const decryptAES = (encryptedData: string, aesKey: string): string => {
  const parts = encryptedData.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid encrypted data format. Expected 'iv:ciphertext'.");
  }
  const iv = CryptoJS.enc.Base64.parse(parts[0]);
  const ciphertext = parts[1];
  const key = CryptoJS.enc.Hex.parse(aesKey);
  const bytes = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv });
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  if (!decrypted) {
    throw new Error("Decryption failed. The key may be incorrect or the data corrupted.");
  }
  return decrypted;
};


/**
 * Generate a random 256-bit AES key
 */
export const generateAESKey = (): string => {
  const random = CryptoJS.lib.WordArray.random(32);
  return random.toString(CryptoJS.enc.Hex);
};

/**
 * Encrypt (wrap) an AES key with an RSA-4096 public key.
 * This is a browser-safe implementation using Web Crypto API.
 * @param aesKey string (hex-encoded)
 * @param publicKeyPEM string (PEM format)
 */
export async function wrapAESWithPublicKey(aesKey: string, publicKeyPEM: string) {
  const encoder = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    "spki",
    pemToBinary(publicKeyPEM),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    key,
    encoder.encode(aesKey)
  );

  return Buffer.from(encrypted).toString("base64");
}

/**
 * Helper: Convert PEM-formatted key to binary ArrayBuffer
 */
function pemToBinary(pem: string): ArrayBuffer {
  const b64 = pem
    .replace("-----BEGIN PUBLIC KEY-----", "")
    .replace("-----END PUBLIC KEY-----", "")
    .replace(/\n/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
