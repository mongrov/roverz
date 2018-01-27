/* global it expect jest */
import 'react-native';

import Database from '../';

/*   Remove empty values from a given associative array */

it('last sync test', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
// lets reset the db
  db.reset();
  expect(db.app.state).toBeNull(); // no state
  db.app.setLastSync();
  expect(db.app.state).toBeDefined(); // not null
});


it('set server connection test', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
// lets reset the db
  db.reset();
  expect(db.app.state).toBeNull(); // no state
  expect(db.app.isServerConnected).toBe(false);
  db.app.setServerConnectionStatus(true);
  expect(db.app.state).toBeDefined(); // not null
  expect(db.app.isServerConnected).toBe(true);
  // set to false
  db.app.setServerConnectionStatus();
  expect(db.app.isServerConnected).toBe(false);
});


// lets switch the db
it('switchDb test', () => {
  var db = new Database();
  db.getServer();
  db.switchDb('p57', 'test');
  db.setServer('mongrov');
  db.setUserId();
  db.getServer();
  db.setUserId('adsf134r');
  // lets reset the db
  db.reset();
  expect(db.users.list).toHaveLength(0);
  // findById
  expect(db.users.findById('3')).toBeNull();
  // findOrCreate
  db.realm.write(() => {
    db.users.findOrCreate('1', 'test', 'test name');
    db.users.findOrCreate('2', 'test1', 'test name');
    db.users.findOrCreate('3', 'test2', 'test name');
  });
  expect(db.users.findById('3')).not.toBeNull();
  expect(db.users.list).toHaveLength(3);

  db.switchDb('inst', 'test');
  db.reset();
  expect(db.users.list).toHaveLength(0);
  db.realm.write(() => {
    db.users.findOrCreate('10', 'test10', 'test name');
    db.users.findOrCreate('22', 'test22', 'test name');
  });
  expect(db.users.findById('10')).not.toBeNull();
  expect(db.users.list).toHaveLength(2);


  db.switchDb('p57', 'test');
  expect(db.users.list).toHaveLength(3);
  db.switchDb('inst', 'test');
  expect(db.users.list).toHaveLength(2);
});
