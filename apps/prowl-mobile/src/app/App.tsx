/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { View, Text, useColorScheme, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; // Using Expo's vector icons for simplicity
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import TransactionScreen from './screens/TransactionScreen/TransactionScreen'; // Assuming this is the path
import { NavigationContainer } from '@react-navigation/native';
import { MyThemes } from './contexts/Themes/theme';
import { ThemeProvider } from './contexts/Themes/ThemeContext';
import FeedScreen from './screens/FeedScreen/FeedScreen';
import * as Linking from 'expo-linking';
import { LinkingOptions } from '@react-navigation/native';

// Define the linking types based on your navigation structure
type LinkingConfig = LinkingOptions<RootStackParamList>;

interface RootStackParamList {
  HomeTabs: undefined; // Assuming HomeTabs is a navigator itself
  TransactionDetails: undefined; // This could have params, specify them if necessary
}

const linking: LinkingConfig = {
  prefixes: ['app://', 'exp://192.168.1.124:8081'],
  config: {
    screens: {
      HomeTabs: {
        screens: {
          Home: 'home',
        },
      },
      TransactionDetails: 'transactiondetails', // Example path, adjust if necessary
    },
  },
};
function SearchScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Search!</Text>
    </View>
  );
}

function NotificationScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function BottomTabs() {
  const colorScheme = useColorScheme(); // Detect theme preference
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'car';
          } else if (route.name === 'Notifications') {
            iconName = 'book';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarLabel: () => null, // This hides the label
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        tabBarInactiveTintColor: 'gray',
        headerShadowVisible: false, // Applied here
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#ffff',
        },
      })}
    >
      <Tab.Screen name="Home" component={FeedScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

function MainStackNavigator() {
  const colorScheme = useColorScheme(); // Detect theme preference

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={BottomTabs} />
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionScreen}
        options={{
          headerShown: true, // Enable the header only for this screen
          headerTitle: 'Transaction Details', // Optional: set a title or use the default
          headerBackTitleVisible: false, // Optional: hides the back button title (iOS)
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000', // Optional: set the color of the back button and title
          headerShadowVisible: false, // Optional: hides the shadow below the header
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff', // Optional: styles the background of the header
          },
        }}
      />
    </Stack.Navigator>
  );
}

// Main App component
export const App = () => {
  const client = new ApolloClient({
    uri: 'https://a790cbff8224.ngrok.app/graphql',
    headers: {
      authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjZwa0FNazRpM2NpQnowUWlqc0FmeiJ9.eyJuaWNrbmFtZSI6InN3YXJuMjA5OSIsIm5hbWUiOiJzd2FybjIwOTlAZ21haWwuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzY3NTAyY2FhNWNmM2RmYTgwNmRlODVjNzA1ZGZjNDJmP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGc3cucG5nIiwidXBkYXRlZF9hdCI6IjIwMjQtMDUtMDhUMDI6MjE6MTQuMjUyWiIsImVtYWlsIjoic3dhcm4yMDk5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9kZXYteXV5Y2p6Z3MxeWVkbGp1aC51cy5hdXRoMC5jb20vIiwiYXVkIjoiNFhoM0lpeTBYWmgyUmRlcDkzRkhpQTRZSnFiRUJ1NHoiLCJpYXQiOjE3MTUxMzQ4NzQsImV4cCI6MTcxNTE3MDg3NCwic3ViIjoiYXV0aDB8NjYyYzk1MDBlOGNiMDA2ZDk2Mzc1YWRjIiwic2lkIjoiLWRFSUtUY0RLWkEtWkt0dDhfQnl0ajZYUDBFTzloS1AifQ.FSULcnZx8eGVH-UWfO3sXYDI8oP-mRBHm3aHSEc664xf4rCBwVy5p4LQhhHxdhz1uCPcmH8dhwTQNFh2vIaC_8stj0fK2IotN3tL6AeH3MqQ4aFdiEdwurKZp5ujISODwNU5La_Qb8hEHN1XfxjkbyG4iRrgidzZqViuJfiXzyNN5hgYFReq9xBKYTdxABD8K6VWUgJsb6EeDNod9AOX_bakAW53A2gSCHdLMm-detUayi0yVROgdODh_g9KmI3mRlyIj7Ny-ReRYeKkMnNj-z_vrZTaF3pTPuirg4j0DcE1JU327lZbDYjXAiXGw5yf6PQPrzZEJcIlLoa7pbwcAw',
    },
    cache: new InMemoryCache(),
  });

  const colorScheme = useColorScheme(); // Detect theme preference
  const theme = colorScheme === 'dark' ? MyThemes.dark : MyThemes.light;

  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <NavigationContainer theme={theme} linking={linking}>
          <MainStackNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
