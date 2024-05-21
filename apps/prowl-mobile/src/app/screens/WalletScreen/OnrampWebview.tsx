import React, { useCallback, useEffect, useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { generateOnRampURL } from '@coinbase/cbpay-js';
import 'react-native-url-polyfill/auto';

const OnrampWebView = ({ currentAmount }: any) => {
  const destinationAddress = '0x1234567890123456789012345678901234567890';
  const [coinbaseURL, setCoinbaseURL] = useState('');
  const webviewRef = useRef(null);

  const generateURL = useCallback(() => {
    const options = {
      appId: '23c333a2-2d93-498f-ab2c-ed7b2e8049af',
      destinationWallets: [
        {
          address: destinationAddress,
          blockchains: ['base', 'ethereum', 'bsc', 'polygon'],
        },
      ],
    };

    try {
      const url = generateOnRampURL(options);
      console.log('Coinbase URL:', url);
      setCoinbaseURL(url);
    } catch (error) {
      console.error('Error generating URL:', error);
    }
  }, [currentAmount, destinationAddress]);

  useEffect(() => {
    generateURL();
  }, [generateURL]);

  const onMessage = useCallback((event: any) => {
    console.log('onMessage', event.nativeEvent.data);
    try {
      const { data } = JSON.parse(event.nativeEvent.data);
      if (data.eventName === 'request_open_url') {
        // Handle URL request as needed
        console.log('Request to open URL:', data.url);
      } else if (data.eventName === 'error') {
        console.error('Coinbase error:', data.error, data);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }, []);

  return coinbaseURL ? (
    <WebView
      ref={webviewRef}
      incognito={true}
      source={{
        uri: 'https://www.coinbase.com/oauth/authorize?client_id=d869fb0e13bf5dbb3ec607ecaefa7c92f27c4972088229a4540566caec0e0848&redirect_uri=app%3A%2F%2F192.168.1.124%3A8081%2F--%2Fapp%2F&response_type=code&scope=wallet%3Auser%3Aread',
      }}
      onMessage={onMessage}
      originWhitelist={['*']}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      mixedContentMode="always"
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
      }}
      onLoadProgress={({ nativeEvent }) => {
        console.log('Load Progress: ', nativeEvent.progress);
      }}
      injectedJavaScriptBeforeContentLoaded={`
        window.ReactNativeWebView = {
          postMessage: (data) => window.postMessage(data, '*'),
        };
      `}
    />
  ) : (
    <ActivityIndicator style={styles.loading} />
  );
};

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
  },
});

export default OnrampWebView;
