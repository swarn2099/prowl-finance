import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  getLinkToken,
  sendPlaidPublicToken,
} from '../../utils/api/user.queries';
import WebView from 'react-native-webview';
import * as Linking from 'expo-linking';
import queryString from 'query-string';

export const PlaidLinkScreen = () => {
  const navigation = useNavigation();
  const [showPlaidLink, setShowPlaidLink] = useState(false);

  const [getLinkTokenQuery, { loading, error, data }] =
    useLazyQuery(getLinkToken);

  const [
    sendPublicToken,
    { data: sendPlaidPublicTokenResponse, error: sendPlaidPublicTokenError },
  ] = useMutation(sendPlaidPublicToken);

  const startPlaidLink = useCallback(() => {
    getLinkTokenQuery();
    setShowPlaidLink(true);
  }, [getLinkTokenQuery]);

  const handleSendToken = async (publicAccessToken: string) => {
    await sendPublicToken({
      variables: { public_access_token: publicAccessToken },
    });
  };
  useEffect(() => {
    if (sendPlaidPublicTokenResponse) {
      console.log('Success:', sendPlaidPublicTokenResponse);
      navigation.goBack();
      // Additional success logic here
    }
    if (sendPlaidPublicTokenError) {
      console.error('Error:', sendPlaidPublicTokenError.message);
      // Additional error logic here
    }
  }, [sendPlaidPublicTokenResponse, sendPlaidPublicTokenError]);

  const webviewRef: any = useRef<WebView>(null);
  const plaidUri = `https://cdn.plaid.com/link/v2/stable/link.html?isWebview=true&token=${data?.getLinkToken.linkToken}`;
  const PLAID_OAUTH_PATH = 'app/home';

  useEffect(() => {
    // Listens for when our app is deeplinked to
    const handler: Linking.URLListener = ({ url }) => {
      const { path } = Linking.parse(url);
      if (path === PLAID_OAUTH_PATH) {
        webviewRef.current?.injectJavaScript?.(
          `window.open('${plaidUri}&receivedRedirectUri=${encodeURIComponent(
            url
          )}')`
        );
      }
    };

    Linking.addEventListener('url', handler);
    // return () => Linking.removeEventListener('url', handler);
  }, [plaidUri]);

  const injectedJavaScript = `(function() {
    window.postMessage = function(data) {
      window.ReactNativeWebView.postMessage(data);
    };
  })()`;

  const navigationRedirect = (event: any) => {
    if (event.url && event.url.startsWith('plaidlink://')) {
      const eventParams: any = queryString.parse(event.url.replace(/.*\?/, ''));
      const { link_session_id, institution_id, institution_name } = eventParams;

      if (event.url.startsWith('plaidlink://exit')) {
        // handle plaid exit here, for example go back on navigation.
        setShowPlaidLink(false);
        console.log('plaid exit!');
      } else if (event.url.startsWith('plaidlink://connected')) {
        // handle connect successfully here
        const { public_token } = eventParams;
        // const accounts = JSON.parse(eventParams.accounts);
        // console.log('plaid connect!');
        // console.log('account_id', accounts[0]['_id']);
        // console.log('institution_id', institution_id);
        // console.log('institution_name', institution_name);
        // console.log('link_session_id', link_session_id);
        // console.log('public_token', public_token);
        // exchange public token and save plaid-user
        // sendPublicToken({ variables: { public_access_token: public_token } });
        handleSendToken(public_token);
      }
      return false;
    }
    return true;
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {showPlaidLink === false ? (
          <Button title="Connect Bank Account" onPress={startPlaidLink} />
        ) : null}
        {showPlaidLink && data?.getLinkToken.linkToken && (
          <WebView
            ref={webviewRef}
            source={{ uri: plaidUri }}
            injectedJavaScript={injectedJavaScript}
            originWhitelist={['http://*', 'https://*', 'plaidlink://*']}
            onShouldStartLoadWithRequest={navigationRedirect}
            onNavigationStateChange={navigationRedirect}
            setSupportMultipleWindows={false}
            onError={(error) => {
              console.error('WebView error:', error.nativeEvent);
              webviewRef.current.goBack();
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default PlaidLinkScreen;
