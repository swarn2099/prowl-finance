import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth0 } from 'react-native-auth0';
import jwtDecode from 'jwt-decode';
import Auth0 from 'react-native-auth0';

export const createApolloClient = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { getCredentials } = useAuth0();

  const httpLink = createHttpLink({
    uri: 'https://971ecb66f3b2.ngrok.app/graphql',
  });

  const auth0 = new Auth0({
    domain: 'dev-yuycjzgs1yedljuh.us.auth0.com',
    clientId: 'BsaGs1glUYh2hklReySgL4VGvgivj4Ug',
  });

  const isTokenExpired = (token: any) => {
    if (!token) return true;
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  };

  const renewAuth = async (refreshToken) => {
    return auth0.auth.refreshToken({ refreshToken: refreshToken });
  };

  // Update the authLink to fetch the credentials inside the function
  const authLink = setContext(async (_, { headers }) => {
    try {
      const credentials: any = await getCredentials(); // Fetch credentials here
      // console.log('Access Token:', credentials.accessToken);
      console.log('ID Token from Apollo Setup:', credentials.idToken);
      let refreshToken = credentials.refreshToken;
      let idToken = credentials.idToken; // Use ID token for authorization (if required so)

      // Check if idToken is expired, if so refresh it
      if (isTokenExpired(idToken)) {
        const newCredentials = await renewAuth(refreshToken);
        idToken = newCredentials.idToken;

        // Save the new credentials to credentials manager
        auth0.credentialsManager.saveCredentials(newCredentials).then(() => {
          // console.log('Credentials saved successfully');
        });
      }
      return {
        headers: {
          ...headers,
          authorization: idToken ? `Bearer ${idToken}` : '',
        },
      };
    } catch (error) {
      console.error('Failed to retrieve credentials from apolloSetup:', error);
      return { headers }; // Return the headers as is on error
    }
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
