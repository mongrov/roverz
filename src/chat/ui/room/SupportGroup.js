import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import Network from '../../../network';

export default class SupportGroup extends React.Component {
  constructor(props) {
    super(props);
    this.supportGroup = null;
  }

  componentWillMount() {
    const net = new Network();
    this.supportGroup = net.db.groups.findById('9Qk2grAwqeqfCiweR');
  }

  componentDidMount() {
    Actions.supportGroup({ obj: this.supportGroup });
  }

  render() {
    return (
      <View style={{ paddingTop: 100 }}>
        <Text>SupportGroup</Text>
      </View>
    );
  }
}

SupportGroup.defaultProps = {
};

SupportGroup.propTypes = {
};
