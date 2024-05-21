import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { AuthStyles as styles } from './AuthStyles';
import { ThemedText as Text } from '../../../components/ThemedComponents';

const CreateAccount = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  username,
  setUsername,

  email,
  setEmail,
  password,
  setPassword,
  handleCreateAccount,
}: any) => {
  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#828282"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#828282"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="username"
        placeholderTextColor="#828282"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="email@domain.com"
        placeholderTextColor="#828282"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#828282"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        onPress={handleCreateAccount}
        style={{
          backgroundColor: '#000',
          width: '100%',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white' }}>Create an Account</Text>
      </TouchableOpacity>
    </>
  );
};

export default CreateAccount;
