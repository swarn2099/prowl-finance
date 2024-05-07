import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import CreditCard from './CreditCard';
import { FlashList } from '@shopify/flash-list';
import { ThemedText as Text } from '../../../components/ThemedComponents';
import { useTheme } from '@react-navigation/native';

export const AccountsTab = ({ accounts }) => {
  const { colors } = useTheme();
  const accountTypes = accounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }

    // Push the original account
    acc[account.type].push(account);

    // Push the same account multiple times for testing
    const numberOfDuplicates = 2; // Number of times you want to duplicate the data
    for (let i = 1; i <= numberOfDuplicates; i++) {
      acc[account.type].push({
        ...account,
        account_id: account.account_id + `_${i}`,
      }); // Modify the id to ensure key uniqueness
    }

    return acc;
  }, {});

  const [depositItemExpanded, setDepositItemExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.accountTypeContainer}>
        <Text style={styles.accountTypeTitle}>Credit Cards</Text>
        <FlashList
          data={accountTypes.credit}
          renderItem={({ item }) => <CreditCard account={item} />}
          keyExtractor={(item: any) => item.account_id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ padding: 10, paddingHorizontal: 5 }}
          estimatedItemSize={200}
          estimatedListSize={{ height: 100, width: 100 }}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />} // This creates a 10 pixel gap
        />
      </View>
      <View
        style={{
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
              <TouchableOpacity
                key={account.account_id}
                onPress={() => setDepositItemExpanded(!depositItemExpanded)}
                style={{
                  flexDirection: 'column',
                  borderRadius: 8,
                  backgroundColor: colors.card,
                  marginBottom: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                }}
              >
                <View style={styles.depositoryAccount}>
                  <Image
                    source={require('.../../../../../assets/depository.png')}
                    style={styles.accountImage}
                  />
                  <View style={styles.accountDetails}>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountBalance}>
                      Balance: ${account.current.toFixed(2)}
                    </Text>
                  </View>
                </View>

                {depositItemExpanded ? (
                  <View style={{ padding: 50 }}>
                    <Text style={styles.accountBalance}>
                      Type: {account.subtype}
                    </Text>
                    <Text style={styles.accountBalance}>
                      Available: ${account.available}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
  },
  accountDetails: {
    flex: 1,
  },
  accountTypeContainer: {
    padding: 10,
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
