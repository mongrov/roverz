/**
 * Alerts - Status/Success/Error Messages
 *
    <Alerts
      error={'Error hey'}
      success={'Hello Success'}
      status={'Something\'s happening...'}
    />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';
import { AppColors } from '../../theme/';
// Components
import { Spacer, Text } from './';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  alerts: {
    left: 0,
    right: 0,
  },

 // Success
  msg: {
    right: 0,
    left: 0,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderLeftWidth: 3,
    borderColor: AppColors.brand().aT_msgborderColor,
    backgroundColor: AppColors.brand().aT_msgbackgroundColor,
  },
  msg_text: {
    textAlign: 'center',
    color: AppColors.brand().aT_msgtextborderColor,
    fontWeight: '300',
  },

// Error
  msgError: {
    borderColor: AppColors.brand().aT_msgErrorborderColor,
    backgroundColor: AppColors.brand().aT_msgErrorbackgroundColor,
  },
  msgError_text: {
    color: AppColors.brand().aT_msgErrorTextColor,
  },

// Status
  msgStatus: {
    borderColor: AppColors.brand().aT_msgStatusBorderColor,
    backgroundColor: AppColors.brand().aT_msgStatusbackgroundColor,
  },
  msgStatus_text: {
    color: AppColors.brand().aT_msgStatustextColor,
  },
});

/* Component ==================================================================== */
const Alerts = ({ status, success, error }) => (
  <View style={styles.alerts}>
    {!!success &&
      <View>
        <View style={[styles.msg]}>
          <Text style={[styles.msg_text]}>{success}</Text>
        </View>
        <Spacer size={20} />
      </View>
    }

    {!!status &&
      <View>
        <View style={[styles.msg, styles.msgStatus]}>
          <Text style={[styles.msg_text, styles.msgStatus_text]}>
            {status}
          </Text>
        </View>
        <Spacer size={20} />
      </View>
    }

    {!!error &&
      <View>
        <View style={[styles.msg, styles.msgError]}>
          <Text
            style={[
              styles.msg_text,
              styles.msgError_text,
            ]}
          >
            {error}
          </Text>
        </View>
        <Spacer size={20} />
      </View>
    }
  </View>
);

Alerts.propTypes = {
  status: PropTypes.string,
  success: PropTypes.string,
  error: PropTypes.string,
};

Alerts.defaultProps = {
  status: '',
  success: '',
  error: '',
};

Alerts.componentName = 'Alerts';

/* Export Component ==================================================================== */
export default Alerts;
