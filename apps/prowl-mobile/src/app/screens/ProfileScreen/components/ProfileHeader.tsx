import React from 'react';
import { Image, StyleSheet } from 'react-native';

import {
  ThemedText as Text,
  ThemedView as View,
} from '../../../components/ThemedComponents';
export const ProfileHeader = () => {
  return (
    <>
      <View style={styles.headerContainer}>
        <Image
          style={styles.profilePic}
          source={{
            uri: 'https://wallpapers.com/images/hd/cool-profile-picture-87h46gcobjl5e4xu.jpg',
          }}
        />
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>40</Text>
            <Text>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>450</Text>
            <Text>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>426</Text>
            <Text>Following</Text>
          </View>
        </View>
      </View>
      <Text style={styles.name}>Swarn Singh</Text>
      <Text style={styles.bio}>@swarnsingh</Text>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
    marginTop: 10,
  },
  bio: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    marginBottom: 10,
  },
});

export default ProfileHeader;
