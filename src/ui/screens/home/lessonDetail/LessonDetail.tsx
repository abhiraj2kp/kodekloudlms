import {
  Text,
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Images from '@ui/assets/image';
import Color from '@ui/constants/Color';
import { mmkvStorage } from '@ui/store/store';
import { SCREEN_WIDTH, vw } from '@utils/dimensions';
import { STORAGE_TYPE } from '@data/models/globalModel';
import { formatSecondsToHHMMSS } from '@utils/functions';
import { showToast } from '@ui/constants/Toaster.service';
import LinearGradient from 'react-native-linear-gradient';
import AppLayout from '@ui/components/appLayout/AppLayout';
import VimeoPlayer from '@ui/components/vimeoPlayer/VimeoPlayer';
import ProgressBar from '@ui/components/progressBar/ProgressBar';
import CustomButton from '@ui/components/customButton/CustomButton';
import { useCourseViewModel } from '../useHomeViewModel/useCourseViewModel';
import CustomFastImage from '@ui/components/customFastImage/CustomFastImage';

interface Props {
  route: {
    params: {
      courseId: string;
      lessonId: string;
      hideCourseContent?: boolean;
    };
  };
}

const LessonDetail = (props: Props) => {
  const courseId = props.route.params.courseId;
  const lessonId = props.route.params.lessonId;
  let hideCourseContent = props.route.params.hideCourseContent || false;
  const { fetchCourseDetails, courseData, setExpendModuleId, expendModuleId, errorCourseDetails } =
    useCourseViewModel();

  const lastViewLesson = React.useMemo(() => {
    try {
      return JSON.parse(mmkvStorage.getString(STORAGE_TYPE.LAST_VIEW_LESSON) || '{}');
    } catch {
      return {};
    }
  }, []);
  const [selectedModule, setSelectedModule] = React.useState({
    moduleId: '',
    lessonId: '',
    type: '',
  });

  let initialVideoId = '68481134';
  const [activeLessonPlanVideo, setActiveLessonPlanVideo] = React.useState({
    lessonId: '',
    isPlay: false,
    isEnded: false,
    currentTime: 0,
    isPaused: false,
    videoId: initialVideoId,
  });

  const courseDetails = courseData.courseDetails?.[courseId];

  React.useEffect(() => {
    fetchCourseDetails(courseId);
  }, [courseId]);

  React.useEffect(() => {
    //Comming from deep linking
    if (courseDetails && lessonId) {
      const module = courseDetails.modules.find((item) =>
        item.lessons.find((lessonItem) => lessonItem.id == lessonId),
      );
      setExpendModuleId(module?.id || '');
      setSelectedModule({
        lessonId: lessonId,
        moduleId: module?.id || '',
        type: module?.lessons.find((item) => item.id == lessonId)?.type || '',
      });
    } else if (courseDetails && !lessonId) {
      if (lastViewLesson[courseId] && Object.keys(lastViewLesson[courseId]).length > 0) {
        let module = courseDetails.modules.find(
          (item) => item.id == lastViewLesson[courseId].moduleId,
        );
        setExpendModuleId(lastViewLesson[courseId].moduleId);
        setSelectedModule({
          type: module
            ? module.lessons.find((item) => item.id == lastViewLesson[courseId].lessonId)?.type ||
              ''
            : '',
          moduleId: lastViewLesson[courseId].moduleId,
          lessonId: lastViewLesson[courseId].lessonId,
        });
      }
    }
  }, [courseDetails]);

  const getVideoProgress = (lessonId: string): number => {
    const raw = mmkvStorage.getString(STORAGE_TYPE.IN_PROGRESS_COURSES);
    const progressMap = raw ? JSON.parse(raw) : {};
    return progressMap[lessonId] || 0;
  };

  React.useEffect(() => {
    if (selectedModule.lessonId) {
      setActiveLessonPlanVideo((prev) => {
        const viewProgress = getVideoProgress(selectedModule.lessonId);
        let finalUrl = initialVideoId;
        if (viewProgress > 1) {
          finalUrl = initialVideoId + `?autoplay=1&muted=0#t=${viewProgress.toFixed(2)}`;
        }
        console.log('finalUrl', finalUrl, selectedModule);
        return {
          ...prev,
          videoId: finalUrl,
        };
      });
    }
  }, [selectedModule.lessonId]);

  if (errorCourseDetails && !courseDetails) {
    return (
      <AppLayout>
        <View style={styles.container}>
          <Text style={styles.errorPlaceholder}>{errorCourseDetails}</Text>
        </View>
      </AppLayout>
    );
  }
  if (!courseDetails) {
    return (
      <AppLayout>
        <View style={styles.container}>
          <ActivityIndicator color={Color.BLACK} size="large" />
          <Text style={styles.fetchingLessonTxt}>Fetching Lesson Details</Text>
        </View>
      </AppLayout>
    );
  }

  const saveVideoProgress = (lessonId: string, timeInSeconds: number) => {
    const raw = mmkvStorage.getString(STORAGE_TYPE.IN_PROGRESS_COURSES);
    const progressMap = raw ? JSON.parse(raw) : {};

    progressMap[lessonId] = timeInSeconds;
    mmkvStorage.set(STORAGE_TYPE.IN_PROGRESS_COURSES, JSON.stringify(progressMap));
  };

  const deleteProgressVideo = (lessonId: string) => {
    const raw = mmkvStorage.getString(STORAGE_TYPE.IN_PROGRESS_COURSES);
    const progressMap = raw ? JSON.parse(raw) : {};

    delete progressMap[lessonId];
    mmkvStorage.set(STORAGE_TYPE.IN_PROGRESS_COURSES, JSON.stringify(progressMap));
  };

  console.log('getVideoProgress', getVideoProgress(selectedModule.lessonId));
  const isLessonCompleted = (courseId: string, moduleId: string, lessonId: string) => {
    const saved = mmkvStorage.getString(STORAGE_TYPE.COURSE_COMPLETION);
    if (!saved) return false;
    try {
      const completionData = JSON.parse(saved);
      return (
        Array.isArray(completionData?.[courseId]?.[moduleId]) &&
        completionData[courseId][moduleId].includes(lessonId)
      );
    } catch (e) {
      return false;
    }
  };

  const markLessonComplete = () => {
    const saved = mmkvStorage.getString(STORAGE_TYPE.COURSE_COMPLETION);
    const courseCompletion = saved ? JSON.parse(saved) : {};
    const moduleLessons = courseCompletion[courseId]?.[selectedModule.moduleId] || [];
    if (!moduleLessons.includes(selectedModule.lessonId)) {
      const updated = {
        ...courseCompletion,
        [courseId]: {
          ...courseCompletion[courseId],
          [selectedModule.moduleId]: [...moduleLessons, selectedModule.lessonId],
        },
      };
      mmkvStorage.set(STORAGE_TYPE.COURSE_COMPLETION, JSON.stringify(updated));
      showToast('success', 'Lesson Completed', '');
      setSelectedModule((prev) => ({
        ...prev,
        type: '',
        lessonId: '',
      }));
    }
  };

  const getModuleCompletionPercentages = () => {
    const saved = mmkvStorage.getString(STORAGE_TYPE.COURSE_COMPLETION);
    let completionData: any = {};

    try {
      completionData = saved ? JSON.parse(saved) : {};
    } catch (e) {
      completionData = {};
    }

    const modules = courseDetails?.modules || [];
    const percentages: Record<string, number> = {};

    modules.forEach((module) => {
      const allLessons = module.lessons || [];
      const completedLessons = completionData?.[courseId]?.[module.id] || [];
      const total = allLessons.length;
      const completed = allLessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      percentages[module.id] = percent;
    });

    return percentages;
  };

  const getCourseCompletionPercentage = () => {
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

  const totalPercentage = getCourseCompletionPercentage();

  const videoUrl = `${activeLessonPlanVideo.videoId}`;
  return (
    <AppLayout>
      <ScrollView>
        <View style={styles.parentContainer}>
          <LinearGradient
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={styles.courseCard}
            colors={[Color.PRIMARY, Color.PURPLE]}
          >
            <View style={styles.subContainer}>
              <View>
                <Text style={styles.courseTitle}>{courseDetails.title}</Text>
                <View>
                  <ProgressBar progress={totalPercentage / 100} />
                  <Text style={styles.completionPercentage}>{totalPercentage}% Complete</Text>
                </View>

                <View style={styles.thumbnailContainer}>
                  <VimeoPlayer
                    onPlay={() => {
                      setActiveLessonPlanVideo((prev) => ({
                        ...prev,
                        isPlay: true,
                        isEnded: false,
                        isPaused: false,
                      }));
                    }}
                    onPause={() => {
                      setActiveLessonPlanVideo((prev) => ({
                        ...prev,
                        isEnded: false,
                        isPaused: true,
                      }));
                    }}
                    onEnded={() => {
                      setActiveLessonPlanVideo((prev) => ({
                        ...prev,
                        isPlay: false,
                        isEnded: true,
                        isPaused: false,
                      }));
                    }}
                    onTimeupdate={(result: any) => {
                      const { currentTime, duration, percent } = result;
                      console.log('onTimeupdate', result);
                      setActiveLessonPlanVideo((prev) => ({
                        ...prev,
                        isPlay: false,
                        isEnded: true,
                        isPaused: false,
                        currentTime: currentTime,
                      }));
                      if (percent == '100') {
                        deleteProgressVideo(selectedModule.lessonId);
                        markLessonComplete();
                      } else {
                        saveVideoProgress(selectedModule.lessonId, currentTime);
                      }
                    }}
                    videoId={videoUrl}
                  />

                  {selectedModule.type != 'video' ? (
                    <TouchableOpacity
                      activeOpacity={0.75}
                      disabled={selectedModule.type != 'video'}
                      onPress={() => {
                        setActiveLessonPlanVideo({
                          ...activeLessonPlanVideo,
                          currentTime: 0,
                          isEnded: false,
                          isPaused: false,
                          isPlay: true,
                          lessonId: selectedModule.lessonId,
                        });
                      }}
                      style={[
                        styles.thumbnailContainer,
                        { position: 'absolute', zIndex: 9999, marginTop: 0 },
                      ]}
                    >
                      <CustomFastImage
                        resizeMode="cover"
                        style={styles.courseThumbnail}
                        uri={courseDetails.thumbnail_url}
                      />
                      {selectedModule.type == 'video' && (
                        <Image style={styles.playIcon} source={Images.playIcon} />
                      )}
                    </TouchableOpacity>
                  ) : null}
                </View>
                {!selectedModule.lessonId || !selectedModule.moduleId ? null : (
                  <CustomButton
                    title="Mark Complete"
                    style={styles.markCompBtn}
                    onPress={markLessonComplete}
                    textStyle={styles.markCompText}
                  />
                )}
              </View>
            </View>
          </LinearGradient>

          {!hideCourseContent ? (
            <View>
              <Text style={styles.courseContentText}>Course Content</Text>
              <View>
                {courseDetails.modules.map((item) => {
                  const percentage = getModuleCompletionPercentages();
                  return (
                    <View style={styles.moduleContainer}>
                      <TouchableOpacity
                        onPress={() => setExpendModuleId(expendModuleId == item.id ? '' : item.id)}
                        activeOpacity={0.75}
                        style={styles.moduleBtnContainer}
                        key={item.id}
                      >
                        <View style={{ maxWidth: '60%', flexDirection: 'row' }}>
                          <Text style={{ color: Color.WHITE, marginRight: vw(6) }}>
                            {expendModuleId === item.id ? '▼ ' : '▶ '}
                          </Text>
                          <Text numberOfLines={2} style={styles.moduleType}>
                            {item.title}
                          </Text>
                        </View>
                        <Text style={styles.totalLesson}>
                          {item.lessons_count} Lessons {`${percentage[item.id]} %`}
                        </Text>
                      </TouchableOpacity>
                      {expendModuleId == item.id && (
                        <View>
                          <Text style={styles.moduleContentText}>Module Content</Text>
                          {item.lessons.map((lessonItem) => {
                            let isCompleted = isLessonCompleted(courseId, item.id, lessonItem.id);
                            return (
                              <TouchableOpacity
                                key={lessonItem.id}
                                onPress={() => {
                                  lastViewLesson[courseId] = {
                                    moduleId: item.id,
                                    lessonId: lessonItem.id,
                                    lastUpdatedAt: new Date().getTime(),
                                  };
                                  mmkvStorage.set(
                                    STORAGE_TYPE.LAST_VIEW_LESSON,
                                    JSON.stringify(lastViewLesson),
                                  );

                                  setSelectedModule({
                                    lessonId: lessonItem.id,
                                    moduleId: item.id,
                                    type: lessonItem.type,
                                  });
                                }}
                                activeOpacity={0.76}
                                style={styles.lessonItemContainer}
                              >
                                <Image
                                  style={styles.includeImg}
                                  source={
                                    lessonItem.type == 'video'
                                      ? Images.videoIcon
                                      : lessonItem.type == 'lab'
                                      ? Images.lessonIcon
                                      : Images.taskIcon
                                  }
                                />
                                <View style={{ flex: 1 }}>
                                  <Text
                                    style={[
                                      styles.lessonText,
                                      { color: isCompleted ? Color.BLUE_2 : Color.WHITE },
                                    ]}
                                  >
                                    {lessonItem.title}
                                  </Text>
                                  {lessonItem.duration ? (
                                    <Text
                                      style={[
                                        styles.lessonText,
                                        { color: isCompleted ? Color.BLUE_2 : Color.WHITE },
                                      ]}
                                    >
                                      {formatSecondsToHHMMSS(lessonItem.duration)}
                                    </Text>
                                  ) : null}
                                </View>
                                {isCompleted ? (
                                  <Image style={styles.completeIcon} source={Images.complete} />
                                ) : (
                                  <View style={styles.circle}>
                                    {selectedModule.lessonId == lessonItem.id &&
                                    selectedModule.moduleId == item.id ? (
                                      <View style={styles.innerCircle} />
                                    ) : null}
                                  </View>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default LessonDetail;

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
  completeIcon: {
    width: vw(24),
    height: vw(24),
  },
  markCompText: {
    fontSize: vw(12),
  },
  innerCircle: {
    width: vw(12),
    height: vw(12),
    borderRadius: vw(6),
    backgroundColor: Color.BLUE_2,
  },
  errorPlaceholder: {
    fontSize: 18,
    color: Color.BLACK,
  },
  circle: {
    width: vw(24),
    height: vw(24),
    borderWidth: 2,
    borderRadius: vw(12),
    alignItems: 'center',
    borderColor: Color.WHITE,
    justifyContent: 'center',
  },
  markCompBtn: {
    width: vw(120),
    height: vw(30),
    alignSelf: 'flex-end',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonText: {
    fontSize: 12,
    color: Color.GRAY1,
    marginLeft: vw(6),
  },
  courseTitle: {
    fontSize: 24,
    maxWidth: '80%',
    color: Color.WHITE,
    marginTop: vw(24),
    fontWeight: 'bold',
    marginBottom: vw(16),
  },
  totalLesson: {
    fontSize: 14,
    fontWeight: '500',
    color: Color.WHITE,
  },
  completionPercentage: {
    fontSize: 10,
    color: Color.WHITE,
    fontWeight: 'bold',
    marginTop: vw(6),
  },
  subContainer: {
    marginHorizontal: vw(16),
    paddingBottom: vw(24),
  },
  playIcon: {
    width: vw(48),
    height: vw(48),
    position: 'absolute',
  },
  thumbnailContainer: {
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.5,
    marginTop: vw(24),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: vw(20),
    overflow: 'hidden',
  },
  includeImg: {
    width: vw(24),
    height: vw(24),
  },
  lessonItemContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    paddingVertical: vw(8),
    alignItems: 'center',
  },
  moduleType: {
    fontSize: 14,
    fontWeight: '500',
    color: Color.WHITE,
  },
  moduleContainer: {
    borderRadius: vw(8),
    marginVertical: vw(5),
    paddingVertical: vw(20),
    marginHorizontal: vw(16),
    paddingHorizontal: vw(12),
    backgroundColor: Color.BLACK,
  },
  moduleContentText: {
    fontSize: 14,
    fontWeight: '700',
    color: Color.WHITE,
    marginTop: vw(48),
    marginVertical: vw(16),
  },
  moduleBtnContainer: {
    // flex: 1,
    flexDirection: 'row',
    marginHorizontal: vw(12),
    justifyContent: 'space-between',
  },
  courseThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: vw(8),
  },

  courseCard: {
    alignSelf: 'center',
    width: SCREEN_WIDTH - vw(32),
    borderRadius: vw(16),
  },
  fetchingLessonTxt: {
    fontSize: 16,
    marginTop: vw(8),
    fontWeight: 'bold',
    color: Color.BLACK,
    marginHorizontal: vw(16),
  },
  courseContentText: {
    fontSize: 18,
    marginTop: vw(24),
    fontWeight: 'bold',
    color: Color.BLACK,
    marginBottom: vw(16),
    marginHorizontal: vw(16),
  },
});
