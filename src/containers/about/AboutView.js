import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';

import { AppStyles, AppColors } from '../../theme';
import { Button } from '../../components/ui/';

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
  constructor(props) {
    super(props);
    const logo = this.props.logo;
    const aboutDetails = this.props.aboutDetails;
    this.state = {
      logo,
      aboutDetails,
    };
  }

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
            source={this.state.logo}
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
            >{this.state.instance}</Text>
            <Text
              style={[styles.headText]}
            >{`Version: ${this.state.aboutDetails.version}`}</Text>
            <Text
              style={[styles.paraText]}
            >{`Build: ${this.state.aboutDetails.build}`}</Text>
            <Button
              title={'Help'}
              onPress={Actions.helpView}
              backgroundColor="transparent"
              small
              buttonStyle={{ paddingHorizontal: 20, marginTop: 20 }}
              fontWeight={'600'}
              style={[]}
            />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={[styles.paraText]}
            >{this.state.aboutDetails.website}</Text>
            <Text
              style={[styles.paraText]}
            >{this.state.aboutDetails.email}</Text>
          </View>
          <View>
            <Text
              style={[styles.paraTextLight]}
            >{this.state.aboutDetails.company}</Text>
          </View>
        </View>
      </View>
    );
  }
}

AboutView.defaultProps = {
  logo: null,
  aboutDetails: {},
};

AboutView.propTypes = {
  logo: PropTypes.number,
  aboutDetails: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};
