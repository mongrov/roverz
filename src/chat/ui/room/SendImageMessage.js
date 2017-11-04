import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

import {
  Icon,
} from 'react-native-elements';
import PropTypes from 'prop-types';

import { Actions } from 'react-native-router-flux';
import Group from '../../../models/group';

const styles = StyleSheet.create({
  viewContainer: {
    width: 70,
    height: 30,
    flexDirection: 'row',
    marginLeft: 10,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 26,
    height: 26,
    flex: 1,
  },
  container: {
    width: 26,
    height: 26,
    flex: 1,
  },
});

export default class SendImageMessage extends React.Component {
  constructor(props) {
    super(props);
    const groupId = this.props.group._id;
    this.state = {
      groupId,
    };
  }

  render() {
    return (
      <View style={[styles.viewContainer]}>
        <TouchableOpacity
          style={[styles.container, this.props.containerStyle]}
          onPress={() => Actions.photoLibrary({
            groupId: this.state.groupId,
            progressCallback: this.props.progressCallback,
            duration: 0,
          })}
        >
          <View style={[styles.iconContainer]}>
            <Icon
              name="attach-file"
              size={28}
              color="#b2b2b2"
            />
          </View>
        </TouchableOpacity>
        <Icon
          name="camera-alt"
          size={28}
          onPress={() => Actions.cameraActions({
            groupId: this.state.groupId,
            progressCallback: this.props.progressCallback,
            duration: 0,
          })}
          color="#b2b2b2"
          width={30}
        />
      </View>
    );
  }
}

SendImageMessage.contextTypes = {
  actionSheet: React.PropTypes.func,
};

SendImageMessage.defaultProps = {
  onSend: () => {},
  // options: {},
  icon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {},
  group: null,
  progressCallback: () => {},
};

SendImageMessage.propTypes = {
  onSend: React.PropTypes.func,
  // options: React.PropTypes.shape,
  icon: React.PropTypes.func,
  containerStyle: View.propTypes.style,
  wrapperStyle: View.propTypes.style,
  iconTextStyle: Text.propTypes.style,
  group: PropTypes.instanceOf(Group),
  progressCallback: PropTypes.func,
};
