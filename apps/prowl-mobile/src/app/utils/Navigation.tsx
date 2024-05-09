import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useColorScheme } from 'react-native';
import PlaidLinkScreen from '../screens/PlaidLinkScreen/PlaidLinkScreen';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import TransactionScreen from '../screens/TransactionScreen/TransactionScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import FeedScreen from '../screens/FeedScreen/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import AuthScreen from '../screens/AuthScreen.tsx/AuthScreen';
import { useAuth0 } from 'react-native-auth0';

export const NavigationComponent = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const BottomTabs = () => {
    const navigation = useNavigation();
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

            return (
              <Ionicons name={iconName as any} size={size} color={color} />
            );
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
        <Tab.Screen name="Search" component={FeedScreen} />
        <Tab.Screen name="Notifications" component={FeedScreen} />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerRightContainerStyle: {
              paddingRight: 10,
            },
            headerRight: () => (
              <Ionicons
                onPress={() => navigation.navigate('SettingsScreen')}
                name="settings"
                size={24}
                color={colorScheme === 'dark' ? '#fff' : '#000'}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

  const colorScheme = useColorScheme(); // Detect theme preference

  const { authorize, clearSession, user, error, isLoading } = useAuth0();
  const loggedIn = user !== undefined && user !== null;

  if (!loggedIn) {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

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
      <Stack.Screen
        name="PlaidLinkScreen"
        component={PlaidLinkScreen}
        options={{
          headerShown: true, // Enable the header only for this screen
          headerTitle: 'Link your Accounts', // Optional: set a title or use the default
          headerBackTitleVisible: false, // Optional: hides the back button title (iOS)
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000', // Optional: set the color of the back button and title
          headerShadowVisible: false, // Optional: hides the shadow below the header
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff', // Optional: styles the background of the header
          },
        }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerShown: true, // Enable the header only for this screen
          headerTitle: 'Settings', // Optional: set a title or use the default
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
};

export default NavigationComponent;
