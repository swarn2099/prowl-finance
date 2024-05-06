/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import TransactionScreen from './screens/TransactionScreen';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Using Expo's vector icons for simplicity

// Define a common style for all screens
const screenStyle = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Set the background color to white
  },
});

// Dummy screen components
function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

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

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'car';
          } else if (route.name === 'AddPost') {
            iconName = 'add-circle';
          } else if (route.name === 'Notifications') {
            iconName = 'book';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarLabel: () => null, // This hides the label

        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        headerShadowVisible: false, // applied here
      })}
    >
      <>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Notifications" component={NotificationScreen} />
        <Tab.Screen name="Profile" component={TransactionScreen} />
      </>
    </Tab.Navigator>
  );
}

// Main App component
export const App = () => {
  // Initialize Apollo Client
  const client = new ApolloClient({
    uri: 'https://07d8-68-251-49-18.ngrok-free.app/graphql',
    headers: {
      authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjZwa0FNazRpM2NpQnowUWlqc0FmeiJ9.eyJuaWNrbmFtZSI6InN3YXJuMjA5OSIsIm5hbWUiOiJzd2FybjIwOTlAZ21haWwuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzY3NTAyY2FhNWNmM2RmYTgwNmRlODVjNzA1ZGZjNDJmP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGc3cucG5nIiwidXBkYXRlZF9hdCI6IjIwMjQtMDUtMDZUMDQ6NTE6NTcuMjMxWiIsImVtYWlsIjoic3dhcm4yMDk5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9kZXYteXV5Y2p6Z3MxeWVkbGp1aC51cy5hdXRoMC5jb20vIiwiYXVkIjoiNFhoM0lpeTBYWmgyUmRlcDkzRkhpQTRZSnFiRUJ1NHoiLCJpYXQiOjE3MTQ5NzExMTgsImV4cCI6MTcxNTAwNzExOCwic3ViIjoiYXV0aDB8NjYyYzk1MDBlOGNiMDA2ZDk2Mzc1YWRjIiwic2lkIjoiLWRFSUtUY0RLWkEtWkt0dDhfQnl0ajZYUDBFTzloS1AifQ.IOgDgGtxmDlvb3PD3dvFWg9KLSxDGyDT8VKRZwM_Y1OX0yIf2UMXNd-KU3ufLIbtASlUzuKWBXXn-Loak9I6WEofFbIzAgL5PQlAPx0Ac5sevFfh_MI_09NtK_qYUJF4NPORD3pgWNb0kK2d3poqJLk_pcYsJoYbSv9Ih9DyPusP804HFaCgJiBBu9WROrNJcmmku1stpO4OtOPgHlCwbErJsZt4dm_40TMCqQTMwKMnswI7fMBNBUIkhrw4mC8wbsqCJ4Mrn00XCNkoDWKnlQEnhrSthoxAOYusEbGdNmt9_20k9qynrC5ANSQMqT9emprmkud2zjzvy2j9te50jQ',
    },
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      {/* <TransactionScreen /> */}
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
