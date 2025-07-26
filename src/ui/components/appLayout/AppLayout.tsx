import React from 'react';
import Color from '@ui/constants/Color';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { vw } from '@utils/dimensions';

/**
 * @interface Props
 * @description Defined all required props
 */
interface Props {
  children: any;
}

/**
 * @function AppLayout
 * @param props
 * @description Created App layout component
 * @returns
 */
const AppLayout = (props: Props) => {
  return (
    <SafeAreaView style={styles.parentContainer}>
      <StatusBar
        hidden={false}
        translucent={true}
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
      />
      <View style={styles.childContainer}>{props.children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  childContainer: {
    flex: 1,
    paddingBottom: Platform.OS == 'android' ? vw(56) : 0,
  },
  parentContainer: {
    flex: 1,
    backgroundColor: Color.WHITE,
  },
});
export default React.memo(AppLayout);
