/**
 * Loading Screen
 *
     <Loading text={'Server is down'} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';

// Consts and Libs
import { AppStyles, AppColors } from '../../theme/';

// Components
import { Spacer, Text } from '../ui/';

const animateColor = AppColors.brand().lD_anim1Color;
const animate2Color = AppColors.brand().lD_anim2Color;
/* Component ==================================================================== */
const Loading = ({ text, transparent }) => (
  <View
    style={[
      AppStyles.container,
      AppStyles.containerCentered,
      transparent && { backgroundColor: AppColors.brand().lD_style },
    ]}
  >
    <ActivityIndicator
      animating
      size={'large'}
      color={transparent ? animateColor : animate2Color }
    />

    <Spacer size={10} />

    {!!text && <Text>{text}</Text>}
  </View>
);

Loading.propTypes = { text: PropTypes.string, transparent: PropTypes.bool };
Loading.defaultProps = { text: null, transparent: false };
Loading.componentName = 'Loading';

/* Export Component ==================================================================== */
export default Loading;
