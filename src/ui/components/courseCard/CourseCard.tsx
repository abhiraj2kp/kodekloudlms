import React from 'react';
import { vw } from '@utils/dimensions';
import Color from '@ui/constants/Color';
import FastImage from 'react-native-fast-image';
import { capitalizeFirstChar } from '@utils/functions';
import LinearGradient from 'react-native-linear-gradient';
import CircularProgress from 'react-native-circular-progress-indicator';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type CourseCardProps = {
  id: string;
  title: string;
  tutor: string;
  level: string;
  thumbnailUrl: string;
  onItemPress: Function;
  completionValue: number;
  plan: 'Free' | 'Paid' | 'Standard';
};

const CourseCard: React.FC<CourseCardProps> = (props) => {
  const { title, tutor, level, thumbnailUrl, plan, onItemPress } = props;

  return (
    <View style={styles.card}>
      <View style={styles.thumbnailContainer}>
        <FastImage
          source={{
            uri: thumbnailUrl,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
          style={styles.thumbnail}
          resizeMode={FastImage.resizeMode.cover}
        />
        {props.completionValue > 0 ? (
          <View style={styles.progressBarContainer}>
            <CircularProgress
              radius={25}
              clockwise
              maxValue={100}
              valueSuffix="%"
              valueSuffixStyle={{ fontSize: 10, color: Color.BLACK }}
              progressValueStyle={{
                fontSize: 10,
                color: Color.BLACK,
                alignItems: 'center',
              }}
              initialValue={props.completionValue}
              activeStrokeWidth={5}
              inActiveStrokeWidth={5}
              value={props.completionValue}
              progressValueColor={Color.BLACK}
            />
          </View>
        ) : null}

        {plan && (
          <View style={styles.freeTag}>
            <Text style={styles.freeText}>{capitalizeFirstChar(plan)}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaLabel}>Tutor</Text>
          <Text style={styles.metaValue}>{tutor}</Text>
        </View>

        <View style={styles.meta}>
          <Text style={styles.metaLabel}>Level</Text>
          <Text style={styles.metaValue}>{capitalizeFirstChar(level)}</Text>
        </View>

        <TouchableOpacity onPress={() => onItemPress(props)}>
          <LinearGradient colors={[Color.BLUE_2, Color.BLUE_4]} style={styles.button}>
            <Text style={styles.buttonText}>View Course</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    top: vw(12),
    left: vw(12),
    width: vw(60),
    height: vw(60),
    borderRadius: vw(30),
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  card: {
    elevation: 3,
    margin: vw(12),
    shadowRadius: 8,
    shadowOpacity: 0.1,
    overflow: 'hidden',
    borderRadius: vw(16),
    shadowColor: Color.BLACK,
    backgroundColor: Color.WHITE,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 180,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },

  freeTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: Color.BLACK,
  },
  freeText: {
    color: Color.WHITE,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metaLabel: {
    color: '#888',
    fontSize: 13,
  },
  metaValue: {
    fontWeight: '500',
    fontSize: 13,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    marginTop: 12,
    borderRadius: 20,
    // paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: Color.WHITE,
    fontWeight: '600',
  },
});

export default React.memo(CourseCard);
