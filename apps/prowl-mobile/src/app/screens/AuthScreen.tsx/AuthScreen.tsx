// AuthScreen.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import GridBackground from './components/GridBackground';
import AnimatedGradient from './components/AnimatedGradient';
import Auth0 from 'react-native-auth0';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStyles as styles } from './components/AuthStyles';
import CreateAccount from './components/CreateAcount';
import LoginAccount from './components/Login';
import { useMutation } from '@apollo/client';
import { createUserMutation } from '../../utils/api/user.queries';

const auth0 = new Auth0({
  domain: 'dev-yuycjzgs1yedljuh.us.auth0.com',
  clientId: 'BsaGs1glUYh2hklReySgL4VGvgivj4Ug',
});
const { width, height } = Dimensions.get('window');

const AuthScreen = () => {
  const navigation = useNavigation();
  const { setIsAuthenticated } = useAuth();

  const [isLoginFlow, setIsLoginFlow] = useState(false);

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [createUser, { data, error }] = useMutation(createUserMutation);

  const handleCreateUserMutation = async () => {
    await createUser({
      variables: {
        username: username,
        email: email,
        firstName: firstName,
        lastName: lastName,
      },
    });
  };

  const handleLogin = (type) => {
    // Handle login logic
    auth0.auth
      .passwordRealm({
        username: email,
        password: password,
        realm: 'Username-Password-Authentication',
      })
      .then((response) => {
        console.log(response);
        const { scope: _, ...authObj } = response;

        auth0.credentialsManager
          .saveCredentials(authObj)
          .then(async () => {
            console.log('Credentials saved successfully');
            setIsAuthenticated(true);

            // call create User Mutation - TODO Clean up this code later
            type === 'create' && (await handleCreateUserMutation());

            navigation.navigate('HomeTabs', { screen: 'Home' });
          })
          .catch(console.error);
      })
      .catch(console.error);
  };

  const handleCreateAccount = () => {
    console.log(
      'Creating account',
      email,
      password,
      username,
      firstName,
      lastName
    );

    auth0.auth
      .createUser({
        email: email,
        username: username,
        given_name: firstName + ' ' + lastName,
        name: firstName + ' ' + lastName,
        password: password,
        connection: 'Username-Password-Authentication',
      })
      .then((response) => {
        // login the user
        handleLogin('create');
        console.log(response);
      })
      .catch(console.error);
  };

  return (
    <View style={styles.container}>
      <AnimatedGradient />
      <GridBackground
        width={width}
        height={height}
        lineColor="rgba(255, 255, 255, 0.2)"
        lineWidth="1"
      />
      <View style={styles.content}>
        <Text style={styles.title}>Prowl</Text>
        {isLoginFlow ? (
          <Text style={styles.subtitle}>Welcome Back!</Text>
        ) : (
          <Text style={styles.subtitle}>Create an account</Text>
        )}
        {isLoginFlow ? (
          <Text style={styles.description}>
            Don't have an account?{' '}
            <TouchableOpacity onPress={() => setIsLoginFlow(!isLoginFlow)}>
              <Text style={{ color: 'cyan', textDecorationLine: 'underline' }}>
                Register
              </Text>
            </TouchableOpacity>
          </Text>
        ) : (
          <Text style={styles.description}>
            Have an account?{' '}
            <TouchableOpacity onPress={() => setIsLoginFlow(!isLoginFlow)}>
              <Text style={{ color: 'cyan', textDecorationLine: 'underline' }}>
                Sign in
              </Text>
            </TouchableOpacity>
          </Text>
        )}
        {isLoginFlow ? (
          <LoginAccount
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        ) : (
          <CreateAccount
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleCreateAccount={handleCreateAccount}
          />
        )}
        <Text style={styles.orText}>or continue with</Text>
        <TouchableOpacity
          onPress={() => {
            /* Handle Google Sign-In */
          }}
          style={{
            backgroundColor: '#EEEEEE',
            width: '100%',
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
          }}
        >
          <Text>Google</Text>
        </TouchableOpacity>
        <Text style={styles.terms}>
          By clicking continue, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

export default AuthScreen;
