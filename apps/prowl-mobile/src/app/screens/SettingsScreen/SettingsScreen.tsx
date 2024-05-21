import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ScrollView,
  TextInput,
  Button,
  Image,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import Auth0 from 'react-native-auth0';
import { useAuth } from '../../contexts/AuthContext';

const auth0 = new Auth0({
  domain: 'dev-yuycjzgs1yedljuh.us.auth0.com',
  clientId: 'BsaGs1glUYh2hklReySgL4VGvgivj4Ug',
});

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('john_doe');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated } = useAuth();

  // Dummy function to handle profile picture change
  const changeProfilePicture = () => {
    console.log('Change profile picture tapped');
  };

  // Dummy function to handle updating account settings
  const updateSettings = () => {
    console.log('Settings updated:', { username, password });
  };

  const { clearSession, user } = useAuth0();

  const logout = async () => {
    auth0.credentialsManager.clearCredentials();

    await clearSession();
    setIsAuthenticated(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>Profile Picture</Text>
        <Button title="Change Profile Picture" onPress={changeProfilePicture} />
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.header}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.section}>
        <Button
          title="Link Bank Account"
          onPress={() => navigation.navigate('PlaidLinkScreen')}
        />
        <Button title="Logout" onPress={logout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
});

export default SettingsScreen;
