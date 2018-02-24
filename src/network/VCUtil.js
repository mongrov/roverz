import md5 from 'react-native-md5';

// import Network from 'roverz-chat/src/network';
import InCallManager from 'react-native-incall-manager';
import PushNotification from 'react-native-push-notification';
import { Actions } from 'react-native-router-flux';
import Application from '../constants/config';

export default class VCUtil {

  static myInstance = null;
  _net = null;
  _gid = null;
  _remoteuid = null;
      /**
         * @returns {AudioConfUtil}
         */
  static getInstance() {
    if (VCUtil.myInstance == null) {
      VCUtil.myInstance = new VCUtil();
    }

    return VCUtil.myInstance;
  }

  incomingVC(groupID, rUID, rUName) {
    console.log('Kumar push VCUTIL invc ', groupID, rUID, rUName);
    this._gid = groupID;
    this._remoteuid = rUID;
    this._remoteName = rUName;
    PushNotification.cancelAllLocalNotifications();
    PushNotification.localNotificationSchedule({
      message: `Video Calling ${this._remoteName}`, // (required)
      playSound: false,
      autoCancel: false,
      vcData: {
        groupID,
        rUID,
      },
      date: new Date(Date.now()), // in 60 secs
      // actions: '["Accept", "Reject"]',
    });
    InCallManager.startRingtone('_BUNDLE_');
    InCallManager.turnScreenOn();

    // if (!this._net) {
    //   this._net = new Network();
    // }

    // if (!this._net.isConnected) {
    //   this._net.onLogin(() => {
    //     this.handleCall();
    //   });
    // } else {
    //   this.handleCall();
    // }
  }

  incomingVCDisconnect() {
    PushNotification.cancelAllLocalNotifications();
    InCallManager.stopRingtone();
  }

  handleCall() {
    console.log('Kumar push VCUTIL han ', this._gid, this._remoteuid);
    const groupObj = this._net.service.db.groups.findById(this._gid);
    const currUser = this._net.service.loggedInUserObj;
    const vcuserID = currUser ? md5.hex_md5(currUser._id) : '0';
    console.log('Kumar push VCUTIL han1 ', groupObj, currUser, vcuserID);
    Actions.directConference({
      instance: Application.instance,
      groupName: groupObj.name,
      groupID: this._gid,
      groupType: 'direct',
      userID: vcuserID,
      callType: 'INCOMING',
    });
  }

}
