import React from 'react';
import Images from '@ui/assets/image';
import Color from '@ui/constants/Color';
import Markdown from 'react-native-markdown-display';
import { SCREEN_WIDTH, vw } from '@utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import AppLayout from '@ui/components/appLayout/AppLayout';
import CustomButton from '@ui/components/customButton/CustomButton';
import { capitalizeFirstChar, secondsToHours } from '@utils/functions';
import { useCourseViewModel } from '../useHomeViewModel/useCourseViewModel';
import CustomFastImage from '@ui/components/customFastImage/CustomFastImage';
import {
  Text,
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { mmkvStorage } from '@ui/store/store';
import { STORAGE_TYPE } from '@data/models/globalModel';
import { showToast } from '@ui/constants/Toaster.service';
import { useNavigation } from '@react-navigation/native';
import ScreenNames from '@utils/screenNames';

interface Props {
  route: {
    params: {
      courseId: string;
    };
  };
}

const CourseDetail = (props: Props) => {
  const enrollmentData = JSON.parse(mmkvStorage.getString(STORAGE_TYPE.ENROLLMENTS) || `{}`);
  const courseId = props.route.params.courseId;

  const navigation: any = useNavigation();
  const { fetchCourseDetails, courseData, expendModuleId, setExpendModuleId, errorCourseDetails } =
    useCourseViewModel();
  const [isEnrolled, setIsEnrolled] = React.useState(!!enrollmentData[courseId]);

  React.useEffect(() => {
    fetchCourseDetails(courseId);
  }, [courseId]);

  const courseDetails = courseData.courseDetails[courseId];

  console.log('errorCourseDetails', errorCourseDetails);
  if (!courseDetails) {
    return (
      <AppLayout>
        <View style={styles.container}>
          {errorCourseDetails ? null : <ActivityIndicator color={Color.BLACK} size={'large'} />}
          <Text style={styles.fetchCourseDetails}>
            {errorCourseDetails ? errorCourseDetails : 'Fetching Course Details'}
          </Text>
        </View>
      </AppLayout>
    );
  }
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
              <View style={styles.categoryContainer}>
                <View style={styles.categoryItem}>
                  <Text style={styles.categoryText}>{courseDetails.plan}</Text>
                </View>
                {courseDetails.categories.map((item) => (
                  <View key={item.id} style={styles.categoryItem}>
                    <Text style={styles.categoryText}>{item.name}</Text>
                  </View>
                ))}
              </View>
              <View>
                <Text style={styles.courseTitle}>{courseDetails.title}</Text>
                <Text style={styles.courseLevel}>
                  Level: {capitalizeFirstChar(courseDetails.difficulty_level)}
                </Text>
                <Text style={styles.excerptText}>{courseDetails.excerpt}</Text>
                <Text style={styles.courseDuration}>
                  Course Duration: {secondsToHours(courseDetails.includes_section.course_duration)}{' '}
                  Hours
                </Text>
                <View style={styles.thumbnailContainer}>
                  <CustomFastImage
                    resizeMode="cover"
                    style={styles.courseThumbnail}
                    uri={courseDetails.thumbnail_url}
                  />
                  <Image style={styles.playIcon} source={Images.playIcon} />
                </View>
                {courseDetails.tutors.length ? (
                  <View style={styles.tutorDetailContainer}>
                    <View style={styles.userAvatarContainer}>
                      <CustomFastImage
                        resizeMode="cover"
                        style={styles.userAvatar}
                        uri={courseDetails.tutors[0].avatar_url}
                      />
                    </View>
                    <View style={styles.tutorNameContainer}>
                      <Text style={styles.nameText}>{courseDetails.tutors[0].name}</Text>
                      <Text style={styles.bioText}>{courseDetails.tutors[0].bio}</Text>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          </LinearGradient>
          {isEnrolled ? (
            <CustomButton
              onPress={() => {
                if (courseDetails.modules.length && courseDetails.modules[0].lessons.length) {
                  navigation.navigate(ScreenNames.LessonDetail, {
                    courseId: courseId,
                    lessonId: '',
                  });
                }
              }}
              title={'Continue Learning'}
              style={{}}
            />
          ) : null}
          <CustomButton
            onPress={() => {
              if (isEnrolled) {
                delete enrollmentData[courseId];
              } else {
                enrollmentData[courseId] = true;
              }
              mmkvStorage.set(STORAGE_TYPE.ENROLLMENTS, JSON.stringify(enrollmentData));
              showToast(
                'success',
                isEnrolled ? 'UnEnrollment done successfully' : 'Enrollment done successfully',
                '',
              );
              setIsEnrolled((prev) => !prev);
              if (isEnrolled) {
                mmkvStorage.delete(STORAGE_TYPE.ENROLLMENTS);
                mmkvStorage.delete(STORAGE_TYPE.COURSE_COMPLETION);
                mmkvStorage.delete(STORAGE_TYPE.IN_PROGRESS_COURSES);
              }
            }}
            style={{}}
            title={isEnrolled ? 'Unenroll in This Course' : 'Enroll'}
          />
          <View>
            <Text style={styles.couseIncludeText}>Course Includes</Text>
            <View style={styles.includeParentContainer}>
              <View style={styles.courseIncludeItem}>
                <Image style={styles.includeImg} source={Images.certificationIcon} />
                <Text style={styles.includeItemText}>Course Certificate</Text>
              </View>
              <View style={styles.courseIncludeItem}>
                <Image style={styles.includeImg} source={Images.demoIcon} />
                <Text style={styles.includeItemText}>Demo</Text>
              </View>
            </View>
            <View style={styles.includeParentContainer}>
              <View style={styles.courseIncludeItem}>
                <Image style={styles.includeImg} source={Images.langugageIcon} />
                <Text style={styles.includeItemText}>English</Text>
              </View>
              <View style={styles.courseIncludeItem}>
                <Image style={styles.includeImg} source={Images.moduleIcon} />
                <Text style={styles.includeItemText}>
                  {courseDetails.includes_section.modules_count} Module
                </Text>
              </View>
            </View>
            <View style={styles.includeParentContainer}>
              <View style={styles.courseIncludeItem}>
                <Image style={styles.includeImg} source={Images.lessonIcon} />
                <Text style={styles.includeItemText}>
                  {courseDetails.includes_section.lessons_count} Lessons
                </Text>
              </View>
              <View style={styles.courseIncludeItem}>
                <Image style={styles.includeImg} source={Images.labIcon} />
                <Text style={styles.includeItemText}>
                  {courseDetails.includes_section.lab_lesson_count} Labs
                </Text>
              </View>
            </View>
            <View style={styles.includeParentContainer}>
              <View style={styles.courseIncludeItem}>
                <Image style={styles.includeImg} source={Images.videoDuration} />
                <Text style={styles.includeItemText}>
                  {secondsToHours(courseDetails.includes_section.course_duration)} Hours of Video
                </Text>
              </View>
              <View style={styles.courseIncludeItem}>
                <Image style={styles.includeImg} source={Images.community} />
                <Text style={styles.includeItemText}>Community support</Text>
              </View>
            </View>
            <View style={styles.includeParentContainer}>
              <View style={[styles.courseIncludeItem, styles.flex05]}>
                <Image style={styles.includeImg} source={Images.discordIcon} />
                <Text style={styles.includeItemText}>Discord Community Support</Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.courseContentText}>Course Content</Text>
            <View style={{}}>
              {courseDetails.modules.map((item) => {
                return (
                  <View style={styles.moduleContainer}>
                    <TouchableOpacity
                      onPress={() => setExpendModuleId(expendModuleId == item.id ? '' : item.id)}
                      activeOpacity={0.75}
                      style={styles.moduleBtnContainer}
                      key={item.id}
                    >
                      <Text style={styles.moduleType}>
                        {expendModuleId === item.id ? '▼ ' : '▶ '}
                        {item.title}
                      </Text>
                      <Text style={styles.totalLesson}>{item.lessons_count} Lessons</Text>
                    </TouchableOpacity>
                    {expendModuleId == item.id && (
                      <View>
                        <Text style={styles.moduleContentText}>Module Content</Text>
                        {item.lessons.map((lessonItem) => {
                          return (
                            <View style={styles.lessonItemContainer} key={item.id}>
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
                              <Text style={styles.lessonText}>{lessonItem.title}</Text>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
          <View style={styles.markdownContainer}>
            <Markdown style={markDownStyles}>{courseDetails.description}</Markdown>
          </View>
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default CourseDetail;

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
  fetchCourseDetails: {
    fontSize: vw(18),
    color: Color.BLACK,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleType: {
    fontSize: 14,
    fontWeight: '500',
    color: Color.BLACK,
  },
  markdownContainer: {
    marginHorizontal: vw(16),
    marginTop: vw(48),
  },
  totalLesson: {
    fontSize: 14,
    fontWeight: '500',
    color: Color.BLACK,
  },
  lessonItemContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    paddingVertical: vw(8),
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  lessonText: {
    fontSize: 12,
    color: Color.GRAY1,
    marginLeft: vw(6),
  },
  moduleContentText: {
    fontSize: 14,
    fontWeight: '700',
    color: Color.BLACK,
    marginTop: vw(48),
    marginVertical: vw(16),
  },
  moduleBtnContainer: {
    flexDirection: 'row',
    marginHorizontal: vw(12),
    justifyContent: 'space-between',
  },
  moduleContainer: {
    borderRadius: vw(8),
    marginVertical: vw(5),
    paddingVertical: vw(20),
    marginHorizontal: vw(16),
    paddingHorizontal: vw(12),
    backgroundColor: Color.GRAY,
  },
  excerptText: {
    marginVertical: vw(16),
    fontSize: vw(14),
    color: Color.WHITE1,
  },
  courseDuration: {
    fontSize: vw(14),
    color: Color.WHITE1,
  },
  courseTitle: {
    fontSize: 24,
    maxWidth: '80%',
    color: Color.WHITE,
    marginTop: vw(24),
    fontWeight: 'bold',
  },
  courseLevel: {
    fontSize: 14,
    color: Color.WHITE,
    marginTop: vw(16),
    fontWeight: 'bold',
  },
  includeParentContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: vw(16),
    marginTop: vw(12),
    justifyContent: 'space-between',
  },
  couseIncludeText: {
    fontSize: 16,
    marginTop: vw(24),
    fontWeight: '600',
    color: Color.BLACK,
    marginBottom: vw(16),
    marginHorizontal: vw(16),
  },
  flex05: {
    flex: 0.45,
  },
  courseContentText: {
    fontSize: 18,
    marginTop: vw(24),
    fontWeight: 'bold',
    color: Color.BLACK,
    marginBottom: vw(16),
    marginHorizontal: vw(16),
  },
  courseIncludeItem: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: vw(4),
    paddingVertical: vw(12),
    paddingHorizontal: vw(12),
    backgroundColor: Color.GRAY,
  },
  includeItemText: {
    fontSize: 12,
    marginLeft: vw(6),
    color: Color.GRAY1,
  },
  includeImg: {
    width: vw(24),
    height: vw(24),
  },
  subContainer: {
    marginHorizontal: vw(16),
    paddingBottom: vw(24),
  },
  tutorDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vw(24),
  },
  nameText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Color.WHITE,
  },
  bioText: {
    // flex: 1,
    maxWidth: '100%',
    fontSize: 10,
    marginTop: vw(6),
    color: Color.WHITE,
  },
  tutorNameContainer: {
    paddingHorizontal: vw(12),
    flex: 1,
  },
  userAvatarContainer: {
    width: vw(60),
    height: vw(60),
    borderWidth: 3,
    alignItems: 'center',
    borderRadius: vw(30),
    justifyContent: 'center',
    borderColor: Color.BLUE_2,
  },
  userAvatar: {
    width: '100%',
    height: '100%',
    // borderRadius: vw(30),
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
  },
  categoryContainer: {
    paddingTop: vw(24),
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseThumbnail: {
    width: '100%',
    height: '100%',

    borderRadius: vw(8),
  },
  categoryText: {
    fontSize: 14,
    color: Color.WHITE,
  },
  categoryItem: {
    marginRight: vw(6),
    borderRadius: vw(6),
    paddingVertical: vw(8),
    paddingHorizontal: vw(8),
    backgroundColor: Color.BLUE_01,
  },
  courseCard: {
    alignSelf: 'center',
    width: SCREEN_WIDTH - vw(32),
    borderRadius: vw(16),
  },
  markdownStyle: {},
});

const markDownStyles: StyleSheet.NamedStyles<any> = {
  heading1: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Color.BLACK1,
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.BLACK,
  },
  heading2: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: Color.BLACK1,
  },
  paragraph: {
    fontSize: 16,
    color: Color.GRAY1,
    lineHeight: 24,
    marginBottom: 10,
  },
  bullet_list: {
    marginBottom: 12,
  },
  list_item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 10,
    color: Color.GRAY1,
  },
  listItemText: {
    fontSize: 16,
    color: Color.GRAY1,
    lineHeight: 24,
  },
  fence: {
    fontSize: 16,
    backgroundColor: Color.WHITE1,
    padding: 8,
    borderRadius: 6,
    fontFamily: 'Courier',
    color: Color.BLACK1,
  },
  code_inline: {
    padding: 2,
    borderRadius: 4,
    fontWeight: 'bold',
    fontFamily: 'Courier',
    color: Color.BLACK,
  },
};
