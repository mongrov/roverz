import React from 'react';
import {
  View,
  StatusBar,
} from 'react-native';
import WebView from '../components/general/WebView';

import Network from '../network';

export default class SSOTest extends React.Component {
  constructor(props) {
    super(props);
    this.n = new Network();
    this.serverUrl = this.n.getServer();
    this.ssoURL = this.n.chat.getLoginSetting('entryPoint');
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {

  }


  /* eslint-disable global-require */
  render() {
    // Meteor.logout();
    let credential = '1838484848';
    return (
      <View
        style={{ flex: 1 }}
      >
        <StatusBar barStyle={'dark-content'} />
        <WebView
          url={`https://${this.serverUrl}`}
//          url={`${this.ssoURL}`}
          onNavigationStateChange={(event) => {
            if (event.startsWith(`https://${this.serverUrl}/_saml/authorize/yap/`)) {
              credential = event.replace(`https://${this.serverUrl}/_saml/authorize/yap/`, '');
            }
            if (event.startsWith(`https://${this.serverUrl}/_saml/validate/yap`)) {
              this.n.chat.loginWithSaml(credential);
            }
          }}
        />
      </View>
    );
  }
}
/* eslint-enable global-require */

SSOTest.defaultProps = {

};

SSOTest.propTypes = {

};
