import { webcrypto } from 'node:crypto';

export function generateRandomString(length: number) {
  const typedArray = new Uint8Array(length);
  webcrypto.getRandomValues(typedArray);

  return Buffer.from(typedArray)
    .toString('base64url')
    .replaceAll(/[^a-z0-9]/giu, '')
    .substring(0, length);
}
