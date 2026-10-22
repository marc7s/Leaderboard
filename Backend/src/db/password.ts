import { createHash, timingSafeEqual } from 'crypto';

/**
 * Hashes a password the same way SQL Server's HASHBYTES('SHA2_512', ...) did for nvarchar
 * values (SHA-512 of the UTF-16LE text), so passwords from the old database keep working.
 */
export function hashPassword(password: string): Buffer {
  return createHash('sha512').update(Buffer.from(password, 'utf16le')).digest();
}

export function passwordMatches(password: string, storedHash: Uint8Array): boolean {
  const hash = hashPassword(password);
  return hash.length === storedHash.length && timingSafeEqual(hash, storedHash);
}
