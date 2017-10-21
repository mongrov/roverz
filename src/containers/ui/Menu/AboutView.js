import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
} from 'react-native';

import { AppStyles, AppColors } from '@theme';

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
          backgroundColor: AppColors.brand.secondary,
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
            source={require('../../../images/logo.png')} // eslint-disable-line global-require
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
            >Version: 2.0.1</Text>
            <Text
              style={[styles.paraText]}
            >Build: 1020</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={[styles.paraText]}
            >www.mongrov.com</Text>
            <Text
              style={[styles.paraText]}
            >support@mongrov.com</Text>
          </View>
          <View>
            <Text
              style={[styles.paraTextLight]}
            >Powered by Mongrov, Inc.</Text>
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
