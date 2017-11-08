import Meteor from 'react-native-meteor';
import { AppUtil } from 'roverz-chat';

import AppConfig from '../constants/config';
import Constants from './constants';

class MeteorService {

  init() {
    // setup meteor
    // console.log('-------------meteor service init---------');
    Meteor.connect(AppConfig.urls.WS_URL);
  }

  logout() {
    Meteor.logout((res) => {
      // console.log(res);
    });
  }

  getCurrentUser() {
    return Meteor.user();
  }

  // monitor for collection changes and fire callback
  // cb is for format function(results)
  // **** context is very important, that dictates the life cycle for the subscription
  // **** from within a visual component, save the context and
  // **** pass the context again in stopMonitoringChanges when component unmounts
  monitorChanges(collection, cb) {
    if (!Meteor.getData().db[collection]) {
      Meteor.getData().db.addCollection(collection);
    }
    const items = Meteor.getData().db.observe(() => Meteor.getData().db[collection].find({}, {}));
    items.subscribe(cb);
    // // console.log("-------------- subscribed ["+collection+"] -----------------------");
    return items;
  }
  stopMonitoringChanges(context) {
    if (context) {
      context.dispose();
    }
  }

  // Meteor subscription wrapper
  // should have atleast one argument (topic)
  subscribe(...args) {
    AppUtil.debug(`${args}`, `${Constants.MODULE}: subscribe`);
    // args atleast should have length 1 (topic)
    if (args.length <= 0) {
      AppUtil.debug('Invalid args passed', null);
      return;
    }
    Meteor.subscribe.apply(null, args);
  }

  // Meteor call wrapper
  // returns a promise
  // should have atleast one argument (method to call)
  call(...args) {
    AppUtil.debug(`${args}`, `${Constants.MODULE}: call`);
    // args atleast should have length 1 (topic)
    if (args.length <= 0) {
      AppUtil.debug('Invalid args passed', null);
      return null;
    }
    return new Promise((resolve, reject) => {
      let cb = args[args.length - 1];
      // if callback not supplied, add it
      if (typeof cb !== 'function') {
        cb = (err, res) => {
          if (err) reject(err);
          resolve(res);
        };
        args.push(cb);
      }
      // make a call
      Meteor.call.apply(null, args);
    });
  }

  // Meteor call wrapper
  // returns a promise
  // should have atleast one argument (method to call)
  // debug output of all (request, response and if any error) - NOTE, last param should not be callback
  traceCall(...args) {
    AppUtil.debug(`${args}`, `${Constants.MODULE}: call`);
    // args atleast should have length 1 (topic)
    if (args.length <= 0) {
      AppUtil.debug('Invalid args passed', null);
      return null;
    }
    return new Promise((resolve, reject) => {
      let cb = args[args.length - 1];
      // if callback not supplied, add it
      if (typeof cb !== 'function') {
        cb = (err, res) => {
          AppUtil.debug(`Req: ${args[0]}, Err: ${err}, Res: ${JSON.stringify(res)}`, `${Constants.MODULE}: result`);
          if (err) reject(err);
          resolve(res);
        };
        args.push(cb);
      }
      // make a call
      Meteor.call.apply(null, args);
    });
  }

}

export default MeteorService;
