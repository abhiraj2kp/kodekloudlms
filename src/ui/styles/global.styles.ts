import { StyleSheet } from 'react-native';

import { vh, vw } from '@utils/dimensions';
import spacings from './spacings';

export const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: vw(spacings.space16),
  },
  flex1: {
    flex: 1,
  },
  alignItem: {
    alignItems: 'center',
  },
  flexPadding: {
    flex: 1,
    paddingHorizontal: vw(16),
  },
  flexGrow: {
    flexGrow: 1,
  },
  screenContainer: {
    flexGrow: 1,
    paddingHorizontal: spacings.space16,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  backArrow: {
    width: vw(24),
    height: vw(24),
    zIndex: 10,
  },
  screenTitle: {
    marginTop: vh(spacings.space40),
    fontSize: vw(spacings.size24),
    marginBottom: spacings.space12,
    lineHeight: vw(spacings.space32),
  },
  marginTop21: {
    marginTop: spacings.space21,
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
