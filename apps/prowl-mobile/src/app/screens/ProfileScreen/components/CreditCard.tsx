import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { formatDate } from '../../../utils/utils';

const CreditCard = ({ account }: any) => {
  console.log('CreditCar: ', account.account_id);
  // Helper function to format the card number
  const formatCardNumber = (mask) => {
    return mask.slice(-4);
  };

  const flipAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  const startFlipAnimation = () => {
    setIsSensitive(!isSenestive);
    flipAnim.setValue(0);
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const interpolatedFlip = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '0deg'],
  });

  const scale = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.8, 1],
  });

  // Dynamic opacity to hide the card at the midpoint of the flip
  const opacity = flipAnim.interpolate({
    inputRange: [0, 0.55, 0.55, 1],
    outputRange: [1, 1, 0, 1], // Card is fully visible except between 0.45 and 0.55
  });

  const [isSenestive, setIsSensitive] = useState(false);
  const renderCardBack = () => {
    return (
      <View style={styles.cardBackContainer}>
        <Text style={styles.cardBackText}>
          Last Statement Balance: ${account.last_statement_balance.toFixed(2)}
        </Text>
        <Text style={styles.cardBackText}>
          Payment Due By: {formatDate(account.next_payment_due_date)}
        </Text>
      </View>
    );
  };
  return (
    <TouchableOpacity
      key={account.account_id}
      onPress={startFlipAnimation}
      activeOpacity={0.89} // default is .2
    >
      <Animated.View
        style={[
          {
            transform: [{ rotateY: interpolatedFlip }, { scale: scale }],
            opacity: opacity, // Apply the dynamic opacity based on the animation progress
          },
        ]}
      >
        {isSenestive ? (
          renderCardBack()
        ) : (
          <View style={styles.cardContainer}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}
              >
                <Image
                  source={require('../../../../../assets/chase-logo.png')}
                  style={styles.logo}
                />
                <Text style={styles.cardName}>{account.name}</Text>
              </View>
              <Text style={styles.balance}>${account.current.toFixed(2)}</Text>
            </View>
            <View style={{ padding: 10, marginTop: 10 }}>
              <View style={styles.topRow}>
                <Image
                  source={require('../../../../../assets/card-chip.png')}
                  style={styles.chip}
                />
              </View>
              <Text style={styles.cardNumber}>
                XXXX XXXX XXXX {formatCardNumber(account.mask)}
              </Text>
            </View>

            <Text style={styles.cardLimit}>
              Limit: ${account.limit ? account.limit : 'N/A'}
            </Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#0F4C81', // Dark blue background
    borderRadius: 10,
    padding: 20,
    minHeight: 150, // Ensure there's enough space for all elements
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Space elements evenly
    marginTop: 10, // Space from top or elements above
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },
  chip: {
    width: 40,
    height: 30,
    marginBottom: 10,
    marginLeft: 10,
  },
  cardName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginTop: 10, // Space from top or elements above
  },
  balance: {
    fontSize: 23,
    fontWeight: '800',
    color: '#fff',
  },
  cardNumber: {
    fontSize: 14,
    color: '#fff',
    letterSpacing: 8,
  },
  cardLimit: {
    alignSelf: 'flex-end',
    fontSize: 16,
    color: '#fff',
    marginTop: 10, // Margin top to separate from the number
  },
  cardBackContainer: {
    backgroundColor: '#0F4C81',
    borderRadius: 10,
    padding: 20,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBackText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default CreditCard;
