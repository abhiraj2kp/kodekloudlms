import Toast from 'react-native-toast-message';

const TOAST_OFFSET = 50;

/**
 * @interface TOAST_TYPE
 * @description Defined toaster types
 */
export const TOAST_TYPE = {
  SUCCESSTOAST: 'success',
  ERRORTOAST: 'error',
  INFOTOAST: 'info',
};

export const showToast = (type: 'success' | 'error' | 'info', message: string, title?: string) => {
  Toast.show({
    type: type,
    text2: title,
    text1: message,
    topOffset: TOAST_OFFSET,
    autoHide:true,
    visibilityTime : 5000,
    
    onPress: () => Toast.hide(),
  });
};
