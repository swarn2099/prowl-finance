import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';

export const ProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#EFEFEF',
    marginHorizontal: 15,
  },
  moreIcon: {
    fontSize: 24,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  contentButton: {
    padding: 10,
    marginHorizontal: 5,
  },
  gridItem: {
    width: '33.33%',
    height: 150,
  },

  grid: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
});

export default ProfileStyles;
