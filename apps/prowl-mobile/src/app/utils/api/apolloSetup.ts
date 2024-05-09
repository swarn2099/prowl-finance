import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth0 } from 'react-native-auth0';

export const createApolloClient = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { getCredentials } = useAuth0();

  const httpLink = createHttpLink({
    uri: 'https://a790cbff8224.ngrok.app/graphql',
  });

  // Update the authLink to fetch the credentials inside the function
  const authLink = setContext(async (_, { headers }) => {
    try {
      const credentials: any = await getCredentials(); // Fetch credentials here
      console.log('Access Token:', credentials.accessToken);
      console.log('ID Token:', credentials.idToken);
      console.log('Full Credentials:', credentials);
      const idToken = credentials.idToken; // Use ID token for authorization (if required so)
      return {
        headers: {
          ...headers,
          authorization: idToken ? `Bearer ${idToken}` : '',
        },
      };
    } catch (error) {
      console.error('Failed to retrieve credentials:', error);
      return { headers }; // Return the headers as is on error
    }
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};
