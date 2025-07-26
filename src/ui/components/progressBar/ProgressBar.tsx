import Color from '@ui/constants/Color';
import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';

interface ProgressBarProps {
  height?: number;
  progress: number;
  style?: ViewStyle;
  fillColor?: string;
  borderRadius?: number;
  backgroundColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  style,
  progress,
  height = 6,
  borderRadius = 4,
  fillColor = Color.BLUE_3,
  backgroundColor = Color.GRAY,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      duration: 300,
      toValue: progress,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor,
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: fillColor,
            width: widthInterpolated,
            borderRadius,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});

export default ProgressBar;
