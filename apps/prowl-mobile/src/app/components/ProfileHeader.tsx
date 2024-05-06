import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import { ProfileStyles as styles } from '../styles/ProfileStyles';

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
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text>Following</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Message</Text>
        </TouchableOpacity>
      </View> */}
    </>
  );
};

export default ProfileHeader;
