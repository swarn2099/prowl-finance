// coinbaseAuthService.ts
import { exchangeCodeAsync, refreshAsync } from 'expo-auth-session';
import {
  COINBASE_CLIENT_ID,
  COINBASE_CLIENT_SECRET,
  discovery,
  redirectUri,
} from './coinbaseAuthConfig';
import {
  getStoredTokenFromBackend,
  storeTokenToBackend,
} from './backendService';

export async function exchangeCode(code) {
  const token = await exchangeCodeAsync(
    {
      clientId: COINBASE_CLIENT_ID,
      clientSecret: COINBASE_CLIENT_SECRET,
      code,
      redirectUri,
    },
    discovery
  );
  await storeToken(token);
  return token;
}

export async function refreshToken(refreshToken) {
  const token = await refreshAsync(
    {
      clientId: COINBASE_CLIENT_ID,
      clientSecret: COINBASE_CLIENT_SECRET,
      refreshToken,
    },
    discovery
  );
  await storeToken(token);
  return token;
}

export async function storeToken(token) {
  await storeTokenToBackend(token);
}

export async function getToken() {
  return await getStoredTokenFromBackend();
}
