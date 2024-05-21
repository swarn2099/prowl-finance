// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, StyleSheet } from 'react-native';
// import {
//   ThemedView as View,
//   ThemedText as Text,
// } from '../../components/ThemedComponents';
// import { generateOnRampURL } from '@coinbase/cbpay-js';
// import CoinbaseWebView from './OnrampWebview';
// import CoinbaseAuth from './coinbase/CoinbaseAuth';

// const WalletScreen = () => {
//   return (
//     <View style={styles.container}>
//       {/* <CoinbaseWebView /> */}
//       <CoinbaseAuth />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   loading: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginTop: -25,
//     marginLeft: -25,
//   },
// });

// export default WalletScreen;

import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, Button, StyleSheet } from 'react-native';
import {
  ThemedView as View,
  ThemedText as Text,
} from '../../components/ThemedComponents';
import { useQuery } from '@apollo/client';
import CoinbaseAuth from './coinbase/CoinbaseAuth';
import { getUserQuery } from '../../utils/api/user.queries';
import { InitializeWaas } from '@coinbase/waas-sdk-web';

const WalletScreen = () => {
  const { data, loading, error, refetch } = useQuery(getUserQuery);
  useEffect(() => {
    console.log('loaded wallet screen');
    console.log('data', data);
  }, [data]);

  if (loading) {
    return <ActivityIndicator style={styles.loading} />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const user = data?.getUserById;

  return (
    <View style={styles.container}>
      {user?.coinbaseAccount ? (
        <View>
          <Text>Access Token: {user.coinbaseAccount.accessToken}</Text>
          <Text>Refresh Token: {user.coinbaseAccount.refreshToken}</Text>

          {/* ADD THE CREATE WALLET BUTTON HERE */}
        </View>
      ) : (
        <CoinbaseAuth refetchUser={refetch} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
  },
});

export default WalletScreen;
