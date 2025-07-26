import Color from '@ui/constants/Color';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.WHITE10,
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    marginHorizontal: 16,
  },
  title: {
    fontSize: 48,

    paddingBottom: 16,
    color: '#000',
  },
  subtitle: {
    fontSize: 32,
    color: '#000',
  },
  error: {
    paddingVertical: 16,
  },
  button: {
    backgroundColor: Color.PRIMARY,
    borderRadius: 50,
    padding: 16,
  },
  buttonText: {
    color: Color.WHITE,
    textAlign: 'center',
  },
});

export default styles;
