import React from 'react';
import {
  Text,
  View,
  // StyleSheet,
  // Switch,
  // Slider,
  TouchableOpacity,
  // Dimensions,
  Platform,
} from 'react-native';
// import Button from 'react-native-button';

import {
  Player,
  Recorder,
  // MediaStates,
} from 'react-native-audio-toolkit';

import { Icon } from 'react-native-elements';
// import { CircularProgress } from 'react-native-circular-progress';
import { Actions } from 'react-native-router-flux';
import { AppColors } from 'roverz-chat';
// import AudioUtil from './AudioUtil';

const filename = 'mongrov-voice-test.mp4';

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
        if (this.state.recordTime < 300) {
          this.setState({ recordTime: this.state.recordTime + 1 });
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

    this.recorder = new Recorder(filename, {
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
      }
      this._updateState();
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
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 5,
          padding: 5,
          backgroundColor: AppColors.brand().fourth,
        }}
      >
        <View
          style={{
            padding: 3,
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 5,
              width: 70,
              marginRight: 20,
            }}
          >
            <Icon
              raised
              name="microphone"
              type="material-community"
              color={'#ff5608'}
              reverse
            />
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={{
                color: '#fff',
              }}
            >Recording...</Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              margin: 5,
              width: 70,
              marginRight: 20,
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={{
                color: '#fff',
                paddingBottom: 20,
                fontSize: 20,
              }}
            >{`${(this.state.recordTime) < 10 ? '0' : ''}${this.state.recordTime}:00`}</Text>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 5,
              width: 70,
              marginRight: 20,
            }}
            onPress={() => {
              this._toggleRecord();
            }}
          >
            <Icon
              raised
              name="done"
              type="MaterialIcons"
              // color={'#ff5608'}
              color={'green'}
              reverse
            />
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={{
                color: '#fff',
              }}
            >Send</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 5,
              width: 70,
            }}
            onPress={() => {
              this.setState({ cancelled: true });
              this._toggleRecord();
            }}
          >
            <Icon
              raised
              name="cancel"
              type="Navigation"
              color={'red'}
              reverse
            />
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={{
                color: '#fff',
              }}
            >Cancel</Text>
          </TouchableOpacity>
          <View style={{ flex: 2 }} />
        </View>
      </View>
    );
  }
}

