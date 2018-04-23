/**
 * Tabbar Icon
 *
    <TabIcon icon={'search-web'} selected={false} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
} from 'react-native';
import { Icon } from 'react-native-elements';

import { AppColors } from '../../theme/';

const tabText = AppColors.brand().tI_style;
/* Component ==================================================================== */
const TabIcon = ({ icon, selected, subTitle }) => (
  /* */
  <View
    style={{
      // flex: 1,
      alignItems: 'center',
      height: 60,
      padding: 5,
    }}
  >
    <Icon
      name={icon}
      type={'material-community'}
      size={26}
      color={selected ? AppColors.tabbar.iconSelected : AppColors.tabbar.iconDefault}
      style={{
        paddingTop: 5,
      }}
    />
    <Text
      style={{
        color: tabText,
        fontSize: 10,
        marginBottom: 5,
      }}
    >{subTitle}</Text>
  </View>
);

TabIcon.propTypes = { icon: PropTypes.string.isRequired, selected: PropTypes.bool, subTitle: PropTypes.string };
TabIcon.defaultProps = { icon: 'search-web', selected: false, subTitle: '' };

/* Export Component ==================================================================== */
export default TabIcon;
