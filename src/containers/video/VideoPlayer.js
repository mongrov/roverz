import React, { Component } from 'react';
import {
  // StatusBar,
  View,
  TouchableOpacity,
  StyleSheet,
  // Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Icon } from 'react-native-elements';
import Video from 'react-native-video-player';
import PropTypes from 'prop-types';
import { AppColors } from '../../theme';

// const VIMEO_ID = '179859217'; // 179859217
const thumbnailImg = require('../../images/video-thumb.jpg');

const iconColor = AppColors.brand().vP_iconColor;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.brand().vP_containerBg,
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 5,
    backgroundColor: AppColors.brand().vP_backButtonBg,
    borderRadius: 20,
    zIndex: 999,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'black',
//   },
//   fullScreen: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//   },
//   controls: {
//     backgroundColor: 'transparent',
//     borderRadius: 5,
//     position: 'absolute',
//     bottom: 44,
//     left: 4,
//     right: 4,
//   },
//   progress: {
//     flex: 1,
//     flexDirection: 'row',
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   innerProgressCompleted: {
//     height: 20,
//     backgroundColor: '#cccccc',
//   },
//   innerProgressRemaining: {
//     height: 20,
//     backgroundColor: '#2C2C2C',
//   },
//   generalControls: {
//     flex: 1,
//     flexDirection: 'row',
//     overflow: 'hidden',
//     paddingBottom: 10,
//   },
//   skinControl: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   rateControl: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   volumeControl: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   resizeModeControl: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   ignoreSilentSwitchControl: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   controlOption: {
//     alignSelf: 'center',
//     fontSize: 11,
//     color: 'white',
//     paddingLeft: 2,
//     paddingRight: 2,
//     lineHeight: 12,
//   },
//   nativeVideoControls: {
//     top: 300,
//     height: 300,
//   },
// });

export default class VideoPlayer extends Component {
  constructor() {
    super();

    this.state = {
      video: { width: undefined, height: undefined, duration: undefined },
      thumbnailUrl: undefined,
      videoUrl: undefined,

      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0.0,
      currentTime: 0.0,
      controls: false,
      paused: true,
      skin: 'embed',
      ignoreSilentSwitch: null,
      isBuffering: false,
      opacity: 0,
    };

    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onBuffer = this.onBuffer.bind(this);
  }

  componentWillMount() {
    // global.fetch(`https://player.vimeo.com/video/${VIMEO_ID}/config`)
    //   .then(res => res.json())
    //   .then(res => this.setState({
    //     thumbnailUrl: res.video.thumbs['640'],
    //     videoUrl: res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
    //     video: res.video,
    //   }));
    this.setState({
      // thumbnailUrl: res.video.thumbs['640'],
      videoUrl: this.props.videoUrl,
      // video: res.video,
    });
  }

  onLoadStart = () => {
    this.setState({ opacity: 1 });
  }

  onLoad(data) {
    // console.log('On load fired!');
    this.setState({ duration: data.duration, opacity: 0 });
  }

  onProgress(data) {
    this.setState({ currentTime: data.currentTime });
  }

  onBuffer = ({ isBuffering }) => {
    this.setState({ opacity: isBuffering ? 1 : 0 });
  }


  render() {
    // const { height, width } = Dimensions.get('window');
    return (
      <View
        style={styles.container}
      >
        <TouchableOpacity
          style={[styles.backButton]}
          onPress={Actions.pop}
        >
          <Icon
            name="arrow-back"
            size={30}
            color={iconColor}
            width={30}
          />
        </TouchableOpacity>
        <Video
          // endWithThumbnail
          autoplay
          disableFullscreen
          disableControlsAutoHide
          thumbnail={thumbnailImg}
          video={{ uri: this.state.videoUrl }}
          videoWidth={this.state.video.width}
          videoHeight={this.state.video.height}
          duration={this.state.video.duration/* I'm using a hls stream here, react-native-video
            can't figure out the length, so I pass it here from the vimeo config */}

          // style={styles.fullScreen}
          rate={this.state.rate}
          paused={this.state.paused}
          volume={this.state.volume}
          muted={this.state.muted}
          ignoreSilentSwitch={this.state.ignoreSilentSwitch}
          resizeMode={this.state.resizeMode}
          onLoad={this.onLoad}
          onBuffer={this.onBuffer}
          onProgress={this.onProgress}
          onHideControls={this.onHideControls}
          onShowControls={this.onShowControls}
          repeat={true}
          onLoadStart={this.onLoadStart}
        />
        <ActivityIndicator
          animating
          size="large"
          color={'#FFF'}
          style={{
            position: 'absolute',
            left: 70,
            right: 70,
            height: 50,
            opacity: this.state.opacity,
          }}
        />
      </View>
    );
  }
}

VideoPlayer.defaultProps = {
  videoUrl: '',
  // cameraData: {},
};

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string,
  // cameraData: React.PropTypes.object,
};
