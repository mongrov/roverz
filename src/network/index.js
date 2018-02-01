import RNRestart from 'react-native-restart';
import { NetInfo, AppState } from 'react-native';

import Database from '../models';
import Application from '../constants/config';
import Service from '../service';
import RocketChat from '../rc';

import Constants from './constants';
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
      Network._publicSettings = null;
      Network._uiCallback = null;
      Network._serverName = null;
      Network._meteor = new MeteorService();
      Network.lastSyncTime = null;
      Network.isNetworkAvailable = false;
      Network.isMonitorConnectionEnabled = false;
      Network.isFirstTimeNetstatus = true;
      this.onLogin(() => {
        Network.isFirstTimeNetstatus = false;
        this.switchToLoggedInUser();
      });
      NetInfo.isConnected.fetch().then((isConnected) => {
        Network.isNetworkAvailable = isConnected;
      });
      NetInfo.isConnected.addEventListener(
        'connectionChange',
        this._handleFirstConnectivityChange,
      );

      Network.states = {
        _app: 'active',  // 'active', 'inactive', 'background'
        _network: false, // true - isConnected
      };
      this._initConnectionHandlers();
      // set service object
      const rc = new RocketChat();
      rc.meteor = Network._meteor;
      Network._service = new Service();
      Network._service.db = Network._db;
      Network._service.service = rc;
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
    Network._publicSettings = null;
    Network._uiCallback = uicallback;
    Network._chat = new ChatService();
    // init meteor service
    Network._meteor.init();
    Network._chat.init(Network._meteor, Network._db);
    // save the db
    this.db.setServer(Application.instance).then(() => {
      Network._serverName = Application.space;
      // lets set the server name to db
      // Network._db = new Database(Application.base.instance, Constants.DEFAULT_USER);

      Network._chat.getLoginSettings();
      Network._chat.getPublicSettings(this._publicSettingsCallback);
    });
  }

  // only change the userName, server remains the same
  switchToLoggedInUser() {
    const userName = this.service.loggedInUser ? this.service.loggedInUser.username : Constants.DEFAULT_USER;
    // lets set the user to db
    this.db.switchDb(Application.instance, userName);
    if (this.db && this.db.app) {
      this.db.app.setServerConnectionStatus(false);
    }
    if (!Network.isMonitorConnectionEnabled) {
      this.meteor.monitorConnection(this.meteorConnectionChange);
    }
    this.chat.resetDbHandle(Network._db);
    // do some basic setup for this user
    this.chat.initSubscriptions();
    this.dbSync();
    this.db.app.setServerConnectionStatus(true);
  }

  getServer() {
    return this.db.getServer();
  }

  getServerSetting(key) {
    return this.serverSettings ? this.serverSettings[key] : null;
  }

  _publicSettingsCallback(data) {
    Network._publicSettings = data;
    Network._uiCallback(data);
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
    return Network._publicSettings;
  }

  dbSync() {
    this.push.register();
    // const prevSyncTime = Network.lastSyncTime ? Network.lastSyncTime.getTime() : null;
    this.chat.fetchChannels(Network.lastSyncTime);
    this.chat.subscribeToAllGroups();
    this.service.setUserPresence('online');
  }

  // not much used need to test and remove this
  meteorConnectionChange(isConnected) {
    if (Network._db && Network._db.app) {
      const prevState = Network._db.app.isServerConnected;
      if (prevState === true && isConnected === false) {
        if (Network.lastSyncTime === null) {
          Network.lastSyncTime = new Date(new Date().getTime() - 32000);
          Network._db.app.setLastSync(Network.lastSyncTime);
        }
      }
      if (prevState === false && isConnected === true) {
        if (!Network._chat) {
          Network._chat = new ChatService();
          Network._chat.init(Network._meteor, Network._db);
          this.switchToLoggedInUser();
          Network.lastSyncTime = null;
        } else {
          Network._db.app.setServerConnectionStatus(isConnected);
          Network._chat.fetchChannels(Network.lastSyncTime);
          Network.lastSyncTime = null;
        }
      }
    }
  }

  _handleFirstConnectivityChange = (isConnected) => {
    Network.isNetworkAvailable = isConnected;
    if (!Network.isFirstTimeNetstatus && !isConnected && Network.lastSyncTime === null) {
      Network.lastSyncTime = new Date();
      Network._db.app.setLastSync(Network.lastSyncTime);
    }
    if (isConnected) {
      this.reconnectMeteor();
    }
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'background') {
      PushNotification.cancelAllLocalNotifications();
      this.service.setUserPresence('away');
    } else if (nextAppState === 'active') {
      PushNotification.cancelAllLocalNotifications();
      this.reconnectMeteor();
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
