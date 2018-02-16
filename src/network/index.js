import RNRestart from 'react-native-restart';
import { NetInfo, AppState } from 'react-native';

import Database from '../models';
import Application from '../constants/config';
import Service from '../service';
import RocketChat from '../rc';

import PushService from './PushService';
import MeteorService from './MeteorService';
import ChatService from './ChatService';

const PushNotification = require('react-native-push-notification');

class Network {

  constructor() {
    this.init();
  }

  init() {
    if (!Network._push) {
      Network._push = new PushService();
      Network._push.init();
      Network._db = new Database();
      Network._meteor = new MeteorService();
      this.onLogin(() => {
        this.switchToLoggedInUser();
      });

      Network.states = {
        _app: 'active',  // 'active', 'inactive', 'background'
        _network: false, // true - isConnected
      };
      this._initConnectionHandlers();
      // set service object
      Network._service = new Service();
      Network._service.db = Network._db;
      const rc = new RocketChat(Network._service);
      // rc.meteor = Network._meteor;
      Network._service.provider = rc;
    }
  }

  // handlers to update network/app states
  _initConnectionHandlers() {
    // first handle network state
    NetInfo.isConnected.fetch().then((isConnected) => {
      Network.states._network = isConnected;
    });
    // this method is not called every time on simulator, when the network
    // is connected, but disconnect immediately happens
    NetInfo.isConnected.addEventListener('connectionChange', (isConnected) => {
      Network.states._network = isConnected;
    });

    // handle app state
    AppState.addEventListener('change', (newAppState) => {
      Network.states._app = newAppState;
    });
  }

  // @todo: we still need to fix the user name
  setServer(serverName, uicallback) {
    // close existing meteor connection
    if (Network._chat) {
      Network._chat.logout();
    }
    Network._chat = new ChatService();
    // init meteor service
    Network._meteor.init();
    Network._service.provider.meteor = Network._meteor;
    Network._chat.init(Network._meteor, Network._db, Network._service);
    // save the db
    this.db.setServer(serverName).then(() => {
      this.service.connect(serverName, uicallback);
    });
  }

  // only change the userName, server remains the same
  switchToLoggedInUser() {
    // @todo - kludge, this code needs to move out/removed
    setTimeout(() => {
      this.chat.resetDbHandle(Network._db);
      this.dbSync();
      console.log('************* dbSync done **************');
    }, 1000);
  }

  getServer() {
    return this.db.getServer();
  }

  getServerSetting(key) {
    return this.serverSettings ? this.serverSettings[key] : null;
  }

  // get variables
  get push() {
    return Network._push;
  }
  get meteor() {
    return Network._meteor;
  }
  get chat() {
    return Network._chat;
  }
  get db() {
    return Network._db;
  }
  get service() {
    return Network._service;
  }

  // returns if meteor is connected for now
  get isConnected() {
    const meteorStatus = Network._meteor.status;
    return meteorStatus.connected;
  }

  get showLogin() {
    const loginFormConf = this.getServerSetting('Accounts_ShowFormLogin');
    return loginFormConf && loginFormConf.value;
  }

  onLogin(callback) {
    Network._meteor.monitorAction('onLogin', callback);
  }

  logout() {
    this.db.setUserId(null);
    Application.setUserId(null);
    this.chat.logout();
    setTimeout(() => {
      RNRestart.Restart();
    }, 300);
  }

  get serverSettings() {
    return this.service.settings;
  }

  dbSync() {
    this.push.register();
    this.service.setUserPresence('online');
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background') {
      PushNotification.cancelAllLocalNotifications();
      this.service.setUserPresence('away');
    } else if (nextAppState === 'active') {
      PushNotification.cancelAllLocalNotifications();
      // this.reconnectMeteor();
      this.service.setUserPresence('online');
    }
  }

  reconnectMeteor() {
    setTimeout(() => {
      if (this.service.loggedInUser && !Network.isConnected) {
        Network._meteor.reconnect();
      }
    }, 1000);
  }

}

export default Network;
