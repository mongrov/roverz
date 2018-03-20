import React from 'react';
import {
  Text,
  View,
  // StyleSheet,
  // Switch,
  // Slider,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
// import Button from 'react-native-button';

import {
  Player,
  Recorder,
  // MediaStates,
} from 'react-native-audio-toolkit';

import { Icon } from 'react-native-elements';
import { CircularProgress } from 'react-native-circular-progress';
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

export default class AudioUpload extends React.Component {
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
        if (this.state.recordTime < 15) {
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
      if (stopped) {
        clearInterval(this._recordInterval);
        this.setState({ recordTime: 0 });
        this._reloadPlayer();
        this._reloadRecorder();
        this.setState({ recorderView: false });
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

  renderRecView = () => {
    const { height, width } = Dimensions.get('window');
    return (
      <View
        style={{
          flex: 1,
          paddingTop: height > width ? height / 3 : 20,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            width: 150,
            height: 150,
            position: 'relative',
          }}
          activeOpacity={0.9}
          onPressIn={() => this._toggleRecord()}
          onPressOut={() => this._toggleRecord()}
        >
          <View
            style={{
              position: 'absolute',
              width: 150,
              height: 150,
              zIndex: 0,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 75,
              backgroundColor: '#e00000',
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: 150,
              height: 150,
              zIndex: 10,
            }}
          >
            <CircularProgress
              size={150}
              width={10}
              fill={(this.state.recordTime / 15) * 100}
              tintColor="#FFF"
              backgroundColor="#af0000"
              style={{ backgroundColor: 'rgba(0,0,0,0)' }}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              width: 150,
              height: 150,
              zIndex: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon
              name={'microphone'}
              type="material-community"
              size={40}
              color={'#FFF'}
            />
            <Text style={{
              fontSize: 12,
              marginTop: 5,
              fontFamily: 'OpenSans-Regular',
              color: '#FFF',
              backgroundColor: 'rgba(0,0,0,0)',
            }}
            >
              {`${(15 - this.state.recordTime) < 10 ? '0' : ''}${15 - this.state.recordTime}:00`}
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, marginTop: 15, fontFamily: 'OpenSans-Regular', color: '#FFF' }}>
          Hold to record, release to preview.
        </Text>
      </View>
    );
  }

  renderPlayView = () => {
    const { height, width } = Dimensions.get('window');
    return (
      <View
        style={{
          flex: 1,
          paddingTop: height > width ? height / 3 : 20,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            width: 150,
            height: 150,
            position: 'relative',
          }}
          activeOpacity={0.9}
          onPress={() => this._playPause()}
        >
          <View
            style={{
              position: 'absolute',
              width: 150,
              height: 150,
              zIndex: 0,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 75,
              backgroundColor: '#e00000',
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: 150,
              height: 150,
              zIndex: 10,
            }}
          >
            <CircularProgress
              size={150}
              width={10}
              fill={this.state.progress * 100}
              tintColor="#FFF"
              backgroundColor="#af0000"
              style={{ backgroundColor: 'rgba(0,0,0,0)' }}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              width: 150,
              height: 150,
              zIndex: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon
              name={this.state.playerButton}
              type="material-community"
              size={40}
              color={'#FFF'}
            />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, marginTop: 15, fontFamily: 'OpenSans-Regular', color: '#FFF' }}>
          Tap to play.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 15,
          }}
        >
          <TouchableOpacity
            style={{
              marginHorizontal: 5,
              width: 100,
              paddingVertical: 10,
              borderRadius: 5,
              backgroundColor: AppColors.brand().primary,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() => {
              // this.setState({ recorderView: true });
              Actions.pop();
            }}
          >
            <Icon
              name={'delete'}
              type="material-community"
              size={15}
              color={'#FFF'}
            />
            <Text style={{ fontSize: 14, marginLeft: 5, fontFamily: 'OpenSans-Regular', color: '#FFF' }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginHorizontal: 5,
              width: 100,
              paddingVertical: 10,
              borderRadius: 5,
              backgroundColor: AppColors.brand().primary,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() => {
              Actions.pop();
              setTimeout(() => {
                Actions.refresh({
                  attach: {
                    cameraData: { path: Platform.OS === 'ios' ? this.state.filePath : `file://${this.state.filePath}` }, // data,
                    cameraMessage: 'Audio message',
                    video: false,
                  },
                });
              }, 0);
              // console.log(' ezhil send ');
              // const data = { path: `file://${this.state.filePath}` };
              // new AudioUtil().uploadAudio(data, 'hHx2wGbMSjJcegQFf', 'audio test message',
              //   (fuFileName, fuPercent, fuMsg) => {
              //     const percentage = Math.round(Number(parseFloat(fuPercent).toFixed(2) * 100));
              //     console.log('Ezhil audio upload % ', fuMsg, percentage);
              //   });
            }}
          >
            <Icon
              name={'send'}
              type="material-community"
              size={15}
              color={'#FFF'}
            />
            <Text style={{ fontSize: 14, marginLeft: 5, fontFamily: 'OpenSans-Regular', color: '#FFF' }}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // oldRender() {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         // backgroundColor: 'red',
  //       }}
  //     >
  //       <View style={styles.buttonContainer}>
  //         <Button disabled={this.state.playButtonDisabled} style={styles.button} onPress={() => this._playPause()}>
  //           {this.state.playPauseButton}
  //         </Button>
  //         <Button disabled={this.state.stopButtonDisabled} style={styles.button} onPress={() => this._stop()}>
  //           Stop
  //         </Button>
  //       </View>
  //       <View style={styles.settingsContainer}>
  //         <Switch
  //           onValueChange={value => this._toggleLooping(value)}
  //           value={this.state.loopButtonStatus}
  //         />
  //         <Text>Toggle Looping</Text>
  //       </View>
  //       <CircularProgress
  //         size={100}
  //         width={10}
  //         fill={this.state.progress * 100}
  //         tintColor="#00e0ff"
  //         backgroundColor="#3d5875"
  //       />
  //       <View style={[styles.slider, { zIndex: 100 }]}>
          // <Slider
          //   step={0.0001}
          //   disabled={this.state.playButtonDisabled}
          //   onValueChange={percentage => this._seek(percentage)}
          //   value={this.state.progress} />
  //       </View>
  //       <View
  //         style={{
  //           flex: 1,
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //         }}
  //       >
  //         <TouchableOpacity
  //           style={{
  //             width: 100,
  //             height: 100,
  //             position: 'relative',
  //           }}
  //           activeOpacity={0.9}
  //           onPressIn={() => this._toggleRecord()}
  //           onPressOut={() => this._toggleRecord()}
  //         >
  //           <View
  //             style={{
  //               position: 'absolute',
  //               width: 100,
  //               height: 100,
  //               zIndex: 0,
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //               borderRadius: 50,
  //               backgroundColor: '#e00000',
  //             }}
  //           />
  //           <View
  //             style={{
  //               position: 'absolute',
  //               width: 100,
  //               height: 100,
  //               zIndex: 10,
  //             }}
  //           >
  //             <CircularProgress
  //               size={100}
  //               width={10}
  //               fill={(this.state.recordTime / 15) * 100}
  //               tintColor="#00e0ff"
  //               backgroundColor="#3d5875"
  //               style={{ backgroundColor: 'rgba(0,0,0,0)' }}
  //             />
  //           </View>
  //           <View
  //             style={{
  //               position: 'absolute',
  //               width: 100,
  //               height: 100,
  //               zIndex: 20,
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //             }}
  //           >
  //             <Icon
  //               name={'microphone'}
  //               type="material-community"
  //               size={30}
  //               color={'#FFF'}
  //             />
  //           </View>
  //         </TouchableOpacity>
  //         <Text style={{ marginTop: 10, fontFamily: 'OpenSans-Regular' }}>
  //           {`${(15 - this.state.recordTime) < 10 ? '0' : ''}${15 - this.state.recordTime}:00`}
  //         </Text>
  //       </View>
  //       <View style={styles.buttonContainer}>
  //         <Button
  //          disabled={this.state.recordButtonDisabled}
  //           style={styles.button}
  //            onPress={() => this._toggleRecord()}>
  //           {this.state.recordButton}
  //         </Button>
  //       </View>
  //       <View>
  //         <Text style={styles.errorMessage}>{this.state.error}</Text>
  //       </View>
  //     </View>
  //   );
  // }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#000',
        }}
      >
        {this.state.recorderView ? this.renderRecView() : this.renderPlayView()}
      </View>
    );
  }
}

