/**
 * Test the group objects
 */
/* global it expect jest */
import 'react-native';

import Database from '../';

function sampleGroups() {
  var db = new Database();
  var objs = {
    777: { _id: '777', name: 'direct 1', type: 'd' },
    4: { _id: '4', name: 'privae1' },
    123: { _id: '123', name: 'public group2', type: 'c' },
    844: { _id: '844', name: 'private2', type: 'y' }, // invalid type
    444: { _id: '444', name: 'public group1', type: 'c' },
    1: { _id: '1', name: 'general', type: 'c' },
  };
  db.switchDb('inst', 'test');
  db.groups.addAll(objs);
  return Object.keys(objs).length;
}

it('list getters', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  const g = sampleGroups();
  expect(db.groups.list).toHaveLength(g);
  expect(db.groups.privateList).toHaveLength(2);
  expect(db.groups.publicList).toHaveLength(3);
  expect(db.groups.directList).toHaveLength(1);
  // findById
  expect(db.groups.findById('1')).toMatchObject({ name: 'general' });
  expect(db.groups.findById('10')).toBeNull();
  // findByName
  expect(db.groups.findByName('Genrali')).toBeNull();
  let x = db.groups.findByName('general');
  expect(x).toMatchObject({ _id: '1' });
  x = db.groups.findByName('GeNeraL');
  expect(x).not.toBeNull();
  x = db.groups.search('ge');
  x = db.groups.search('gro');
  x = db.groups.search('genr');
  x = db.groups.search('zz');

  // @todo: check sorted
  x = db.groups.sortedList; // - TBD
});

it('delete groups', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  const g = sampleGroups();
  expect(db.groups.list).toHaveLength(g);
  db.groups.deleteGroups({});
  db.groups.deleteGroups(null);
  let objs = {
    51: { _id: '51',
      name: 'direct 51',
      type: 'd',
    },
  };
  db.groups.deleteGroups(objs);
  objs = {
    444: { _id: '444', name: 'public group1', type: 'c' },
  };
  db.groups.deleteGroups(objs);
  expect(db.groups.list).toHaveLength(5);
});


it('add groups', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  db.groups.addAll(null);
  expect(db.groups.list).toHaveLength(0);
  db.groups.addAll({});
  expect(db.groups.list).toHaveLength(0);
  const objs = {
    4: { _id: '4',
      name: 'direct 1',
      type: 'd',
    },
    23: {
      name: 'direct 2',
    },
  };
  db.groups.addAll(objs);
  db.groups.findById('4').findRootMessage(null).toHaveLength(0);
  db.groups.findById('4').findRootMessage('1').toHaveLength(0);
  const date = new Date();
  const messages = {
    13: { _id: '14', rid: '4', text: 'wh?', createdAt: date, user: { _id: '2', username: 'who', name: 'wh' } },
    15: { _id: '115',
      rid: '4',
      text: 'wasdfh?',
      likes: 2,
      createdAt: date,
      user: { _id: '2', username: 'who', name: 'wh' } },
  };
  db.addMessages(db.groups.findById('4'), messages);
  db.groups.addAll(objs);
  const updatedMessage = {
    13: { _id: '14',
      rid: '4',
      text: 'ez',
      createdAt: date,
      editedAt: date,
      user: { _id: '2', username: 'who', name: 'wh' } },
  };
  db.updateMessages(db.groups.findById('4'), updatedMessage);

  // db.groups.findById('4').commentsList();

  const replyMessage = {
    13: { _id: '22',
      rid: '4',
      text: '[ ] (sf/df/sd?msg=14) test reply',
      createdAt: date,
      editedAt: date,
      isReply: true,
      replyMessageId: '14',
      user: { _id: '2', username: 'who', name: 'wh' } },
  };
  db.addMessages(db.groups.findById('4'), replyMessage);
  // db.groups.findById('4').commentsList('14');
  db.groups.findById('4').findRootMessage('22').toHaveLength(1);
  db.groups.findById('4').findRootMessage('0').toHaveLength(0);
  const replyMessage1 = {
    13: { _id: '23',
      rid: '4',
      text: '[ ] (sf/df/sd?msg=14) test reply',
      createdAt: date,
      editedAt: date,
      isReply: true,
      user: { _id: '2', username: 'who', name: 'wh' } },
  };
  db.addMessages(db.groups.findById('4'), replyMessage1);
  db.groups.findById('4').findRootMessage('23');

  // delete invalid message id
  db.deleteMessage('4');
  // test lastMessage
  let lastMessage = db.groups.lastMessage;
  expect(lastMessage).not.toBeNull();
  // delete invalid message id
  db.deleteMessage('4', '21');
  lastMessage = db.groups.lastMessage;
  expect(lastMessage).not.toBeNull();
  // delete valid message id
  db.deleteMessage('4', '14');
  lastMessage = db.groups.lastMessage;

  db.groups.updateNoMoreMessages(db.groups.findById('4'));
  db.groups.updateNoMoreMessages(null);
  // TODO Verify heading
  expect(db.groups.findById('4').heading).not.toBeNull();
  const gobjs = {
    5: { _id: '5',
      name: 'direct 1',
      type: 'd',
      title: 'title',
    },
  };
  db.groups.addAll(gobjs);
  // TODO Verify heading
  expect(db.groups.findById('5').heading).not.toBeNull();
});

// test all group object related methods
it('group getters', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  const g = sampleGroups();
  const gobjs = db.groups.list;
  expect(gobjs).toHaveLength(g);
  expect(gobjs[0].avatar).not.toBeNull();
  let obj = db.groups.findById('1');
  expect(obj.isPublic).toBeTruthy();
  obj = db.groups.findById('777');
  expect(obj.isDirect).toBeTruthy();
  obj = db.groups.findById('844');
  expect(obj.isPrivate).toBeTruthy();
  expect(obj.lastMessage).toBeNull();
});

it('group findMissingMessages', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  const g = sampleGroups();
  const gobjs = db.groups.list;
  expect(gobjs).toHaveLength(g);
  const obj = db.groups.findById('4');
  // find out missing messages
  let msgs = null;
  expect(obj.findMissingMessages(msgs)).toEqual({});
  msgs = {
    12: { _id: '12', rid: '4', text: 'hello', user: { _id: '1', username: 'test', name: 'hell' } },
    13: { _id: '13', text: 'where?' },
  };
  expect(obj.findMissingMessages(msgs)).toMatchObject({ 12: {} });
  expect(obj.lastMessage).toBeNull();
  // lets add it to db
  db.addMessages(obj, msgs);
  msgs = { 12: { _id: '12', rid: '4', text: 'hello' }, 13: { _id: '13', rid: '4', text: 'where?' } };
  expect(obj.findMissingMessages(msgs)).toMatchObject({ 13: {} });
  expect(obj.lastMessage).toMatchObject({ _id: '12' });
  // sorted messages test
  const date = new Date();
  msgs = {
    13: { _id: '13', rid: '4', text: 'wh?', createdAt: date, user: { _id: '2', username: 'who', name: 'wh' } },
  };
  db.addMessages(obj, msgs);
  expect(obj.sortedMessages).not.toBeNull();
});
