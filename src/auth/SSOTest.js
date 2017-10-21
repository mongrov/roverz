import React from 'react';
import {
  View,
  StatusBar,
} from 'react-native';
import Meteor from 'react-native-meteor';
import WebView from 'roverz-chat';

import Network from '@network';
import AppConfig from '@app/config';

// import SSOAuth from '../../lib/ssoauth/';

export default class SSOTest extends React.Component {
  constructor(props) {
    super(props);
    this.n = new Network();
    this.serverUrl = this.n.getServer();
    console.log('this.serverUrl', this.serverUrl);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {

  }

  /* onNavigationStateChange(event) {
    const n = new Network();
    let credential = '1838484848';
    // console.log('onNavigationStateChange', webViewState);
    console.log(event);
    if (event.startsWith('https://instance.brandName/_saml/authorize/brand/')) {
      console.log('******Credential is ****');
      credential = event.replace('https://instance.brandName/_saml/authorize/brand/', '');
      console.log(credential);
    }
    if (event.startsWith('https://instance.brandName/_saml/validate/brand')) {
      n.chat.loginWithSaml(credential);
      console.log('Logged in check ****');
      console.log(Meteor.user());
      console.log(Meteor.userId());
    }
  } */

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
          url={`https://${this.serverUrl}.${AppConfig.base.brandName}`}
          onNavigationStateChange={(event) => {
            console.log('event');
            console.log(event);
            if (event.startsWith(`https://${this.serverUrl}.${AppConfig.base.brandName}/_saml/authorize/yap/`)) {
              console.log('******Credential is ****');
              credential = event.replace(`https://${this.serverUrl}.${AppConfig.base.brandName}/_saml/authorize/yap/`, '');
              console.log(credential);
            }
            if (event.startsWith(`https://${this.serverUrl}.${AppConfig.base.brandName}/_saml/validate/yap`)) {
              this.n.chat.loginWithSaml(credential);
              console.log('Logged in check ****');
              console.log(Meteor.user());
              console.log(Meteor.userId());
              // Actions.app({ type: 'reset' });
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
