import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Button from 'react-native-button';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

import { Player } from 'react-native-audio-toolkit';
import Slider from 'react-native-slider';

import { AppColors } from '../../../theme/';

const sliderTintColor = AppColors.brand().aP_sliderTintColor;
const iconColor = AppColors.brand().aP_iconColor;

var styles = StyleSheet.create({
  button: {
    padding: 20,
    fontSize: 20,
    backgroundColor: AppColors.brand().aP_buttonBg,
  },
  slider: {
    height: 10,
    margin: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: AppColors.brand().aP_containerBorderColor,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
    color: AppColors.brand().aP_errorMessageColor,
  },
});

export default class AudioPlay extends React.Component {
  constructor() {
    super();

    this.state = {
      playButtonDisabled: true,
      loopButtonStatus: false,
      progress: 0,

      error: null,
    };
  }

  componentWillMount() {
    this.player = null;
    this.recorder = null;
    this.lastSeek = 0;

    // this._reloadPlayer();
    // this._reloadRecorder();

    this._progressInterval = setInterval(() => {
      if (this.player && this._shouldUpdateProgressBar() && this.player.duration > 0) { // && !this._dragging) {
        console.log('this.player.currentTime', Math.max(0, this.player.currentTime) / (this.player.duration));
        this.setState({ progress: Math.max(0, this.player.currentTime) / (this.player.duration) });
      }
    }, 100);
  }

  componentWillUnmount() {
    // console.log('unmount');
    // TODO
    clearInterval(this._progressInterval);
    if (this.player !== null) {
      this._stop();
    }
  }

  _shouldUpdateProgressBar() {
    // Debounce progress bar update by 200 ms
    return Date.now() - this.lastSeek > 200;
  }

  _updateState(/* err */) {
    this.setState({
      playButtonDisabled: !this.player, // || !this.player.canPlay || this.recorder.isRecording,
    });
  }

  _playPause() {
    this.player.playPause((err /* , playing */) => {
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

    this.player = new Player(this.props.audioFile, {
      autoDestroy: false,
    }).prepare((err) => {
      if (err) {
        console.log('error at _reloadPlayer():');
        console.log(err);
      } else {
        this.player.looping = this.state.loopButtonStatus;
        // this._playPause();
        this.player.play();
      }

      this._updateState();
    });

    // this._updateState();

    this.player.on('ended', () => {
      this._updateState();
      this.setState({ playButtonDisabled: true });
    });
    this.player.on('pause', () => {
      this._updateState();
    });
  }

  render() {
    return (
      <View style={{
        width: 250,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
      }}
      >
        <View style={{
          marginLeft: 15,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          {
            (this.state.playButtonDisabled) &&
            <Button
              onPress={() => {
                this._reloadPlayer();
              }}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: AppColors.brand().third,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15,
                }}
              >
                <Icon
                  name={'play'}
                  type="material-community"
                  size={20}
                  color={iconColor}
                />
              </View>
            </Button>
          }
          {
            (!this.state.playButtonDisabled) &&
            <Button
              onPress={() => {
                this._playPause();
              }}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: AppColors.brand().third,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15,
                }}
              >
                <Icon
                  name={'stop'}
                  type="material-community"
                  size={20}
                  color={iconColor}
                />
              </View>
            </Button>
          }
        </View>
        <View style={[styles.slider, { flex: 1, zIndex: 50, height: 40 }]}>
          <Slider
            step={0.0001}
            disabled={this.state.playButtonDisabled}
            onValueChange={percentage => this._seek(percentage)}
            value={this.state.progress}
            minimumTrackTintColor={AppColors.brand().third}
            maximumTrackTintColor={sliderTintColor}
            thumbStyle={{
              width: 10,
              height: 10,
              backgroundColor: AppColors.brand().third,
              borderRadius: 10 / 2,
              shadowColor: AppColors.brand().third,
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 2,
              shadowOpacity: 1,
            }}
          />
        </View>
      </View>
    );
  }
}

AudioPlay.defaultProps = {
  audioFile: '',
};

AudioPlay.propTypes = {
  audioFile: PropTypes.string,
};
