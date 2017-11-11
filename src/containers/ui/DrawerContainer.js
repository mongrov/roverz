/**
 * Whole App Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import SideMenu from 'react-native-side-menu';
import { DefaultRenderer } from 'react-native-router-flux';
// Actions
import * as SideMenuActions from '../../redux/sidemenu/actions';

// Consts and Libs
import { AppSizes } from '../../theme/';

// Containers
import Menu from './Menu/MenuContainer';

/* Redux ==================================================================== */

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  sideMenuIsOpen: state.sideMenu.isOpen,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  toggleSideMenu: SideMenuActions.toggle,
  closeSideMenu: SideMenuActions.close,
};

/* Component ==================================================================== */
class Drawer extends Component {
  static componentName = 'Drawer';

  static propTypes = {
    navigationState: PropTypes.shape({}),
    onNavigate: PropTypes.func,
    sideMenuIsOpen: PropTypes.bool,
    closeSideMenu: PropTypes.func.isRequired,
    toggleSideMenu: PropTypes.func.isRequired,
  }

  static defaultProps = {
    navigationState: null,
    onNavigate: null,
    sideMenuIsOpen: null,
  }


  /**
    * Toggle Side Menu
    */
  onSideMenuChange = (isOpen) => {
    if (isOpen !== this.props.sideMenuIsOpen) {
      this.props.toggleSideMenu();
    }
  }

  render() {
    const state = this.props.navigationState;
    const children = state.children;

    return (
      <View style={{ backgroundColor: '#000', flex: 1 }}>
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
