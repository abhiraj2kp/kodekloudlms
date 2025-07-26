// hooks/useAppNavigation.js
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {StackActions, CommonActions} from '@react-navigation/native';

/**
 * A unified navigation hook that wraps common navigation actions.
 * Usage:
 * const nav = useAppNavigation();
 * nav.push('ScreenName', { id: 1 });
 * nav.navigate('ScreenName', { id: 2 });
 * nav.replace('ScreenName', { id: 3 });
 * nav.goBack();
 * nav.pop(2);
 * nav.reset({ index: 0, routes: [{ name: 'Home' }] });
 */
export default function useAppNavigation() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return {
    // Pushes a new screen onto the stack
    push: (screen: string, params?: object) =>
      navigation.dispatch(StackActions.push(screen, params)),

    // Navigates to a screen (and brings existing screen to front if already mounted)
    navigate: (screen: string, params?: object) =>
      navigation.navigate(screen, params),

    // Replaces current screen with a new one
    replace: (screen: string, params?: object) =>
      navigation.dispatch(StackActions.replace(screen, params)),

    // Goes back one screen
    goBack: () => navigation.goBack(),

    // Pops n screens from the stack
    pop: (count = 1) => navigation.dispatch(StackActions.pop(count)),

    // Resets the navigation state entirely (use with caution)
    reset: ({
      index = 0,
      routes,
    }: {
      index?: number;
      routes: Array<{name: string; params?: object}>;
    }) =>
      navigation.dispatch(
        CommonActions.reset({
          index,
          routes, // e.g. [{ name: 'Home' }]
        }),
      ),
  };
}
