/* eslint-disable no-var */
// src/utils/validateToken.ts
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

const client = jwksClient.default({
  jwksUri: `https://dev-yuycjzgs1yedljuh.us.auth0.com/.well-known/jwks.json`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err, null);
      return;
    }
    var signingKey = key.getPublicKey(); // Correctly calling the getPublicKey method
    callback(null, signingKey);
  });
}

export function validateToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    console.log('Validate Token: ', token);
    jwt.verify(
      token,
      getKey,
      {
        issuer: `https://dev-yuycjzgs1yedljuh.us.auth0.com/`,
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      }
    );
  });
}
