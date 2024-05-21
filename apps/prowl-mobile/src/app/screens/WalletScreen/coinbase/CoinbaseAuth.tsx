// // CoinbaseAuth.js
// import React, { useEffect, useReducer, useRef, useState } from 'react';
// import { Button, Text, View } from 'react-native';
// import { useAuthRequest } from 'expo-auth-session';
// import * as WebBrowser from 'expo-web-browser';
// import {
//   COINBASE_CLIENT_ID,
//   discovery,
//   redirectUri,
// } from './coinbaseAuthConfig';
// import {
//   exchangeCode,
//   refreshToken,
//   storeToken,
//   getToken,
// } from './coinbaseAuthService';
// import { useMutation } from '@apollo/client';
// import { linkCoinbaseAccountMutation } from '../../../utils/api/user.queries';

// WebBrowser.maybeCompleteAuthSession();

// function useAutoExchange(code) {
//   const [state, setState] = useReducer(
//     (state, action) => ({ ...state, ...action }),
//     { token: null, exchangeError: null }
//   );
//   const isMounted = useMounted();

//   useEffect(() => {
//     if (!code) {
//       setState({ token: null, exchangeError: null });
//       return;
//     }

//     exchangeCode(code)
//       .then((token) => {
//         if (isMounted.current) {
//           setState({ token, exchangeError: null });
//           storeToken(token);
//         }
//       })
//       .catch((exchangeError) => {
//         if (isMounted.current) {
//           setState({ exchangeError, token: null });
//         }
//       });
//   }, [code]);

//   return state;
// }

// function useMounted() {
//   const isMounted = useRef(true);
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);
//   return isMounted;
// }

// const CoinbaseAuth = () => {
//   const [request, response, promptAsync] = useAuthRequest(
//     {
//       clientId: COINBASE_CLIENT_ID,
//       scopes: ['wallet:accounts:read'],
//       redirectUri,
//     },
//     discovery
//   );

//   const [linkCoinbaseAccount, { data, error }] = useMutation(linkCoinbaseAccountMutation);

//   const handleLinkMutation = async (token) => {
//     await linkCoinbaseAccount({
//       variables: {
//         accessToken: token.accessToken,
//         refreshToken: token.refreshToken,
//       },
//     });
//   };

//   const { token, exchangeError } = useAutoExchange(
//     response?.type === 'success' ? response.params.code : null
//   );

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (token) {
//       console.log('My Token:', token.accessToken);

//       // call the backend to store the token

//       setIsLoggedIn(true);
//       setLoading(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     const checkToken = async () => {
//       const storedToken = getToken();
//       if (storedToken) {
//         try {
//           const newToken = await refreshToken(storedToken.refreshToken);
//           storeToken(newToken);
//           setIsLoggedIn(true);
//         } catch (error) {
//           console.error('Failed to refresh token', error);
//         }
//       }
//       setLoading(false);
//     };

//     checkToken();
//   }, []);

//   if (loading) {
//     return <Text>Loading...</Text>;
//   }

//   return (
//     <View>
//       {!isLoggedIn ? (
//         <Button
//           disabled={!request}
//           title="Login"
//           onPress={() => {
//             promptAsync();
//           }}
//         />
//       ) : (
//         <Text>Logged in to Coinbase</Text>
//       )}
//     </View>
//   );
// };

// export default CoinbaseAuth;

import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  COINBASE_CLIENT_ID,
  discovery,
  redirectUri,
} from './coinbaseAuthConfig';
import { exchangeCode, refreshToken, getToken } from './coinbaseAuthService';
import { useMutation } from '@apollo/client';
import {
  linkCoinbaseAccountMutation,
  updateCoinbaseAccountMutation,
} from '../../../utils/api/user.queries';

WebBrowser.maybeCompleteAuthSession();

function useAutoExchange(code, handleLinkMutation) {
  const [state, setState] = useReducer(
    (state, action) => ({ ...state, ...action }),
    { token: null, exchangeError: null }
  );
  const isMounted = useMounted();

  useEffect(() => {
    if (!code) {
      setState({ token: null, exchangeError: null });
      return;
    }

    exchangeCode(code)
      .then((token) => {
        if (isMounted.current) {
          setState({ token, exchangeError: null });
          handleLinkMutation(token);
        }
      })
      .catch((exchangeError) => {
        if (isMounted.current) {
          setState({ exchangeError, token: null });
        }
      });
  }, [code]);

  return state;
}

function useMounted() {
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
}

const CoinbaseAuth = ({ refetchUser }) => {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: COINBASE_CLIENT_ID,
      scopes: ['wallet:accounts:read'],
      redirectUri,
    },
    discovery
  );

  const [linkCoinbaseAccount] = useMutation(linkCoinbaseAccountMutation);
  const [updateCoinbaseAccount] = useMutation(updateCoinbaseAccountMutation);

  const handleLinkMutation = async (token) => {
    await linkCoinbaseAccount({
      variables: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      },
    });
    refetchUser();
  };

  const handleTokenRefresh = async (token) => {
    try {
      const newToken = await refreshToken(token.refreshToken);
      await updateCoinbaseAccount({
        variables: {
          accessToken: newToken.accessToken,
          refreshToken: newToken.refreshToken,
        },
      });
    } catch (error) {
      console.error('Failed to refresh token', error);
    }
  };

  const { token, exchangeError } = useAutoExchange(
    response?.type === 'success' ? response.params.code : null,
    handleLinkMutation
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      console.log('My Token:', token.accessToken);
      setIsLoggedIn(true);
      setLoading(false);
    }
    console.log('this has been loaded');
  }, [token]);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await getToken();
      if (storedToken) {
        try {
          await handleTokenRefresh(storedToken);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Failed to refresh token', error);
        }
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  if (loading) {
    return <Text>Loading from CoinbaseAuth...</Text>;
  }

  return (
    <View>
      {!isLoggedIn ? (
        <Button
          disabled={!request}
          title="Login"
          onPress={() => {
            promptAsync();
          }}
        />
      ) : (
        <Text>Logged in to Coinbase</Text>
      )}
    </View>
  );
};

export default CoinbaseAuth;
