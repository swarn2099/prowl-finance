// PlaidLink.tsx
import React, { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { Button, StyleSheet, View } from 'react-native';
import queryString from 'query-string';
import { LinkErrorCode, LinkErrorType, LinkExitMetadataStatus } from './const';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';

export default function PlaidLink({
  linkToken,
  onEvent,
  onExit,
  onSuccess,
  setShowPlaidLink,
}: {
  linkToken: string;
  onEvent: Function;
  onExit: Function;
  onSuccess: Function;
  setShowPlaidLink?: (show: boolean) => void;
}) {
  const webviewRef = useRef<WebView>(null);

  const handleNavigationStateChange = (event: { url: string }) => {
    console.log('Navigating to URL: ', event.url);
    if (event.url.startsWith('plaidlink://')) {
      const eventParams = queryString.parse(event.url.replace(/.*\?/, ''));

      if (event.url.startsWith('plaidlink://event') && onEvent) {
        onEvent({
          eventName: eventParams['event_name'],
          metadata: eventParams,
        });
      } else if (event.url.startsWith('plaidlink://exit') && onExit) {
        onExit({
          error: {
            errorCode: LinkErrorCode[eventParams['error_code']],
            errorMessage: eventParams['error_message'],
            errorType: LinkErrorType[eventParams['error_type']],
          },
          metadata: eventParams,
        });
      } else if (event.url.startsWith('plaidlink://connected') && onSuccess) {
        onSuccess({
          publicToken: eventParams['public_token'],
          metadata: eventParams,
        });
      }
      return false;
    }
    return true;
  };

  const handleClose = () => {
    if (setShowPlaidLink) {
      setShowPlaidLink(false);
    }
  };

  useEffect(() => {
    const handleDeepLink = (event) => {
      console.log('Deep Link URL: ', event.url);
    };

    Linking.addEventListener('url', handleDeepLink);
    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: `https://cdn.plaid.com/link/v2/stable/link.html?token=${linkToken}&env=sandbox&redirect_url=${encodeURIComponent(
            'https://ed1b3cf31c9e.ngrok.app/src/plaid-redirect.html'
          )}`,
        }}
        ref={webviewRef}
        onError={() => webviewRef.current?.reload()}
        originWhitelist={['*', 'http://*', 'https://*', 'plaidlink://*']} // To allow all URLs
        onShouldStartLoadWithRequest={handleNavigationStateChange}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  webview: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 8,
    fontSize: 16,
    color: 'red',
  },
});
