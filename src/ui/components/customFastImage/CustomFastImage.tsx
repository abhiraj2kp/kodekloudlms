import React from 'react';
import { StyleProp, ImageStyle } from 'react-native';
import FastImage, { ResizeMode, Source } from 'react-native-fast-image';

type CustomFastImageProps = {
  uri: string;
  resizeMode?: ResizeMode;
  style: StyleProp<ImageStyle>;
  priority?: 'low' | 'normal' | 'high';
  cache?: 'immutable' | 'web' | 'cacheOnly';
};

const CustomFastImage: React.FC<CustomFastImageProps> = ({
  uri,
  style,
  resizeMode = FastImage.resizeMode.cover,
  priority = FastImage.priority.normal,
  cache = FastImage.cacheControl.immutable,
}) => {
  const source: Source = {
    uri: uri.includes('http') ? uri.replace(/^http:/, 'https:') : uri,
    priority,
    cache,
  };

  return <FastImage source={source} style={style} resizeMode={resizeMode} />;
};

export default CustomFastImage;
