/**
 * List Items
 *
     <ListItem title={'Hello World'} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem } from 'react-native-elements';

// Consts and Libs
import { AppColors, AppStyles } from '../../theme/';

/* Component ==================================================================== */
class CustomListItem extends Component {
  static propTypes = {
    containerStyle: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({}),
    ]),
    titleStyle: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({}),
    ]),
    subtitleStyle: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({}),
    ]),
    avatarStyle: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({}),
    ]),
  }

  static defaultProps = {
    containerStyle: [],
    titleStyle: [],
    subtitleStyle: [],
    avatarStyle: [],
  }

  listItemProps = () => {
    // Defaults
    const props = {
      title: 'Coming Soon...',
      chevronColor: AppColors.textSecondary,
      underlayColor: AppColors.border,
      ...this.props,
      containerStyle: [{
        backgroundColor: AppColors.listItemBackground,
        paddingTop: 12,
        paddingBottom: 12,
        borderTopColor: AppColors.border,
        borderBottomColor: AppColors.border,
      }],
      titleStyle: [AppStyles.ListItemTitle],
      subtitleStyle: [AppStyles.subtext1],
      avatarStyle: [AppStyles.avatar],
    };

    if (this.props.containerStyle) {
      props.containerStyle.push(this.props.containerStyle);
    }

    if (this.props.titleStyle) {
      props.titleStyle.push(this.props.titleStyle);
    }

    if (this.props.subtitleStyle) {
      props.subtitleStyle.push(this.props.subtitleStyle);
    }

    if (this.props.avatarStyle) {
      props.avatarStyle.push(this.props.avatarStyle);
    }


    return props;
  }

  render = () => (<ListItem {...this.listItemProps()} />);
}

/* Export Component ==================================================================== */
export default CustomListItem;
