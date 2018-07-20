import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  // Switch,
  // Slider,
  TouchableOpacity,
  // Dimensions,
  Platform,
} from 'react-native';
// import Button from 'react-native-button';
import { isIphoneX } from 'react-native-iphone-x-helper';
import {
  Player,
  Recorder,
  // MediaStates,
} from 'react-native-audio-toolkit';
import moment from 'moment';

import { Icon } from 'react-native-elements';
// import { CircularProgress } from 'react-native-circular-progress';
import { Actions } from 'react-native-router-flux';
import { AppColors } from '../../theme';
// import AudioUtil from './AudioUtil';

const filename = 'mongrov-voice-test.mp4';
const sendIconColor = AppColors.brand().aA_sendIconColor;
const cancelColor = AppColors.brand().aA_cancelColor;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 5,
    padding: 5,
  },
  subcontainer: {
    flex: 1,
    flexDirection: 'row',
  },
  timerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  textColor: {
    color: AppColors.brand().aA_textColor,
  },
  timerText: {
    color: AppColors.brand().aA_textColor,
    paddingBottom: 20,
    fontSize: 20,
  },
  iconView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
});

// var styles = StyleSheet.create({
//   button: {
//     padding: 20,
//     fontSize: 20,
//     backgroundColor: 'white',
//   },
//   slider: {
//     height: 10,
//     margin: 10,
//   },
//   buttonContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   settingsContainer: {
//     flex: 1,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   container: {
//     borderRadius: 4,
//     borderWidth: 0.5,
//     borderColor: '#d6d7da',
//   },
//   title: {
//     fontSize: 19,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     padding: 20,
//   },
//   errorMessage: {
//     fontSize: 15,
//     textAlign: 'center',
//     padding: 10,
//     color: 'red',
//   },
// });

export default class AttachAudio extends React.Component {
  constructor() {
    super();

    this.state = {
      playPauseButton: 'Preparing...',
      recordButton: 'Preparing...',

      stopButtonDisabled: true,
      playButtonDisabled: true,
      recordButtonDisabled: true,

      loopButtonStatus: false,
      progress: 0,

      error: null,
      recordTime: 0,

      recorderView: true,
      filePath: '',
      cancelled: false,
    };
  }

  componentWillMount() {
    this.player = null;
    this.recorder = null;
    this.lastSeek = 0;

    this._reloadPlayer();
    this._reloadRecorder();

    this._progressInterval = setInterval(() => {
      if (this.player && this._shouldUpdateProgressBar()) { // && !this._dragging) {
        this.setState({ progress: Math.max(0, this.player.currentTime) / this.player.duration });
      }
    }, 100);
  }

  componentDidMount() {
    this._toggleRecord();
  }

  componentWillUnmount() {
    // console.log('unmount');
    // TODO
    clearInterval(this._progressInterval);
    clearInterval(this._recordInterval);
  }

  _shouldUpdateProgressBar() {
    // Debounce progress bar update by 200 ms
    return Date.now() - this.lastSeek > 200;
  }

  _updateState(/* err */) {
    this.setState({
      playPauseButton: this.player && this.player.isPlaying ? 'Pause' : 'Play',
      playerButton: this.player && this.player.isPlaying ? 'stop' : 'play',
      recordButton: this.recorder && this.recorder.isRecording ? 'Stop' : 'Record',
      // recordIcon: this.recorder && this.recorder.isRecording ? 'microphone-off' : 'microphone',

      stopButtonDisabled: !this.player || !this.player.canStop,
      playButtonDisabled: !this.player || !this.player.canPlay || this.recorder.isRecording,
      recordButtonDisabled: !this.recorder || (this.player && !this.player.isStopped),
    });
    if (this.recorder && this.recorder.isRecording) {
      console.log('KRec 2', this.recorder);
      this.setState({ filePath: this.recorder._fsPath });
      this._recordInterval = setInterval(() => {
        if (this.state.recordTime < 300) {      // Timeout 5 Min  to send
          console.log('time', this.state.recordTime);
          this.setState({ recordTime: this.state.recordTime + 1 });
          console.log('running-time', this.state.recordTime);
        } else {
          clearInterval(this._recordInterval);
          this._toggleRecord();
        }
      }, 1000);
    }
  }

  _playPause() {
    this.player.playPause((err/* , playing */) => {
      if (err) {
        this.setState({
          error: err.message,
        });
      }
      this._updateState();
    });
  }

  _stop() {
    this.player.stop(() => {
      this._updateState();
    });
  }

  _seek(percentage) {
    if (!this.player) {
      return;
    }

    this.lastSeek = Date.now();

    const position = percentage * this.player.duration;

    this.player.seek(position, () => {
      this._updateState();
    });
  }

  _reloadPlayer() {
    if (this.player) {
      this.player.destroy();
    }

    this.player = new Player(filename, {
      autoDestroy: false,
    }).prepare((err) => {
      if (err) {
        console.log('error at _reloadPlayer():');
        console.log(err);
      } else {
        this.player.looping = this.state.loopButtonStatus;
      }

      this._updateState();
    });

    this.player.volume = 1;

    this._updateState();

    this.player.on('ended', () => {
      this._updateState();
    });
    this.player.on('pause', () => {
      this._updateState();
    });
  }

  _reloadRecorder() {
    if (this.recorder) {
      this.recorder.destroy();
    }

    this.recorder = new Recorder(`${moment().unix().toString()}.mp4`, {
      bitrate: 256000,
      channels: 2,
      sampleRate: 44100,
      quality: 'max',
      // format: 'ac3', // autodetected
      // encoder: 'aac', // autodetected
    });

    console.log('KRec', this.recorder);

    this._updateState();
  }

  _toggleRecord() {
    console.log('record');
    if (this.player) {
      this.player.destroy();
    }

    this.recorder.toggleRecord((err, stopped) => {
      if (err) {
        this.setState({
          error: err.message,
        });
      }
      if (stopped && !this.state.cancelled) {
        clearInterval(this._recordInterval);
        Actions.refresh({
          attachAudio: false,
          attach: {
            cameraData: { path: Platform.OS === 'ios' ? this.state.filePath : `file://${this.state.filePath}` }, // data,
            cameraMessage: 'Audio message',
            video: false,
          },
        });
        // this.setState({ recordTime: 0 });
        // this._reloadPlayer();
        // this._reloadRecorder();
        // this.setState({ recorderView: false });
      } else if (stopped && this.state.cancelled) {
        clearInterval(this._recordInterval);
        Actions.refresh({
          attachAudio: false,
        });
      } else if (!stopped) {
        this._updateState();
      }
    });
  }

  _toggleLooping(value) {
    this.setState({
      loopButtonStatus: value,
    });
    if (this.player) {
      this.player.looping = value;
    }
  }

  render() {
    const recT = this.state.recordTime;
    const recM = (recT - (recT % 60)) / 60;
    const recS = (recT % 60);
    return (
      <View
        style={[styles.container,
          { backgroundColor: AppColors.brand().fourth,
            paddingBottom: isIphoneX() ? 35 : null,
          }]}
      >
        <View
          style={styles.subcontainer}
        >
          <View
            style={styles.iconView}
          >
            <Icon
              raised
              name="record"
              type="material-community"
              color={'#ff5608'}
              reverse
            />
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={styles.textColor}
            >Recording...</Text>
          </View>
          <View
            style={styles.timerView}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={[styles.timerText]}
            >{`${recM < 10 ? '0' : ''}${recM}:${recS < 10 ? '0' : ''}${recS}`}</Text>
          </View>
          <TouchableOpacity
            style={styles.iconView}
            onPress={() => {
              this._toggleRecord();
            }}
          >
            <Icon
              raised
              name="send"
              color={sendIconColor}
              reverse
            />
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={styles.textColor}
            >Send</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconView}
            onPress={() => {
              this.setState({ cancelled: true });
              this._toggleRecord();
            }}
          >
            <Icon
              raised
              name="delete"
              color={cancelColor}
              reverse
            />
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={styles.textColor}
            >Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
