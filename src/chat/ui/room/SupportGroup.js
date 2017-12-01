import React from 'react';
import {
  View,
  Text,
} from 'react-native';
// import { Actions } from 'react-native-router-flux';
import RoomView from './RoomView';

import { AppStyles, AppSizes } from '../../../theme/';
import Network from '../../../network';
import t from '../../../i18n';

export default class SupportGroup extends React.Component {
  constructor(props) {
    super(props);
    this.supportGroup = null;
  }

  componentWillMount() {
    const net = new Network();
    this.supportGroup = net.db.groups.findByName('support');
  }

  render() {
    return (
      <View
        style={[AppStyles.container, {
          marginTop: -(AppSizes.navbarHeight),
          paddingBottom: 5,
        }]}
      >
        {
          this.supportGroup &&
          <RoomView obj={this.supportGroup} />
        }
        {
          !this.supportGroup &&
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'OpenSans-Regular',
                fontWeight: '500',
              }}
            >{t('txt_CS')}</Text>
          </View>
        }
      </View>
    );
  }
}

SupportGroup.defaultProps = {
};

SupportGroup.propTypes = {
};
