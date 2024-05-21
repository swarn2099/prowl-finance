// authConfig.js
import { makeRedirectUri } from 'expo-auth-session';

export const discovery = {
  authorizationEndpoint: 'https://www.coinbase.com/oauth/authorize',
  tokenEndpoint: 'https://api.coinbase.com/oauth/token',
  revocationEndpoint: 'https://api.coinbase.com/oauth/revoke',
};

export const redirectUri = makeRedirectUri({
  native: 'app://redirect',
});

export const COINBASE_CLIENT_ID =
  'd869fb0e13bf5dbb3ec607ecaefa7c92f27c4972088229a4540566caec0e0848';
export const COINBASE_CLIENT_SECRET =
  '4b466665f63729bc6044638232fd21d02372384ef916caf5a80126fc2d1c5f24';
