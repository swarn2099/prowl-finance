import React from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { AuthStyles as styles } from './AuthStyles';
import { ThemedText as Text } from '../../../components/ThemedComponents';

const LoginAccount = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
}: any) => {
  return (
    <>
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
        onPress={() => handleLogin('login')}
        style={{
          backgroundColor: '#000',
          width: '100%',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white' }}>Log In</Text>
      </TouchableOpacity>
    </>
  );
};

export default LoginAccount;
