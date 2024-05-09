import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MyThemes } from './contexts/Themes/theme';
import { ThemeProvider } from './contexts/Themes/ThemeContext';
import NavigationComponent from './utils/Navigation';
import { useAuth } from './contexts/AuthContext'; // Make sure this path is correct
import { createApolloClient } from './utils/api/apolloSetup'; // We will create this function

export const App = () => {
  const client = createApolloClient(); // Pass accessToken to a function that creates Apollo Client

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? MyThemes.dark : MyThemes.light;

  return (
    <ApolloProvider client={client}>
      <NavigationContainer theme={theme}>
        <NavigationComponent />
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
