/**
 * PhotoBrowser Screen
 */
import React, { Component } from 'react';
import { List, ListItem } from 'react-native-elements';
import { ListView } from 'realm/react-native';

import {
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
/* import {
  GiftedChat,
  Bubble,
  Composer,
  // Actions as GCActions,
 } from 'react-native-gifted-chat'; */

// import { Actions } from 'react-native-router-flux';
import { Loading, FormInputSimple, FormLabelSimple } from 'roverz-chat';
import Network from '../../../network';
import Group from '../../../models/group';
import { AppStyles, AppSizes } from '../../../theme/';

const memberListData = [];

export default class SearchListView extends Component {

  constructor(props) {
    super(props);
    const n = new Network();
    this._group = this.props.group;
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      _network: n,
      dataSource: dataSource.cloneWithRows(memberListData),
      loaded: false,
      // items: db.groups.sortedList,
      roomObj: this.props.group,
      searchText: '',
    };
    this._searchCallback = this._searchCallback.bind(this);
  }

  componentDidMount() {
    this.getMessages();
    // console.log('this.state.roomObj', this.state.roomObj);
  }

  componentWillUnmount() {

  }

  getMessages() {
    // this.state._network.chat.getMembersList(this._group._id, this._membersCallback);
    this.state._network.chat.searchRoom(this.state.roomObj._id, this.state.searchText, 20, this._searchCallback);
  }

  _searchCallback(data, msg) {
    const _su = this;
    if (msg === 'SUCCESS') {
      _su.searchListData = data;
      console.log('_searchCallback', _su.searchListData, msg);
      _su.setState({
        dataSource: _su.state.dataSource.cloneWithRows(_su.searchListData),
        loaded: true,
      });
    }
  }

  renderRow(rowData, sectionID) {
    return (
      <ListItem
        roundAvatar
        key={sectionID}
        // title={rowData.name}
        titleStyle={AppStyles.memberListTitle}
        subtitle={`@${rowData.username}`}
        subtitleStyle={AppStyles.memberListSubTitle}
        /* avatar={{
          uri: `${AppConfig.base.urls.SERVER_URL}/avatar/${rowData.username}?_dc=undefined`,
        }} */
        // onPress={() => Actions.memberDetail({ memberId: rowData._id })}
      />
    );
  }

  render() {
    return (
      <View
        style={[AppStyles.container, { paddingTop: AppSizes.navbarHeight }]}
      >
        <StatusBar barStyle="light-content" />
        <FormLabelSimple>{'Search'.toUpperCase()}</FormLabelSimple>
        <FormInputSimple
          // value={'OK'}
          onChangeText={(text) => {
            console.log(text);
            this.setState({ searchText: text, loaded: false });
            this.getMessages();
          }}
        />
        <ScrollView
          automaticallyAdjustContentInsets={false}
        >
          {
            (!this.state.loaded
            &&
            <Loading />
            )
            ||
            <List>
              <ListView
                renderRow={this.renderRow}
                dataSource={this.state.dataSource}
                enableEmptySections={true}
              />
            </List>
          }
        </ScrollView>
      </View>
    );
  }
}

SearchListView.defaultProps = {
  group: null,
};

SearchListView.propTypes = {
  group: PropTypes.instanceOf(Group),
};

/*

<ScrollView
  automaticallyAdjustContentInsets={false}
>
  {
    (!this.state.loaded
    &&
    <Loading />
    )
    ||
    <List>
      <ListView
        renderRow={this.renderRow}
        dataSource={this.state.dataSource}
        enableEmptySections={true}
      />
    </List>
  }
</ScrollView>

*/
