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

export const SettingsScreen = () => {
  const [username, setUsername] = useState('john_doe');
  const [password, setPassword] = useState('');

  // Dummy function to handle profile picture change
  const changeProfilePicture = () => {
    console.log('Change profile picture tapped');
  };

  // Dummy function to handle updating account settings
  const updateSettings = () => {
    console.log('Settings updated:', { username, password });
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
        <Button title="Update Settings" onPress={updateSettings} />
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
