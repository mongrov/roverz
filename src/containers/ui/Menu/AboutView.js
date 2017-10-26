import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
} from 'react-native';

import { AppStyles, AppColors } from '../../../theme';
import AppConfig from '../../../constants/config';

const styles = StyleSheet.create({
  paraText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: 'rgba(255,255,255,0.7)',
  },
  paraTextLight: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: 'rgba(255,255,255,0.5)',
  },
  headText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: 'rgba(255,255,255,1)',
  },
});

export default class AboutView extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: AppColors.brand().secondary,
          padding: 15,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Image
            source={AppConfig.logo} // eslint-disable-line global-require
            style={{
              opacity: 1,
              width: 150,
              resizeMode: 'contain',
            }}
          />
        </View>
        <View style={[AppStyles.windowSize, {
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
        }]}
        >
          <View style={{ alignItems: 'center' }}>
            <Text
              style={[styles.headText]}
            >{`Version: ${AppConfig.aboutDetails.version}`}</Text>
            <Text
              style={[styles.paraText]}
            >{`Build: ${AppConfig.aboutDetails.build}`}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={[styles.paraText]}
            >{AppConfig.aboutDetails.website}</Text>
            <Text
              style={[styles.paraText]}
            >{AppConfig.aboutDetails.email}</Text>
          </View>
          <View>
            <Text
              style={[styles.paraTextLight]}
            >{AppConfig.aboutDetails.company}</Text>
          </View>
        </View>
      </View>
    );
  }
}

AboutView.defaultProps = {
};

AboutView.propTypes = {
};
