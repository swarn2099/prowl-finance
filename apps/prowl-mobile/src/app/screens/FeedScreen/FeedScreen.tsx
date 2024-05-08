// Example usage of PlaidLink in an Expo (bare or custom client) app
import React from 'react';
import { ThemedView as View } from '../../components/ThemedComponents';
import { StatusBar, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import PlaidLink from '../../components/PlaidLink/PlaidLink';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

export const FeedScreen = () => {
  const [text, onChangeText] = React.useState('');
  const [disabled, setDisabled] = React.useState(true);

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.webviewContainer}>
        <PlaidLink
          linkToken="link-sandbox-2358a92f-97ff-44d9-93ee-38cf8cc32bcc"
          onEvent={(event) => console.log('Event: ', event)}
          onExit={(exit) => console.log('Exit: ', exit)}
          onSuccess={(success) => {
            console.log('Sucess: ', success.publicToken);
            navigation.navigate('ProfileScreen', {
              publicToken: success.publicToken,
            });
          }}
        />
      </View>
    </View>
  );
};
// Styles
const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webview: {
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
export default FeedScreen;
