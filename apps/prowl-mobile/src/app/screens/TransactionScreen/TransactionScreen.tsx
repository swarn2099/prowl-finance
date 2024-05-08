import React, { useEffect } from 'react';
import {
  ThemedText as Text,
  ThemedView as View,
} from '../../components/ThemedComponents';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, Image } from 'react-native';
import CreditCard from '../ProfileScreen/components/CreditCard';

export const TransactionScreen = ({ route }) => {
  const { data, account } = route.params;
  const transactionName =
    data.personal_finance_category.confidence_level === 'LOW'
      ? data.name
      : data.merchant_name || 'Transaction';

  useEffect(() => {
    console.log('TransactionScreen: ', account);
  }, [route]);

  return (
    <ScrollView>
      <View
        style={{
          padding: 20,
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingRight: 10,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <Image
              style={{
                width: 70,
                height: 70,
                borderRadius: 100,
                resizeMode: 'contain',
                marginRight: 10,
              }}
              source={{
                uri: data.logo_url || data.personal_finance_category_icon_url,
              }}
            />
            <Text style={{ fontWeight: 500, fontSize: 30 }}>
              {transactionName}
            </Text>
          </View>
          <Text style={{ fontWeight: 600, fontSize: 30 }}>${data.amount}</Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginTop: 30,
            padding: 5,
          }}
        >
          <CreditCard account={account} />
        </View>
      </View>
    </ScrollView>
  );
};

export default TransactionScreen;
