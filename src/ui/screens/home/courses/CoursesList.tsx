import React from 'react';
import { vw } from '@utils/dimensions';
import Color from '@ui/constants/Color';
import ScreenNames from '@utils/screenNames';
import { CourseDetails } from '@data/models/homeModel';
import useAppNavigation from '@ui/hooks/UseAppNavigation';
import AppLayout from '@ui/components/appLayout/AppLayout';
import CourseCard from '@ui/components/courseCard/CourseCard';
import { CoursePayload, useCourseViewModel } from '../useHomeViewModel/useCourseViewModel';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { mmkvStorage } from '@ui/store/store';
import { STORAGE_TYPE } from '@data/models/globalModel';
import LinearGradient from 'react-native-linear-gradient';

const CoursesList = () => {
  const {
    courseData,
    isLoadMore,
    isApiLoading,
    isRefreshing,
    fetchCourseList,
    refreshCourseData,
    loadMoreCoursesData,
    courseCompletion,
    setCourseCompletion,
    getCourseCompletionPercentage,
  } = useCourseViewModel();

  const [lastAccessCourseId, setLastAccessCourseId] = React.useState('');

  const navigation = useAppNavigation();

  React.useEffect(() => {
    const getLastAccessedCourse = () => {
      try {
        const lastViewCourseData = JSON.parse(
          mmkvStorage.getString(STORAGE_TYPE.LAST_VIEW_LESSON) || '{}',
        );
        let lastAccessed = null;

        for (const courseId in lastViewCourseData) {
          const details = lastViewCourseData[courseId];

          if (!details.lastUpdatedAt) continue;

          if (!lastAccessed || details.lastUpdatedAt > lastAccessed.lastUpdatedAt) {
            lastAccessed = { courseId, ...details };
          }
        }
        return lastAccessed;
      } catch {
        return null;
      }
    };
    const listener = mmkvStorage.addOnValueChangedListener((type) => {
      if (type == STORAGE_TYPE.LAST_VIEW_LESSON) {
        const lastCourse = getLastAccessedCourse();
        if (lastCourse) {
          setLastAccessCourseId(lastCourse.courseId);
        }
      }
    });

    const lastCourse = getLastAccessedCourse();
    if (lastCourse) {
      setLastAccessCourseId(lastCourse.courseId);
    }
    return () => listener.remove();
  }, []);

  React.useEffect(() => {
    fetchCourseList(new CoursePayload());
  }, []);

  const keyExtractor = React.useCallback((item: CourseDetails, index: number) => {
    return item.id;
  }, []);

  const onItemPress = React.useCallback((item: CourseDetails) => {
    navigation.navigate(ScreenNames.CourseDetail, {
      courseId: item.id,
    });
  }, []);

  React.useEffect(() => {
    let courses: Record<string, number> = {};
    for (const courseId in courseData.courseDetails) {
      const percentage = getCourseCompletionPercentage(
        courseData.courseDetails[courseId],
        courseId,
      );
      if (percentage > 0) {
        courses[courseId] = percentage;
      }
    }
    setCourseCompletion(courses);
  }, [courseData.courseDetails]);

  React.useEffect(() => {
    const listener = mmkvStorage.addOnValueChangedListener((storageListener) => {
      if (storageListener == STORAGE_TYPE.COURSE_COMPLETION) {
        let courses: Record<string, number> = {};
        for (const courseId in courseData.courseDetails) {
          const percentage = getCourseCompletionPercentage(
            courseData.courseDetails[courseId],
            courseId,
          );
          if (percentage > 0) {
            courses[courseId] = percentage;
          }
        }
        setCourseCompletion(courses);
      }
    });
    return () => listener.remove();
  }, [courseData.courseDetails, getCourseCompletionPercentage]);

  const renderItem = React.useCallback(
    ({ item }: { item: CourseDetails }) => {
      if (item.slug == lastAccessCourseId) {
        return null;
      }
      return (
        <CourseCard
          id={item.slug}
          plan={item.plan}
          title={item.title}
          onItemPress={onItemPress}
          level={item.difficulty_level}
          completionValue={courseCompletion[item.slug] || 0}
          tutor={item.tutors?.length ? item.tutors[0].name : ''}
          thumbnailUrl={item.thumbnail_url.replace(/^http:/, 'https:')}
        />
      );
    },
    [courseCompletion, lastAccessCourseId],
  );

  const onRefreshControl = React.useMemo(() => {
    return (
      <RefreshControl
        tintColor={Color.BLACK}
        titleColor={Color.BLACK}
        refreshing={isRefreshing}
        onRefresh={refreshCourseData}
      />
    );
  }, [isRefreshing]);

  const renderEmptyComponent = React.useMemo(() => {
    return <Text style={styles.noCoursesText}>No Courses Found</Text>;
  }, []);

  const renderHeaderComponent = React.useMemo(() => {
    const item = courseData.courses.find((item) => item.slug == lastAccessCourseId);
    if (!item) {
      return null;
    }
    return (
      <LinearGradient
        end={{ x: 1, y: 0 }}
        start={{ x: 1, y: 0 }}
        colors={[Color.BLUE_4, Color.WHITE]}
        style={{ backgroundColor: Color.BLUE_4 }}
      >
        <View style={{ paddingTop: vw(24), backgroundColor: Color.BLUE_4 }}>
          <Text style={styles.recentViewCourse}>Recent View Course</Text>
          <CourseCard
            id={item.slug}
            plan={item.plan}
            title={item.title}
            onItemPress={onItemPress}
            level={item.difficulty_level}
            completionValue={courseCompletion[item.slug] || 0}
            tutor={item.tutors?.length ? item.tutors[0].name : ''}
            thumbnailUrl={item.thumbnail_url.replace(/^http:/, 'https:')}
          />
        </View>
      </LinearGradient>
    );
  }, [lastAccessCourseId, courseData.courses, courseCompletion]);
  return (
    <AppLayout>
      <View style={styles.parentContainer}>
        {isApiLoading && !courseData.courses.length ? (
          <View>
            <ActivityIndicator size={'large'} color={Color.BLACK} />
            <Text style={styles.noCoursesText}>Fetching Courses</Text>;
          </View>
        ) : (
          <FlatList
            renderItem={renderItem}
            data={courseData.courses}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.26}
            removeClippedSubviews={false}
            refreshControl={onRefreshControl}
            onEndReached={loadMoreCoursesData}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeaderComponent}
            ListEmptyComponent={renderEmptyComponent}
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={
              isLoadMore ? (
                <ActivityIndicator size={'large'} style={styles.loadMoreIndicator} />
              ) : undefined
            }
          />
        )}
      </View>
    </AppLayout>
  );
};

export default CoursesList;

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreIndicator: {
    paddingVertical: vw(24),
  },
  recentViewCourse: {
    fontSize: 18,
    color: Color.BLACK,
    fontWeight: '800',
    marginHorizontal: vw(16),
    marginTop: vw(24),
  },
  listContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  noCoursesText: {
    fontSize: vw(18),
    alignSelf: 'center',
    marginTop: vw(12),
  },
});
