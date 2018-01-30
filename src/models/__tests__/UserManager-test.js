/**
 * Test the user objects
 */
/* global it expect jest */
import 'react-native';

import Database from '../';

it('users create and read', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  // in intial no user findById
  expect(db.users.list).toHaveLength(0);
  expect(db.users.findById('10')).toBeNull();
  expect(db.users.findByUserName('john')).toBeNull();
  expect(db.users.findByIdAsList('10')).toBeNull();

  db.realm.write(() => {
    db.users._findOrCreate('10', 'john', 'test10');
    db.users._findOrCreate('22', 'harry');
  });

  // after adding users read need to return value
  expect(db.users.list).toHaveLength(2);
  expect(db.users.findById('10')).not.toBeNull();
  expect(db.users.findByUserName('john')).not.toBeNull();
  expect(db.users.findByIdAsList('22')).not.toBeNull();
  expect(db.users.findByUserName('john').avatar).not.toBeNull();
});

it('update users', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  expect(db.users.list).toHaveLength(0);
  // negative scenario
  db.users.updateFullUserData();
  expect(db.users.list).toHaveLength(0);
  // const date = new Date();
  let userData = {
  };
  db.users.updateFullUserData(userData);
  const date = new Date();
  userData = {
    _id: '10',
    status: 'online',
    active: 'true',
    username: 'john',
    name: 'r',
    statusConnection: 'online',
    utcOffset: 'ab',
    lastLogin: date,
    createdAt: date,
    roles: ['user', 'admin'],
    emails: [{ address: 'mailID@test.com', verified: true }],
    editedAt: date,
    type: 'user',
  };
  db.users.updateFullUserData(userData);
  expect(db.users.findById('10')).not.toBeNull();
  userData = {
    _id: '11',
    username: 'harry',
    name: 'harry',
  };
  db.users.updateFullUserData(userData);
  expect(db.users.findById('11').status).toMatch('offline');
});

it('update status', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  expect(db.users.list).toHaveLength(0);
  // updateStatus need to have status
  db.users.updateStatus('22', 'harry', 'test22');
  expect(db.users.findById('22')).toBeNull();

  // updateStatus success scenario
  db.users.updateStatus('22', 'harry', 'test22', 'offline');
  expect(db.users.findById('22')).not.toBeNull();
  db.users.updateStatus('11', 'john', 'test11', 'offline');
  db.users.updateStatus('33', 'apsar', 'test33', 'offline');
  expect(db.users.getOnlineUsers).toHaveLength(0);
  db.users.updateStatus('44', 'ro1', 'test44', 'online');
  expect(db.users.getOnlineUsers).toHaveLength(1);

  expect(db.users.getStatus('55')).toBeNull();
  expect(db.users.getStatus('44')).toMatch('online');
  expect(db.users.getStatus('33')).toMatch('offline');
});
