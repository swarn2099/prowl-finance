import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { getUserWithTransactions } from '../utils/api/user.queries';
import ProfileHeader from '../components/ProfileHeader';
import TransactionTile from '../components/TransactionTile';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AccountsTab } from '../components/AccountTab';

const { height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 200; // Maximum height of the floating header
const TAB_BAR_HEIGHT = 60; // Height of the tab bar

const TransactionScreen = () => {
  const navigation = useNavigation();

  const scrollY = useRef(new Animated.Value(0)).current; // Use Animated.Value for smooth transitions
  const [activeTab, setActiveTab] = useState('transactions');

  const { loading, error, data } = useQuery(getUserWithTransactions);

  useEffect(() => {
    if (data && data.getUserById) {
      navigation.setOptions({ title: data.getUserById.name });
    }
  }, [data]);

  // Opacity for the header to fade it out
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  if (loading)
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text>Error loading transactions</Text>
      </View>
    );

  return (
    <View style={styles.safeArea}>
      <Animated.ScrollView
        style={{ flex: 1 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <ProfileHeader />
        </Animated.View>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'transactions' ? styles.activeTab : {},
            ]}
            onPress={() => setActiveTab('transactions')}
          >
            <FontAwesome
              name={
                activeTab === 'transactions' ? 'credit-card-alt' : 'credit-card'
              }
              size={24}
              color={activeTab === 'transactions' ? '#005EB8' : 'black'}
            />
            {/* <Text style={styles.tabText}>Transactions</Text> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' ? styles.activeTab : {}]}
            onPress={() => setActiveTab('posts')}
          >
            <Ionicons
              name={activeTab === 'posts' ? 'grid' : 'grid-outline'}
              size={24}
            />
            {/* <Text style={styles.tabText}>Posts</Text> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'accounts' ? styles.activeTab : {},
            ]}
            onPress={() => setActiveTab('accounts')}
          >
            {/* <Text style={styles.tabText}>Accounts</Text> */}
            <MaterialCommunityIcons
              name={
                activeTab === 'accounts' ? 'piggy-bank' : 'piggy-bank-outline'
              }
              size={24}
              color={activeTab === 'accounts' ? 'pink' : 'black'}
            />
          </TouchableOpacity>
        </View>
        {activeTab === 'transactions' && (
          <FlatList
            data={data?.getUserById.transactions}
            renderItem={({ item }) => <TransactionTile item={item} />}
            keyExtractor={(item) => `${item.transaction_id}`}
            numColumns={3}
            contentContainerStyle={styles.contentContainer}
          />
        )}
        {activeTab === 'accounts' && (
          <AccountsTab accounts={data?.getUserAccountsInfo} />
        )}
        {/* Repeat for other tabs as needed */}
      </Animated.ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: HEADER_MAX_HEIGHT,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  tab: {
    flex: 1, // This ensures that each tab button will take equal space
    alignItems: 'center', // Center the text inside the tab
    paddingBottom: 10, // Space below text
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#f5f5f5',
  },
  tabText: {
    color: '#000',
    fontSize: 16,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TransactionScreen;
