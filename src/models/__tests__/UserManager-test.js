/**
 * Test the user objects
 */
/* global it expect jest */
import 'react-native';

import Database from '../';

it('list getters', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  expect(db.users.list).toHaveLength(0);
  // findById
  expect(db.users.findById('10')).toBeNull();
  // findOrCreate
  db.realm.write(() => {
    db.users.findOrCreate('10', 'test');
  });
  expect(db.users.findById('10')).not.toBeNull();
  expect(db.users.findByIdAsList('10')).not.toBeNull();

  expect(db.users.findByIdAsList('1')).toBeNull();
  expect(db.users.list).toHaveLength(1);
  expect(db.users.findOrCreate('10')).not.toBeNull();
  expect(db.users.findOrCreate('10').avatar).not.toBeNull();

  db.realm.write(() => {
    db.users.findOrCreate('1', '', 'test name');
  });
  db.users.updateStatus('10', 'test', 'test name');
  db.users.updateStatus('10', 'test', 'test name', 'online');
  db.users.updateStatus('20', 'test', '', 'online');
  // console.log('----**********************----');
  // console.log(db.users.getOnlineUsers);
  // console.log(db.users.getStatus('2'));
  // console.log(db.users.getStatus('10'));
  // console.log('----**********************----');
});
it('updateFullUserData', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  expect(db.users.list).toHaveLength(0);
  const date = new Date();
  const userData = {
    _id: '10',
    status: 'online',
    active: 'true',
    username: 'raja',
    name: 'r',
    statusConnection: 'online',
    utcOffset: 'ab',
    lastLogin: date,
    createdAt: date,
    roles: ['user', 'admin'],
    emails: [{ address: 'mailID@test.com', verified: true }],
    editedAt: date,
    type: 'user',
    user: { _id: '2', username: 'raja', createdAt: date, name: 'r' },
  };
  db.users.updateFullUserData(userData);
  // console.log(db.users.getStatus('10'));
  const userData1 = {
    _id: '20',
    username: 'rajaa',
    name: 'ra',
    editedAt: date,
    user: { _id: '2', username: 'raja', createdAt: date, name: 'r' },
  };
  db.users.updateFullUserData(userData1);
  // console.log(db.users.getStatus('20'));
  db.users.updateFullUserData(userData);
  // console.log(db.users.getStatus('10'));
  const userData2 = {
    _id: '30',
    username: 'raja1',
    tname: 'ra1',
    uname: 'r',
    editedAt: date,
    user: { _id: '2', username: 'raja', createdAt: date, name: 'r' },
  };
  db.users.updateFullUserData(userData2);
  // console.log(db.users.getStatus('30'));
  db.users.updateFullUserData();
});
