/* global it expect jest */
import 'react-native';

import Service from '../';
// import Database from '../../models';
// import RocketChat from '../../rc';
// import MeteorService from '../../network/MeteorService';
// import Application from '../../constants/config';

// // @todo - to remove this test case - not of use
// // it('get filtered channels', () => {
// //   // var s = new Service();
// // });

// const TEST_SERVER = 'try.broov.com'; // to change this

// function init() {
//   Application.bootstrapUrl = TEST_SERVER;
//   Application.init();
// }

// it('connected - init sequence', () => {
//   init();
//   const svc = new Service();
//   const db = new Database();
//   const meteor = new MeteorService();
//   meteor.init();
//   const rc = new RocketChat(svc);
//   rc.meteor = meteor;
//   svc.db = db;
//   svc.provider = rc;
//   svc.connect(Application.instance, () => {
//     console.log('***** connected to server ****');
//   });
// });

it('sample queue', () => {
    // Of course this line needs to be in the context of an async function,
    // otherwise use queueFactory.then((queue) => { console.log('add workers and jobs here'); });
  const svc = new Service();
  svc._test();
});
