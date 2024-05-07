import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';

const ThemedView = (props) => {
  const { colors } = useTheme();

  return (
    <View style={[{ backgroundColor: colors.background }, props.style]}>
      {props.children}
    </View>
  );
};

export { ThemedView };
