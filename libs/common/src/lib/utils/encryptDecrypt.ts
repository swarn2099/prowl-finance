import crypto = require('crypto');

const algorithm = 'aes-256-cbc';
export const key = crypto.randomBytes(32); // Ensure to save this key securely; it's needed for decryption
const iv = crypto.randomBytes(16); // Initialization vector

export function encrypt(text: string) {
  console.log('text', text);
  console.log('key', key);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string, key: any) {
  console.log('text', text);
  console.log('key', key);
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift() || '', 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
