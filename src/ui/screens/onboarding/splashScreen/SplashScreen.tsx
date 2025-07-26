import React from 'react';
import Images from '@ui/assets/image';
import { vw } from '@utils/dimensions';
import ScreenNames from '@utils/screenNames';
import { StyleSheet, View, Animated } from 'react-native';
import AppLayout from '@ui/components/appLayout/AppLayout';
import useAppNavigation from '@ui/hooks/UseAppNavigation';

const SplashScreen = () => {
  const navigation = useAppNavigation();

  setTimeout(() => {
    navigation.navigate(ScreenNames.CoursesList);
  }, 3000);

  React.useEffect(() => {
    Animated.timing(imageScale, {
      toValue: 2,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  const imageScale = new Animated.Value(0);

  return (
    <AppLayout>
      <View style={styles.splashContainer}>
        <Animated.Image
          source={Images.splashLogo}
          style={[
            styles.imageStyle,
            {
              transform: [{ scale: imageScale }],
            },
          ]}
          resizeMethod="auto"
          resizeMode="contain"
        />
      </View>
    </AppLayout>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: vw(120),
    height: vw(120),
  },
  appText: {
    fontSize: 16,
  },
});
