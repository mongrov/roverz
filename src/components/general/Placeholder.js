/**
 * Placeholder Scene
 *
    <Placeholder text={"Hello World"} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import t from '../../i18n';


// Consts and Libs
import { AppStyles } from '../../theme/';

// Components
import { Text } from '../ui/';

/* Component ==================================================================== */
const Placeholder = ({ text }) => (
  <View style={[AppStyles.container, AppStyles.containerCentered]}>
    <Text>{text}</Text>
  </View>
);

Placeholder.propTypes = { text: PropTypes.string };
Placeholder.defaultProps = { text: t('txt_coming_soon') };
Placeholder.componentName = 'Placeholder';

/* Export Component ==================================================================== */
export default Placeholder;
