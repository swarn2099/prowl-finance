import React from 'react';
import { StyleSheet } from 'react-native';

export const ProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  transactionItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 5,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  transactionLogo: {
    width: '50%',
    height: '50%',
    borderRadius: 100,
    resizeMode: 'contain',
  },
  transactionDetails: {
    padding: 5,
  },
  merchantName: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'grey',
    fontSize: 12,
  },
  additionalDetails: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  transactionCategory: {
    fontSize: 8,
    color: '#666',
  },
  transactionDate: {
    fontSize: 10,
    color: '#666',
  },
  transactionAmount: {
    textAlign: 'center',
    fontSize: 17,
    color: '#000',
    fontWeight: '800',
    marginTop: 5,
  },
});

export default ProfileStyles;
