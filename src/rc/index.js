/**
 * RocketChat specific methods/functionality
 */
// import { ModuleConfig } from '../constants/';
// import Application from '../constants/config';

// Enable debug output when in Debug mode
// const DEBUG_MODE = ModuleConfig.DEV;

class RC {
  constructor() {
    if (!this._meteor) {
      this._meteor = null;
    }
  }

  // @todo - do any reinitializations here
  set meteor(meteorObj) {
    console.log('****** meteor is set ********');
    this._meteor = meteorObj;
  }

  get meteor() {
    return this._meteor;
  }

  // --- RC calls, general signature of a call would be
  //  any callback would carry (error, result) / (err,res) as two arguments

  // use like createDirectMessage('ananth');
  createDirectMessage(userName, cb) {
    this.meteor.call('createDirectMessage', userName, cb);
  }

  joinRoom(roomId, cb) {
    this.meteor.call('joinRoom', roomId, null, cb);
  }

}

/* Export ==================================================================== */
export default RC;
