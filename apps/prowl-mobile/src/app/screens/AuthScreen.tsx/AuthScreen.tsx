// UserAuth.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

const AuthScreen = () => {
  const { authorize, clearSession, user, error, isLoading } = useAuth0();

  const onLogin = async () => {
    try {
      const creds = await authorize({
        scope: 'openid profile email offline_access',
        redirectUrl: 'exp://192.168.1.124:8081/--/app/',
      });
      console.log(creds);
    } catch (e) {
      console.log(e);
    }
  };

  const onLogout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }

  const loggedIn = user !== undefined && user !== null;

  return (
    <View style={styles.container}>
      {loggedIn && <Text>You are logged in as {user.name}</Text>}
      {!loggedIn && <Text>You are not logged in</Text>}
      {error && <Text>{error.message}</Text>}

      <Button
        onPress={loggedIn ? onLogout : onLogin}
        title={loggedIn ? 'Log Out' : 'Log In'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
export default AuthScreen;
