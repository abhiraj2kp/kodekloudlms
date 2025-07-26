import React from 'react';
import Color from '@ui/constants/Color';
import { View, StyleSheet } from 'react-native';
import { Vimeo } from 'react-native-vimeo-iframe';

interface Props {
  videoId: string;
  onPlay?: Function;
  onEnded?: Function;
  onPause?: Function;
  onTimeupdate?: Function;
}
const VimeoPlayer = ({ videoId, onEnded, onPause, onTimeupdate, onPlay }: Props) => {
  const videoCallbacks = {
    play: (data: any) => onPlay && onPlay(JSON.parse(JSON.stringify(data))),
    pause: (data: any) => onPause && onPause(JSON.parse(JSON.stringify(data))),
    ended: (data: any) => onEnded && onEnded(JSON.parse(JSON.stringify(data))),
    timeupdate: (data: any) => onTimeupdate && onTimeupdate(JSON.parse(JSON.stringify(data))),
  };

  return (
    <View style={styles.container}>
      <Vimeo handlers={videoCallbacks} videoId={videoId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Color.BLACK,
  },
});

export default React.memo(VimeoPlayer);
