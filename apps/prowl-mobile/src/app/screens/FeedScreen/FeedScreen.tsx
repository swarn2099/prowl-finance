import { useMutation } from '@apollo/client';
import React from 'react';
import { Button, View, Text } from 'react-native';
import { createUserMutation } from '../../utils/api/user.queries';

export const FeedScreen = () => {
  const [createUser, { data, error }] = useMutation(createUserMutation);

  const handleCreateUserMutation = async () => {
    try {
      const res = await createUser({
        variables: {
          username: 'test',
          email: 'test@test.com',
          firstName: 'Test',
          lastName: 'Test',
        },
      });
      console.log('Response: ', res);
    } catch (err) {
      console.error('Error: ', JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Create User" onPress={handleCreateUserMutation} />
      {error && <Text>Error: {error.message}</Text>}
      {data && <Text>Success: {JSON.stringify(data)}</Text>}
    </View>
  );
};

export default FeedScreen;
