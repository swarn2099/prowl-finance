import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';

export const AccountsTab = ({ accounts }) => {
  const accountTypes = accounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {});

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

  return (
    <View style={styles.container}>
      {accountTypes.credit && (
        <View style={[styles.accountTypeContainer, { padding: 10 }]}>
          <Text style={styles.accountTypeTitle}>Credit Cards</Text>
          {accountTypes.credit.map((account) => {
            console.log(account);
            return (
              <TouchableOpacity
                key={account.account_id}
                onPress={startFlipAnimation}
                activeOpacity={0.89} // default is .2
              >
                <Animated.View
                  style={[
                    styles.creditCard,
                    {
                      transform: [
                        { rotateY: interpolatedFlip },
                        { scale: scale },
                      ],
                      opacity: opacity, // Apply the dynamic opacity based on the animation progress
                    },
                  ]}
                >
                  <Image
                    source={require('../../../assets/credit-card-background.png')}
                    style={styles.cardBackground}
                  />
                  {isSenestive ? (
                    <>
                      <Text style={styles.cardName}>
                        {account.institution_name}
                      </Text>
                      <Text style={styles.cardBalance}>
                        Balance: ${account.last_statement_balance}
                      </Text>
                      <Text style={styles.cardLimit}>
                        Pay by: {account.next_payment_due_date}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.cardNumber}>
                        {formatCardNumber(account.mask)}
                      </Text>
                      <Text style={styles.cardName}>{account.name}</Text>
                      <Text style={styles.cardBalance}>
                        Balance: ${account.current.toFixed(2)}
                      </Text>
                      <Text style={styles.cardLimit}>
                        Limit: $
                        {account.limit ? account.limit.toFixed(2) : 'N/A'}
                      </Text>
                    </>
                  )}
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      <View
        style={{
          backgroundColor: '#fff',
          padding: 10,
          paddingTop: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        {accountTypes.depository && (
          <View style={styles.accountTypeContainer}>
            <Text style={styles.accountTypeTitle}>Depository Accounts</Text>
            {accountTypes.depository.map((account) => (
              <View style={styles.depositoryAccount} key={account.account_id}>
                <Image
                  source={require('../../../assets/depository.png')}
                  style={styles.accountImage}
                />
                <View style={styles.accountDetails}>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.accountBalance}>
                    Balance: ${account.current.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const formatCardNumber = (number) => {
  return number.replace(/.(?=.{4})/g, '*'); // replaces all but last 4 digits with *
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    backgroundColor: '#F7F7F7',
  },
  accountDetails: {
    flex: 1,
  },
  accountTypeContainer: {
    marginBottom: 20,
  },
  accountTypeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  creditCard: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#5271FF',
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    backfaceVisibility: 'hidden', // Hides the back face of the card during the flip
    maxHeight: 200,
    aspectRatio: 1.5,
  },
  cardBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 8,
    opacity: 0.3,
  },
  cardNumber: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  cardName: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  cardBalance: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  cardLimit: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  depositoryAccount: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
  },
  accountImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 14,
    color: '#666',
  },
});

export default AccountsTab;
