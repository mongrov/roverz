/**
 * Error Screen
 *
    <Error text={'Server is down'} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import t from '../../i18n';


// Consts and Libs
import { AppStyles, AppColors } from '../../theme/';

// Components
import { Spacer, Text, Button } from '../ui/';

const icon = AppColors.brand().eR_iconColor;
/* Component ==================================================================== */
const Error = ({ text, tryAgain }) => (
  <View style={[AppStyles.container, AppStyles.containerCentered]}>
    <Icon name={'ios-alert-outline'} size={50} color={icon} />

    <Spacer size={10} />

    <Text style={AppStyles.textCenterAligned}>{text}</Text>

    <Spacer size={20} />

    {!!tryAgain &&
      <Button
        small
        outlined
        title={t('lbl_tryagain')}
        onPress={tryAgain}
      />
    }
  </View>
);

Error.propTypes = { text: PropTypes.string, tryAgain: PropTypes.func };
Error.defaultProps = { text: t('err_something_wrong'), tryAgain: null };
Error.componentName = 'Error';

/* Export Component ==================================================================== */
export default Error;
