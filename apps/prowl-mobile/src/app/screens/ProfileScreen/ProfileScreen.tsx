import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { useQuery } from '@apollo/client';
import { getUserWithTransactions } from '../../utils/api/user.queries';
import ProfileHeader from './components/ProfileHeader';
import TransactionTile from './components/TransactionTile';
import ProfileTabs from './components/ProfileTabs';
import { AccountsTab } from './components/AccountTab';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list'; // Import FlashList

const HEADER_MAX_HEIGHT = 175;

const ProfileScreen = () => {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { loading, error, data } = useQuery(getUserWithTransactions);
  const [activeTab, setActiveTab] = useState('transactions');

  useEffect(() => {
    if (data && data.getUserById) {
      navigation.setOptions({
        title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`,
      });
    }
  }, [data, activeTab]);

  const headerTransform = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, HEADER_MAX_HEIGHT],
          outputRange: [0, -HEADER_MAX_HEIGHT],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const renderHeader = () => (
    <Animated.View style={[styles.header, headerTransform]}>
      <ProfileHeader />
    </Animated.View>
  );

  const renderTabs = () => (
    <View style={styles.sticky}>
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );

  const renderItem = ({ item }) => <TransactionTile item={item} />;

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error loading transactions</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {renderHeader()}
        {renderTabs()}
        {activeTab === 'transactions' && (
          <View
            style={{
              padding: 10,
              minHeight: 200,
              width: Dimensions.get('screen').width,
            }}
          >
            <FlashList
              data={data?.getUserById.transactions}
              renderItem={renderItem}
              keyExtractor={(item) => item.transaction_id}
              numColumns={3}
              scrollEnabled={true} // Consider enabling scrolling for FlashList
              contentContainerStyle={{ padding: 10, paddingHorizontal: 5 }}
              estimatedItemSize={200}
            />
          </View>
        )}
        {activeTab === 'accounts' && (
          <AccountsTab accounts={data?.getUserAccountsInfo} />
        )}
        {/* Add other tab contents similarly */}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: HEADER_MAX_HEIGHT,
  },
  sticky: {
    zIndex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
