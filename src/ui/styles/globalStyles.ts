import Color from '@ui/constants/Color';
import {vh, vw} from '@utils/dimensions';
import fonts from '@utils/fonts';
import {StyleSheet} from 'react-native';

export const globalStyle = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flex1: {
    flex: 1,
    backgroundColor: Color.PRIMARY,
  },
  justif: {
    justifyContent: 'space-between',
  },
  alignItem: {
    alignItems: 'center',
  },
  flexGrow: {
    flexGrow: 1,
  },
  width100: {
    width: '100%',
  },
  height100: {
    height: '100%',
  },
  basicImgStyle20: {
    width: vw(20),
    height: vh(20),
  },
  alignSelfEnd: {
    alignSelf: 'flex-end',
  },
  selectedformValue: {
    color: Color.BLACK,
    fontSize: vw(16),
    // lineHeight: vh(11),
    fontFamily: fonts.REGULAR,
  },
  flexRowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flip180: {
    transform: [{scaleX: -1}],
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  listEmptyCompText: {
    fontSize: vw(20),
    fontFamily: fonts.REGULAR,
    color: Color.WHITE,
    alignSelf: 'center',
  },
  centerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  basicImgStyle24: {
    width: vw(24),
    height: vh(24),
  },
});
