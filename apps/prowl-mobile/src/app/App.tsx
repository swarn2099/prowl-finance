/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { View, Text, useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Using Expo's vector icons for simplicity
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import { MyThemes } from './contexts/Themes/theme';
import { ThemeProvider } from './contexts/Themes/ThemeContext';

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
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        tabBarInactiveTintColor: 'gray',
        headerShadowVisible: false, // applied here
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#ffff',
        },
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#ffff',
        },
      })}
    >
      <>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Notifications" component={NotificationScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </>
    </Tab.Navigator>
  );
}

// Main App component
export const App = () => {
  const colorScheme = useColorScheme(); // Detect theme preference
  const theme = colorScheme === 'dark' ? MyThemes.dark : MyThemes.light;

  const client = new ApolloClient({
    uri: 'https://b580-68-251-49-18.ngrok-free.app/graphql',
    headers: {
      authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjZwa0FNazRpM2NpQnowUWlqc0FmeiJ9.eyJuaWNrbmFtZSI6InN3YXJuMjA5OSIsIm5hbWUiOiJzd2FybjIwOTlAZ21haWwuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzY3NTAyY2FhNWNmM2RmYTgwNmRlODVjNzA1ZGZjNDJmP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGc3cucG5nIiwidXBkYXRlZF9hdCI6IjIwMjQtMDUtMDdUMDU6MzU6MTUuMjQyWiIsImVtYWlsIjoic3dhcm4yMDk5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9kZXYteXV5Y2p6Z3MxeWVkbGp1aC51cy5hdXRoMC5jb20vIiwiYXVkIjoiNFhoM0lpeTBYWmgyUmRlcDkzRkhpQTRZSnFiRUJ1NHoiLCJpYXQiOjE3MTUwNjAxMTUsImV4cCI6MTcxNTA5NjExNSwic3ViIjoiYXV0aDB8NjYyYzk1MDBlOGNiMDA2ZDk2Mzc1YWRjIiwic2lkIjoiLWRFSUtUY0RLWkEtWkt0dDhfQnl0ajZYUDBFTzloS1AifQ.h9MhO7owlYqGNGPDZope_jUH5pAWEM1S0kwgz6s3G1V-72sbp-r7FjFRVjfV58M4NnmrBRVTJHFGDCEpM9oTSeiYqdr12-Y-kdIAG2CNfH2wBG7Woe7J6FjXDhP3FoLamsfvcVKI_2uifjRQjS-mGJuuoq2gbItOnAyZB4oXgZDomT1lQ69h0j8xsqKhyTt-oPk70YI_Lk3-sZ-quRY3CpTrZ0H9DPrINCrvNUks0Rn39sPKHG5SnidIF6N5YzrELBRJUS_c4VuYVuBSJcgGz_juQzib95T6LB1enE_Kgc5s2jkXSDXm24N6CCMmjdAFget9H7GWzSXOARP9-SexIQ',
    },
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <NavigationContainer theme={theme}>
        <BottomTabs />
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
