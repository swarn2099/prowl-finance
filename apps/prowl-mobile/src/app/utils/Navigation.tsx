// Navigation.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import FeedScreen from '../screens/FeedScreen/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen/SettingsScreen';
import PlaidLinkScreen from '../screens/PlaidLinkScreen/PlaidLinkScreen';
import TransactionScreen from '../screens/TransactionScreen/TransactionScreen';
import WalletScreen from '../screens/WalletScreen/WalletScreen';
import AuthScreen from '../screens/AuthScreen.tsx/AuthScreen';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabs = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          if (route.name === 'Home') {
            icon = <Ionicons name="home" size={size} color={color} />;
          } else if (route.name === 'Wallet') {
            icon = (
              <FontAwesome6
                name="money-bill-transfer"
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'Profile') {
            icon = <Ionicons name="person" size={size} color={color} />;
          }

          return icon;
        },
        tabBarLabel: () => null,
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#ffff',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#ffff',
        },
      })}
    >
      <Tab.Screen name="Home" component={FeedScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
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

const AppNavigator = () => {
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={BottomTabs} />
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionScreen}
        options={{
          headerShown: true,
          headerTitle: 'Transaction Details',
          headerBackTitleVisible: false,
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
        }}
      />
      <Stack.Screen
        name="PlaidLinkScreen"
        component={PlaidLinkScreen}
        options={{
          headerShown: true,
          headerTitle: 'Link your Accounts',
          headerBackTitleVisible: false,
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
        }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Settings',
          headerBackTitleVisible: false,
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AuthScreen" component={AuthScreen} />
  </Stack.Navigator>
);

export { AppNavigator, AuthNavigator };
