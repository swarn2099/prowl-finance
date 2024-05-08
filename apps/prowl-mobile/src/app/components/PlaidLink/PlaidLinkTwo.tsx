// import { useEffect, useRef } from 'react';
// import { WebView } from 'react-native-webview';
// import queryString from 'query-string';
// import { Linking } from 'react-native';

// export const PlaidLinkTwo = ({ linkToken }: any) => {
//   const injectedJavaScript = `(function() {
//     window.postMessage = function(data) {
//       window.ReactNativeWebView.postMessage(data);
//     };
//   })()`;

//   const webViewRef = useRef<WebView>();

//   const navigationRedirect = (event: any) => {
//     if (event.url && event.url.startsWith('plaidlink://')) {
//       const eventParams: any = queryString.parse(event.url.replace(/.*\?/, ''));
//       const { link_session_id, institution_id, institution_name } = eventParams;

//       if (event.url.startsWith('plaidlink://exit')) {
//         // handle plaid exit here, for example go back on navigation.
//         console.log('plaid exit!');
//       } else if (event.url.startsWith('plaidlink://connected')) {
//         // handle connect successfully here
//         const { public_token } = eventParams;
//         const accounts = JSON.parse(eventParams.accounts);
//         console.log('plaid connect!');
//         console.log('account_id', accounts[0]['_id']);
//         console.log('institution_id', institution_id);
//         console.log('institution_name', institution_name);
//         console.log('link_session_id', link_session_id);
//         console.log('public_token', public_token);
//       }
//       return false;
//     }
//     return true;
//   };
//   const plaidLinkURL = `https://cdn.plaid.com/link/v2/stable/link.html?isWebview=true&token=${linkToken}&env=sandbox&client_id=6633d288dfdbfd001c401ec9&redirect_uri=https://ed1b3cf31c9e.ngrok.app/src/plaid-redirect.html`;

//   useEffect(() => {
//     console.log('Plaid Link URL:', plaidLinkURL);
//   }, []);
//   return (
//     <WebView
//       ref={webViewRef}
//       source={{
//         uri: plaidLinkURL,
//       }}
//       useWebKit
//       injectedJavaScript={injectedJavaScript}
//       originWhitelist={['http://*', 'https://*', 'plaidlink://*', '*']}
//       onShouldStartLoadWithRequest={navigationRedirect}
//       onNavigationStateChange={navigationRedirect}
//       setSupportMultipleWindows={false}
//       onError={() => {
//         if (webViewRef.current) {
//           webViewRef.current.goBack();
//         }
//       }}
//     />
//   );
// };

// export default PlaidLinkTwo;
// //https://cdn.plaid.com/link/v2/stable/link.html?isWebview=true&token=link-sandbox-69b3f719-be8c-42eb-9db8-24ff7be2a5b0&redirect_uri=https://ed1b3cf31c9e.ngrok.app/src/plaid-redirect.html
