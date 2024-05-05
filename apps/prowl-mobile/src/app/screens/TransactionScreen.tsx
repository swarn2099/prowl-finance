/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView, // Import the Image component from react-native
} from 'react-native';
import { useQuery } from '@apollo/client';
import { getUserWithTransactions } from '../utils/api/user.queries';
import ProfileHeader from '../components/ProfileHeader';

import { ProfileStyles as styles } from '../styles/ProfileStyles';
import TransactionTile from '../components/TransactionTile';

export const TransactionScreen = () => {
  const { loading, error, data } = useQuery(getUserWithTransactions);

  if (loading) {
    return (
      <View>
        <Text testID="heading" role="heading">
          Loading...
        </Text>
      </View>
    );
  } else if (error) {
    return (
      <View>
        <Text testID="heading" role="heading">
          Error loading transactions
        </Text>
      </View>
    );
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}
    >
      <FlatList
        ListHeaderComponent={ProfileHeader}
        data={data.getUserById.transactions}
        renderItem={({ item }) => <TransactionTile item={item} />}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.grid}
      />
    </SafeAreaView>
  );
};

export default TransactionScreen;
