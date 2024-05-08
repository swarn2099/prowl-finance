import React, { useEffect, useState } from 'react';
import {
  ThemedView as View,
  ThemedText as Text,
} from '../../components/ThemedComponents';
import { Button } from 'react-native';
import PlaidLink from '../../components/PlaidLink/PlaidLink';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { getLinkToken } from '../../utils/api/user.queries';
import * as Linking from 'expo-linking';

export const FeedScreen = () => {
  const [showPlaidLink, setShowPlaidLink] = useState(false);
  const navigation = useNavigation();
  const [getLinkTokenQuery, { loading, error, data }] =
    useLazyQuery(getLinkToken);

  const startPlaidLink = () => {
    getLinkTokenQuery(); // Trigger the query when the user clicks the button
    setShowPlaidLink(true);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  if (data && showPlaidLink) {
    console.log('Link Token:', data.getLinkToken.linkToken);
  }

  return (
    <View style={{ flex: 1 }}>
      {!showPlaidLink && (
        <Button title="Connect Bank Account" onPress={startPlaidLink} />
      )}
      {showPlaidLink && data?.getLinkToken.linkToken && (
        <PlaidLink
          linkToken={data.getLinkToken.linkToken}
          setShowPlaidLink={setShowPlaidLink}
          onEvent={(event) => null}
          onExit={(exit) => {
            console.log('Exit: ', exit);
            setShowPlaidLink(false); // Hide PlaidLink on exit
          }}
          onSuccess={(success) => {
            console.log('Success: ', success.publicToken);
            navigation.navigate('ProfileScreen', {
              publicToken: success.publicToken,
            });
          }}
        />
      )}
    </View>
  );
};

export default FeedScreen;
