import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MyThemes } from './contexts/Themes/theme';
import { AppNavigator, AuthNavigator } from './utils/Navigation';
import { createApolloClient } from './utils/api/apolloSetup'; // We will create this function
import { AuthProvider, useAuth } from './contexts/AuthContext';

export const App = () => {
  const client = createApolloClient(); // Pass accessToken to a function that creates Apollo Client

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? MyThemes.dark : MyThemes.light;

  const AuthNavigation = () => {
    const { isAuthenticated } = useAuth();

    return (
      <NavigationContainer theme={theme}>
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    );
  };

  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <AuthNavigation />
      </ApolloProvider>
    </AuthProvider>
  );
};

export default App;
