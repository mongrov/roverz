/**
 * PhotoBrowser Screen
 */
import React, { Component } from 'react';

import {
  ActionSheetIOS,
  Platform,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

import PhotoBrowser from 'react-native-photo-browser';
import { Actions } from 'react-native-router-flux';
import Network from '../../network';
import Group from '../../models/group';
import { AppStyles } from '../../theme';

class UploadedPhotos extends Component {

  constructor(props) {
    super(props);
    this._network = new Network();
    this._group = this.props.group;
    this._onSelectionChanged = this._onSelectionChanged.bind(this);
    this._onActionButton = this._onActionButton.bind(this);
    // Get images for chat room gallery
    this.state = {
      image_list: [],
      roomObj: this.props.group,
      loading: true,
    };
  }

  componentDidMount() {
    const _super = this;
    this._network.chat.subscribeAttachments(this._group._id);
    this._callOutstanding = false;
    this._changeListener = (/* attachments, changes */) => {
      // @todo: This check can be removed after upgrading to react-native 0.45
      if (_super._changeListener == null || _super._callOutstanding === true) return;
      const result = _super._group.sortedAttachments;
      if (result && result.length > 0) {
        const imageList = [];
        const fileList = [];
        for (let i = 0; i < result.length; i += 1) {
          fileList.push(result[i]._id);
          imageList.push({
            caption: result[i].fileDesc,
            photo: result[i].fileURL,
          });
        }
        _super._callOutstanding = true;
        _super._network.chat.fixS3Urls(fileList, (s3files) => {
          for (let i = 0; i < imageList.length; i += 1) {
            imageList[i].photo = s3files[i].url;
          }
          _super.setState({
            image_list: imageList,
            loading: false,
          });
          _super._callOutstanding = false;
        });
      }
    };
    this._group.messages.addListener(this._changeListener);
  }

  componentWillUnmount() {
    this._network.chat.unsubscribeAttachments(this._group._id);
    // this._network.meteor.stopMonitoringChanges(this._attachments);
    this._group.messages.removeListener(this._changeListener);
    this._changeListener = null;
  }

  onPopRefresh() {
    Actions.pop({ refresh: { obj: this.state.roomObj } });
  }

  _onSelectionChanged(/* media, index, selected */) {
  }

  _onActionButton(media/* , index */) {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showShareActionSheetWithOptions({
        url: media.photo,
        message: media.caption,
      },
      () => {},
      () => {});
    } else {
      // console.log(`handle sharing on android for ${media.photo}, index: ${index}`);
    }
  }

  render() {
    if (!this.state.loading) {
      return (
        <PhotoBrowser
          onBack={this.onPopRefresh}
          mediaList={this.state.image_list}
          initialIndex={0}
          displayNavArrows={true}
          displaySelectionButtons={false}
          displayActionButton={true}
          startOnGrid={true}
          enableGrid={true}
          useCircleProgress
          onSelectionChanged={this._onSelectionChanged}
          onActionButton={this._onActionButton}
        />
      );
    }
    return (
      <ActivityIndicator
        animating
        size={'large'}
        color={'#C1C5C8'}
        style={[AppStyles.windowSize, AppStyles.containerCentered]}
      />
    );
  }
}

UploadedPhotos.defaultProps = {
  group: null,
};

UploadedPhotos.propTypes = {
  group: PropTypes.instanceOf(Group),
};

/* Export Component ==================================================================== */
export default UploadedPhotos;
