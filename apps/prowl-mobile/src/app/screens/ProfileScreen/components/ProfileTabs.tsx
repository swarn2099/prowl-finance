import React from 'react';
import { TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView as View } from '../../../components/ThemedComponents';
import { useTheme } from '@react-navigation/native';

export const ProfileTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const scheme = useColorScheme();

  return (
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
          color={
            activeTab === 'transactions'
              ? '#005EB8'
              : scheme === 'dark'
              ? '#ffffff'
              : '#000'
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'posts' ? styles.activeTab : {}]}
        onPress={() => setActiveTab('posts')}
      >
        <Ionicons
          name={activeTab === 'posts' ? 'grid' : 'grid-outline'}
          size={24}
          color={scheme === 'dark' ? '#ffffff' : '#000'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'accounts' ? styles.activeTab : {}]}
        onPress={() => setActiveTab('accounts')}
      >
        <MaterialCommunityIcons
          name={activeTab === 'accounts' ? 'piggy-bank' : 'piggy-bank-outline'}
          size={24}
          color={
            activeTab === 'accounts'
              ? 'pink'
              : scheme === 'dark'
              ? '#ffffff'
              : '#000'
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
});

export default ProfileTabs;
