import React from 'react';

import { Actions } from 'react-native-router-flux';
import PhotoBrowser from 'react-native-photo-browser';
import PropTypes from 'prop-types';

export default class PhotoPreview extends React.Component {
  constructor(props) {
    super(props);
    const imgUrl = this.props.imgUrl;
    const imgTitle = this.props.imgTitle;
    this.state = {
      imgUrl,
      imgTitle,
    };
  }

  render() {
    return (
      <PhotoBrowser
        onBack={Actions.pop}
        mediaList={[
          {
            photo: this.state.imgUrl,
            caption: this.state.imgTitle,
          },
        ]}
        initialIndex={0}
        displayNavArrows={false}
        displaySelectionButtons={false}
        displayActionButton={true}
        startOnGrid={false}
        enableGrid={false}
        useCircleProgress
        // onActionButton={this._onActionButton}
      />
    );
  }
}

PhotoPreview.defaultProps = {
  imgUrl: '',
  imgTitle: '',
};

PhotoPreview.propTypes = {
  imgUrl: PropTypes.string,
  imgTitle: PropTypes.string,
};

