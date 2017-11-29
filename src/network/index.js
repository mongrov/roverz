import RNRestart from 'react-native-restart';
import Database from '../models';

import Constants from './constants';
import PushService from './PushService';
import MeteorService from './MeteorService';
import ChatService from './ChatService';
import Application from '../constants/config';

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
    this.chat.resetDbHandle(Network._db);
    // do some basic setup for this user
    this.chat.initSubscriptions();
    this.dbSync();
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
//    this.chat.setOnline();
  }
}

export default Network;
