import React from 'react';
import { useAppDispatch, useAppSelector } from '@ui/hooks';
import { homeAction } from '@ui/slices/homeSlice/homeSlice';
import { getCoursesDetails, getCoursesList } from '@ui/slices/homeSlice/homeThunk';
import { useNetInfo } from '@react-native-community/netinfo';
import { showToast } from '@ui/constants/Toaster.service';
import { mmkvStorage } from '@ui/store/store';
import { STORAGE_TYPE } from '@data/models/globalModel';
import { CourseDetails } from '@data/models/homeModel';

export class CoursePayload {
  page: number = 1;
}
export const useCourseViewModel = () => {
  const dispatch = useAppDispatch();
  const { isConnected } = useNetInfo();
  const [errorCourseDetails, setErrorCourseDetails] = React.useState('');
  const [expendModuleId, setExpendModuleId] = React.useState('');
  const [isLoadMore, setLoadMore] = React.useState<boolean>(false);
  const [isApiLoading, setApiLoading] = React.useState<boolean>(false);
  const [isRefreshing, setRefreshing] = React.useState<boolean>(false);
  const [courseCompletion, setCourseCompletion] = React.useState<any>({});
  const courseData = useAppSelector((store) => store.homeReducer.courseData);

  /**
   * Fetch data from API
   * @param {object} data - API request params, including pageNo
   * @param {'initial' | 'refresh' | 'loadMore'} type - Type of action to fetch data
   */
  const fetchCourseList = async (
    data: {
      page: number;
    },
    type: 'initial' | 'refresh' | 'loadMore' = 'initial',
  ) => {
    try {
      if (type === 'initial') setApiLoading(true);
      if (type === 'refresh') setRefreshing(true);
      if (type === 'loadMore') setLoadMore(true);
      const apiPayload = { payload: data };
      const apiResult = await dispatch(getCoursesList(apiPayload)).unwrap();
      if (apiResult) {
        dispatch(homeAction.updateHomeCourses(apiResult));
      }
    } catch (error: any) {
      console.log('errror', error);
    } finally {
      setApiLoading(false);
      setRefreshing(false);
      setLoadMore(false);
    }
  };

  /**
   * Fetch data from API
   * @param {object} data - API request params, including pageNo
   * @param {'initial' | 'refresh' | 'loadMore'} type - Type of action to fetch data
   */
  const fetchCourseDetails = async (courseId: string) => {
    try {
      setApiLoading(true);
      const apiPayload = {
        payload: {
          courseId: courseId,
        },
      };
      const apiResult = await dispatch(getCoursesDetails(apiPayload)).unwrap();
      if (apiResult) {
        dispatch(homeAction.updateCourseDetails({ courseId: courseId, details: apiResult }));
      }
      return apiPayload;
    } catch (error: any) {
      console.log('errror', error);
      setErrorCourseDetails(
        error.type == '404' ? 'Invalid Input' : error.message || 'No Lesson Found',
      );
    } finally {
      setApiLoading(false);
    }
  };

  /**
   * Trigger pull-to-refresh action
   * @param {object} data - API request params
   */
  const refreshCourseData = () => {
    if (!isConnected) {
      showToast('error', 'No Internet Connect', '');
      return;
    }
    fetchCourseList({ page: 1 }, 'refresh');
  };

  /**
   * Trigger load more action for pagination
   * @param {object} data - API request params
   */
  const loadMoreCoursesData = (data: any) => {
    if (!isConnected) {
      showToast('error', 'No Internet Connection', '');
      return;
    }
    if (courseData.courses.length < courseData.metadata.total_count && !isLoadMore) {
      fetchCourseList(
        {
          page: courseData.metadata.next_page,
        },
        'loadMore',
      );
    }
  };

  const getCourseCompletionPercentage = (courseDetails: CourseDetails, courseId: string) => {
    const saved = mmkvStorage.getString(STORAGE_TYPE.COURSE_COMPLETION);
    let completionData: any = {};

    try {
      completionData = saved ? JSON.parse(saved) : {};
    } catch (e) {
      completionData = {};
    }

    const modules = courseDetails?.modules || [];

    let totalLessons = 0;
    let completedLessons = 0;

    modules.forEach((module) => {
      const lessons = module.lessons || [];
      const completedLessonIds = completionData?.[courseId]?.[module.id] || [];

      totalLessons = totalLessons + lessons.length;
      completedLessons =
        completedLessons +
        lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
    });

    const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return percent;
  };
  return {
    courseData,
    isLoadMore,
    isApiLoading,
    isRefreshing,
    fetchCourseList,
    refreshCourseData,
    loadMoreCoursesData,
    fetchCourseDetails,
    expendModuleId,
    setExpendModuleId,
    getCourseCompletionPercentage,
    courseCompletion,
    setCourseCompletion,
    errorCourseDetails,
  };
};
