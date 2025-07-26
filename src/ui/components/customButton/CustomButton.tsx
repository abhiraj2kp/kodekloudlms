import Color from '@ui/constants/Color';
import { SCREEN_WIDTH, vw } from '@utils/dimensions';
import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type CustomButtonProps = {
  title: string;
  style: ViewStyle;
  onPress: Function;
  textStyle?: TextStyle;
};

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, style, title, textStyle }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[styles.container, style]}
      onPress={() => onPress()}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.container, style]}
        colors={['#23B0FF', '#2ECFFF']}
      >
        <Text style={[styles.textStyle, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: vw(50),
    alignSelf: 'center',
    borderRadius: vw(25),
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH - vw(32),
    marginTop: vw(12),
  },
  textStyle: {
    fontSize: 14,
    fontWeight: '800',
    color: Color.WHITE,
  },
});

export default CustomButton;
