import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default function PlaidLink({
  linkToken,
  onEvent,
  onExit,
  onSuccess,
  setShowPlaidLink,
}) {
  const webviewRef = useRef(null);
  const [plaidLinkURL, setPlaidLinkURL] = useState(
    `https://cdn.plaid.com/link/v2/stable/link.html?isWebView=true&token=${linkToken}&env=sandbox`
  );
  const [handledStateIds, setHandledStateIds] = useState(new Set());
  const [shouldReload, setShouldReload] = useState(false);

  const handleNavigationStateChange = (event) => {
    console.log('Navigating to URL: ', event.url);

    if (event.url.startsWith('plaidlink://')) {
      const url = new URL(event.url);
      const action = url.pathname.split('://')[1];

      switch (action) {
        case 'event':
          onEvent && onEvent(JSON.parse(url.searchParams.get('data')));
          break;
        case 'exit':
          onExit && onExit(JSON.parse(url.searchParams.get('data')));
          setShowPlaidLink(false);
          break;
        case 'connected':
          const publicToken = url.searchParams.get('public_token');
          onSuccess &&
            onSuccess({
              publicToken,
              metadata: JSON.parse(url.searchParams.get('data')),
            });
          setShowPlaidLink(false);
          break;
      }
      return false;
    }

    if (event.url.includes('plaid-redirect.html')) {
      const oauthStateId = new URL(event.url).searchParams.get(
        'oauth_state_id'
      );
      if (oauthStateId && !handledStateIds.has(oauthStateId)) {
        setHandledStateIds((prev) => new Set([...prev, oauthStateId]));
        const receivedRedirectUri = event.url;
        const newUrl = `https://cdn.plaid.com/link/v2/stable/link.html?token=${linkToken}&receivedRedirectUri=${encodeURIComponent(
          receivedRedirectUri
        )}`;
        console.log('Setting new URL for reinitialization:', newUrl);
        setPlaidLinkURL(newUrl);
        setShouldReload(true);
      }
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (shouldReload && webviewRef.current) {
      console.log('Reloading WebView with URL:', plaidLinkURL);
      // webviewRef.current.reload();
      // setShouldReload(false);
    }
  }, [plaidLinkURL, shouldReload]);

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: plaidLinkURL }}
        ref={webviewRef}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('HTTP error status: ', nativeEvent.statusCode);
          console.error('HTTP error description: ', nativeEvent.description);
        }}
        originWhitelist={['*', 'http://*', 'https://*', 'plaidlink://*']}
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
});
