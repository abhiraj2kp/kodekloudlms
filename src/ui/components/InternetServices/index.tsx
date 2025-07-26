import { useEffect, useRef, memo } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import { showToast } from '@ui/constants/Toaster.service';

/**
 * @interface Props
 * @description Defined all required props
 */
interface Props {}

/**
 * @function InernetService
 * @param props
 * @description Created a internet listener componetn
 * @returns JSX
 */
function InernetServices(props: Props) {
  const { isConnected } = useNetInfo();
  const internetStatus = useRef<boolean | null>(null);

  /**
   * @function useEffect
   * @description Created a intenet event listener and check the internet status
   */
  useEffect(() => {
    if (isConnected == null) {
      return;
    }
    if (internetStatus.current === null) {
      internetStatus.current = isConnected ?? false;
    }
    if (isConnected && !internetStatus.current) {
      showToast('success', `You're connected to the internet.`, '');
      internetStatus.current = true;
    } else if (!isConnected && internetStatus.current) {
      showToast('error', `No Internet Connection.`, '');
      internetStatus.current = false;
    }
  }, [isConnected]);

  return null;
}
export default memo(InernetServices);
