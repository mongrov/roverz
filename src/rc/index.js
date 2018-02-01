/**
 * RocketChat specific methods/functionality
 */
// import { ModuleConfig } from '../constants/';
// import Application from '../constants/config';

// Enable debug output when in Debug mode
// const DEBUG_MODE = ModuleConfig.DEV;

// lifecycle methods of service
//  - connect()
//  - reconnect()
//  - disconnect()
//  - server settings
//  - events for the same
//  --- connected
//  --- disconnected
// lifecycle methods for user
//  - login()
//  - logout()
//  - user settings

// const ServiceConfig = {
//   constructor() {
//     this.name = 'RocketChat',
//     this.server = 'xyz'
//   }
// };

// basic criteria:
// 1) we want to do things, only if meteor is connected
//

class RC {
  constructor() {
    if (!RC._meteor) {
      RC._meteor = null;
    }
  }

  // @todo - do any reinitializations here
  set meteor(meteorObj) {
    console.log('****** meteor is set ********');
    RC._meteor = meteorObj;
  }

  get meteor() {
    return RC._meteor;
  }

  // -- RC connection lifecycle methods
  // connect(serverName) {

  // }

  // --- RC calls, general signature of a call would be
  //  any callback would carry (error, result) / (err,res) as two arguments

  // use like createDirectMessage('ananth');
  createDirectMessage(userName, cb) {
    this.meteor.call('createDirectMessage', userName, cb);
  }

  joinRoom(roomId, cb) {
    this.meteor.call('joinRoom', roomId, null, cb);
  }

  createChannel(channelName, isPrivate, isReadonly, userList, cb) {
    var methodName = !isPrivate ? 'createChannel' : 'createPrivateGroup';
    this.meteor.call(methodName, channelName, userList, isReadonly, cb);
  }

  // presence api's
  getUserPresence(state, cb) {
    const methodType = `UserPresence:${state}`;
    this.meteor.call(methodType, cb);
  }
  setUserPresence(presenceStatus, cb) {
    this.meteor.call('UserPresence:setDefaultStatus', presenceStatus, cb);
  }

}

/* Export ==================================================================== */
export default RC;
