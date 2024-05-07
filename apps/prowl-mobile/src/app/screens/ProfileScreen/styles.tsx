import { StyleSheet } from 'react-native';

const HEADER_MAX_HEIGHT = 200; // Maximum height of the floating header

export const ProfileTabsStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: HEADER_MAX_HEIGHT,
    backgroundColor: '#fff',
    justifyContent: 'center',
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
