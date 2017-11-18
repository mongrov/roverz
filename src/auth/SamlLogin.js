import React from 'react';
import {
  View,
  StatusBar,
} from 'react-native';

import WebView from '../components/general/WebView';
import Network from '../network';

export default class SamlLogin extends React.Component {
  constructor(props) {
    super(props);
    this._service = new Network();
    this.serverUrl = this._service.getServer();
    // this.ssoURL = this._service.chat.getLoginSetting('entryPoint');
  }

  componentDidMount() {
  }

  render() {
    let credential = '1838484848';
    return (
      <View
        style={{ flex: 1 }}
      >
        <StatusBar barStyle={'dark-content'} />
        <WebView
          url={`https://${this.serverUrl}`}
          onNavigationStateChange={(event) => {
            if (event.startsWith(`https://${this.serverUrl}/_saml/authorize/yap/`)) {
              credential = event.replace(`https://${this.serverUrl}/_saml/authorize/yap/`, '');
            }
            if (event.startsWith(`https://${this.serverUrl}/_saml/validate/yap`)) {
              this._service.chat.loginWithSaml(credential);
            }
          }}
        />
      </View>
    );
  }
}
