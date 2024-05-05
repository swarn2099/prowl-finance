import React from 'react';
import { View, Text, Image } from 'react-native';
import { format, parseISO } from 'date-fns'; // For formatting dates
import { ProfileStyles as styles } from '../styles/ProfileStyles';

const categoryColors: any = {
  TRANSPORTATION: '#FF6347', // Tomato
  FOOD: '#FFD700', // Gold
  ENTERTAINMENT: '#DB7093', // PaleVioletRed
  SHOPPING: '#4682B4', // SteelBlue
  UTILITIES: '#32CD32', // LimeGreen
  HEALTH: '#FF4500', // OrangeRed
  DEFAULT: '#808080', // Grey
};

const getShadowStyle = (category: string | number) => ({
  shadowColor: categoryColors[category] || categoryColors.DEFAULT,
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 8, // Default elevation for Android, simple shadow
});

export const TransactionTile = ({ item }: any) => {
  const shadowStyle = getShadowStyle(item.personal_finance_category.primary);
  console.log(item.categories.at(0).category);

  return (
    <View style={[shadowStyle, styles.transactionItem]}>
      <Image
        style={styles.transactionLogo}
        source={{
          uri: item.logo_url || item.personal_finance_category_icon_url,
        }}
      />
      <View style={styles.transactionDetails}>
        <Text style={styles.merchantName} numberOfLines={1}>
          {item.merchant_name || 'Transaction'}
        </Text>
        <View style={styles.additionalDetails}>
          <Text style={styles.transactionCategory}>
            {item.categories.at(0).category}
          </Text>
          {/* <Text style={styles.transactionDate}>{item.date}</Text> */}
        </View>
        <Text style={styles.transactionAmount}>${item.amount.toFixed(2)}</Text>
      </View>
    </View>
  );
};

export default TransactionTile;
