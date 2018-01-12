import RNRestart from 'react-native-restart';
import { NetInfo } from 'react-native';
import Database from '../models';

import Constants from './constants';
import PushService from './PushService';
import MeteorService from './MeteorService';
import ChatService from './ChatService';
import Application from '../constants/config';

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
      this.onLogin(() => {
        this.switchToLoggedInUser();
//        AppState.addEventListener('change', );
      });
//      AppState.removeEventListener('change', this._handleAppStateChange);
      NetInfo.isConnected.fetch().then((isConnected) => {
        Network.isNetworkAvailable = isConnected;
      });
      NetInfo.isConnected.addEventListener(
        'connectionChange',
        this._handleFirstConnectivityChange,
      );
    }
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
    const userName = Network._meteor.getCurrentUser() ?
      Network._meteor.getCurrentUser().username :
      Constants.DEFAULT_USER;
    // lets set the user to db
    this.db.switchDb(Application.instance, userName);
    if (this.db && this.db.app) {
      this.db.app.setServerConnectionStatus(false);
    }
    this.meteor.monitorConnection(this.meteorConnectionChange);
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

  get currentUser() {
    return Network._meteor.getCurrentUser();
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
    this.chat.fetchChannels();
    // lets subscribe to all changes in all channels
    this.chat.subscribeToAllGroups();
    this.chat.setUserPresence('online');
  }

  meteorConnectionChange(isConnected) {
    if (Network._db && Network._db.app) {
      const prevState = Network._db.app.isServerConnected;
      if (Network._db.app.isServerConnected === true && isConnected === false) {
        if (Network.lastSyncTime === null) {
          Network.lastSyncTime = new Date(new Date().getTime - 32000);
          Network._db.app.setLastSync(Network.lastSyncTime);
        }
      }
      Network._db.app.setServerConnectionStatus(isConnected);
      if (prevState === false && isConnected === true && Network._chat) {
        Network._chat.fetchChannels(Network.lastSyncTime);
        Network.lastSyncTime = null;
      }
    }
  }

  _handleAppState = (nextAppState) => {
    if (nextAppState === 'background') {
      PushNotification.cancelAllLocalNotifications();
      Network._chat.setAppState(0);
      Network._chat.setUserPresence('away');
    } else if (nextAppState === 'active') {
      PushNotification.cancelAllLocalNotifications();
      Network._chat.setAppState(1);
      Network._chat.setUserPresence('online');
    } else { // inactive
      Network._chat.setAppState(0);
    }
  }

  _handleFirstConnectivityChange = (isConnected) => {
    Network.isNetworkAvailable = isConnected;
    if (!isConnected && Network.lastSyncTime === null) {
      Network.lastSyncTime = new Date();
      Network._db.app.setLastSync(Network.lastSyncTime);
    }
  }

}

export default Network;
