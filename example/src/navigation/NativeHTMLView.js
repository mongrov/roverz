import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import HTMLView from 'react-native-htmlview';
import PropTypes from 'prop-types';
import { AppColors, AppFonts } from 'roverz-chat';

const styles = StyleSheet.create({
  h3: {
    fontFamily: AppFonts.base.family,
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.brand().third,
  },
  p: {
    fontFamily: AppFonts.base.family,
    fontSize: 14,
    fontWeight: '400',
  },
  img: {
    alignContent: 'center',
    justifyContent: 'center',
  },
});

export default class NativeHTMLView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: this.props.htmlContent,
    };
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, paddingHorizontal: 15 }}>
        <HTMLView value={this.state.content} stylesheet={styles} />
      </ScrollView>
    );
  }
}

NativeHTMLView.defaultProps = {
  htmlContent: '',
};

NativeHTMLView.propTypes = {
  htmlContent: PropTypes.string,
};
