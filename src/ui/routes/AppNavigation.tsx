import React from 'react';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import ScreenNames from '@utils/screenNames';
import CoursesList from '@ui/screens/home/courses/CoursesList';
import CourseDetail from '@ui/screens/home/courseDetail/CourseDetail';
import LessonDetail from '@ui/screens/home/lessonDetail/LessonDetail';
import SplashScreen from '@ui/screens/onboarding/splashScreen/SplashScreen';

/**
 * @description AppNavigation is a stack navigator that contains all the screens
 *              of the app. It uses native stack navigator and all the screens
 *              are wrapped in the header shown with the custom header style.
 * @returns {React.ReactElement} NativeStackNavigator containing all the screens of the app
 */

export type AppNavigationStackParamList = {
  Splash: undefined;
  CoursesList: undefined;
  CourseDetail: {
    courseId: string;
  };
  LessonDetail: {
    courseId: string;
    lessonId: string;
    hideCourseContent?: boolean;
  };
};

export type TNativeStackNavigationParamList =
  NativeStackNavigationProp<AppNavigationStackParamList>;

/**
 * @description Created a stack navigator for app navigations
 */
const Stack = createNativeStackNavigator<AppNavigationStackParamList>();

export const AppNavigation = (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      headerBackVisible: false,
      headerShadowVisible: false,
    }}
    initialRouteName={ScreenNames.Splash}
  >
    <Stack.Screen name={ScreenNames.Splash} component={SplashScreen} />
    <Stack.Screen name={ScreenNames.CoursesList} component={CoursesList} />
    <Stack.Screen
      name={ScreenNames.CourseDetail}
      options={{
        headerShown: true,
        headerBackVisible: true,
      }}
      component={CourseDetail}
    />
    <Stack.Screen
      name={ScreenNames.LessonDetail}
      options={{
        headerShown: true,
        headerBackVisible: true,
      }}
      component={LessonDetail}
    />
  </Stack.Navigator>
);
