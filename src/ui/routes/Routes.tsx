import { Linking } from 'react-native';
import React, { useEffect } from 'react';
import ScreenNames from '@utils/screenNames';
import { AppNavigation } from './AppNavigation';
import { navigationRef } from '@utils/navigationService';
import { NavigationContainer } from '@react-navigation/native';

/**
 * @description App Screen navigations container
 * @function Routes
 * @returns JSX
 */

// kodekloud://course/crash-course-kubernetes-for-absolute-beginners/lesson/81ed63bb-1556-4723-857b-99b4fcda7c20

const linking = {
  prefixes: ['kodekloud://'],
  config: {
    screens: {
      CoursesList: 'courses',
      CourseDetail: 'course/:courseId',
      LessonDetail: 'course/:courseId/lesson/:lessonId',
    },
  },
};

export const Routes = () => {
  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      if (!url) return;

      const route = url.replace(/.*?:\/\//g, '');
      const parts = route.split('/');
      console.log('handleDeepLink', route, parts);
      if (parts[0] === 'courses') {
        navigationRef.current.push(ScreenNames.CoursesList);
      } else if (parts[0] === 'course' && parts.length === 2) {
        navigationRef.current.push(ScreenNames.CourseDetail, { courseId: parts[1] });
      } else if (parts[0] === 'course' && parts.length === 4 && parts[2] === 'lesson') {
        const params = {
          courseId: parts[1],
          lessonId: parts[3],
        };
        navigationRef.current.push(ScreenNames.LessonDetail, params);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      {AppNavigation}
    </NavigationContainer>
  );
};
