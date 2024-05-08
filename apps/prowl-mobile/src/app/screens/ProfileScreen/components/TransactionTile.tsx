import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useColorScheme,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import { formatDate } from '../../../utils/utils';
import { useNavigation, useTheme } from '@react-navigation/native';
import { ThemedText } from '../../../components/ThemedComponents';

const categoryColors: any = {
  TRANSPORTATION: '#FF6347', // Tomato
  FOOD: '#FFD700', // Gold
  ENTERTAINMENT: '#DB7093', // PaleVioletRed
  SHOPPING: '#4682B4', // SteelBlue
  UTILITIES: '#32CD32', // LimeGreen
  HEALTH: '#FF4500', // OrangeRed
  DEFAULT: '#4682B4', // Grey
};

export const TransactionTile = ({ item, account }: any) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const colorScheme = useColorScheme(); // Detect theme preference

  const getShadowStyle = (category: string | number) => ({
    shadowColor:
      colorScheme === 'dark'
        ? '#000'
        : categoryColors[category] || categoryColors.DEFAULT,
    shadowOffset: { width: 1, height: 3.5 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8, // Default elevation for Android, simple shadow
  });
  const shadowStyle = getShadowStyle(item.personal_finance_category.primary);
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('TransactionDetails', {
          data: item,
          account: account,
        })
      }
    >
      <View
        style={[
          shadowStyle,
          styles.transactionItem,
          { backgroundColor: colors.card },
        ]}
      >
        <Image
          style={styles.transactionLogo}
          source={{
            uri: item.logo_url || item.personal_finance_category_icon_url,
          }}
        />
        <View style={styles.transactionDetails}>
          <Text style={styles.merchantName} numberOfLines={1}>
            {/* {item.name || item.merchant_name || 'Transaction'} */}
            {item.personal_finance_category.confidence_level === 'LOW'
              ? item.name
              : item.merchant_name || 'Transaction'}
          </Text>
          <View style={styles.additionalDetails}>
            <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
          </View>
          <ThemedText style={styles.transactionAmount}>
            ${item.amount.toFixed(2)}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 5,
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    minHeight: 125,
    minWidth: 125,
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
    fontWeight: '800',
    marginTop: 5,
  },
});

export default TransactionTile;
