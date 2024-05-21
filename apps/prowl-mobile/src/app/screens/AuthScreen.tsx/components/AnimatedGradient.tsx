import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const AnimatedGradient = () => {
  const colorAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnimation, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnimation, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [colorAnimation]);

  const color1 = colorAnimation.interpolate({
    inputRange: [0, 2],
    outputRange: ['#833AB4', '#FDCB5D'],
    extrapolate: 'clamp',
  });

  const color2 = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FD1D1D', '#F77737'],
    extrapolate: 'clamp',
  });

  const color3 = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F77737', '#FD1D1D'],
    extrapolate: 'clamp',
  });

  const color4 = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FD1D1D', '#FFFFFF'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={styles.gradientContainer}>
      <AnimatedLinearGradient
        colors={['#833AB4', color1, color2, color3, '#F77737', '#FFFFFF']}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height / 2,
  },
});

export default AnimatedGradient;
