// backendService.ts
import { gql } from '@apollo/client';
import { getApolloClient } from '../../../utils/api/apolloSetup';

const STORE_TOKEN_MUTATION = gql`
  mutation StoreToken($accessToken: String!, $refreshToken: String!) {
    storeToken(accessToken: $accessToken, refreshToken: $refreshToken) {
      success
    }
  }
`;

const GET_TOKEN_QUERY = gql`
  query GetStoredToken {
    getStoredToken {
      accessToken
      refreshToken
    }
  }
`;

export async function storeTokenToBackend(token) {
  try {
    const client = await getApolloClient();
    await client.mutate({
      mutation: STORE_TOKEN_MUTATION,
      variables: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      },
    });
  } catch (error) {
    console.error('Failed to store token to backend', error);
  }
}

export async function getStoredTokenFromBackend() {
  try {
    const client = await getApolloClient();
    const { data } = await client.query({
      query: GET_TOKEN_QUERY,
    });
    return data.getStoredToken;
  } catch (error) {
    console.error('Failed to get stored token from backend', error);
    return null;
  }
}
