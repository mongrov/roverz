import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import t from '../../i18n/';

import { AppStyles, AppColors } from '../../theme';
import { Button } from '../../components/ui/';

const styles = StyleSheet.create({
  paraText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: AppColors.brand().seventh,
  },
  paraTextLight: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: AppColors.brand().eighth,
  },
  headText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: AppColors.brand().ninth,
  },
});

export default class AboutView extends React.Component {
  constructor(props) {
    super(props);
    const logo = this.props.logo;
    const instance = this.props.instance;
    const aboutDetails = this.props.aboutDetails;
    this.state = {
      logo,
      instance,
      aboutDetails,
    };
  }

  componentWillMount() {
    this.setState({
      logo: this.props.logo,
      instance: this.props.instance,
      aboutDetails: this.props.aboutDetails,
    });
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
              width: 270,
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
            <View style={{ marginTop: 20 }} />
            <Button
              title={t('lbl_help')}
              onPress={Actions.helpView}
              backgroundColor="transparent"
              small
              buttonStyle={{ paddingHorizontal: 20 }}
              fontWeight={'600'}
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
  instance: '',
  aboutDetails: {},
};

AboutView.propTypes = {
  logo: PropTypes.number,
  instance: PropTypes.string,
  aboutDetails: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};
