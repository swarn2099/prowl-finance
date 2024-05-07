import { useTheme } from '@react-navigation/native';
import { Text } from 'react-native';

const ThemedText = (props) => {
  const { colors } = useTheme();
  return (
    <Text style={[{ color: colors.text }, props.style]}>{props.children}</Text>
  );
};

export { ThemedText };
