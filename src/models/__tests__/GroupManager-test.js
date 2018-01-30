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
    4: { _id: '4', name: 'private1' },
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

  // search
  x = db.groups.search('ge');
  expect(x).toHaveLength(1);
  x = db.groups.search('gro');
  expect(x).toHaveLength(2);
  x = db.groups.search('genr');
  expect(x).toHaveLength(0);
  x = db.groups.search('zz');
  expect(x).toHaveLength(0);

  // @todo: check sorted
});

it('sorted list', () => {
  // sorted groups is based on last messages added at
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  sampleGroups();
  let date = new Date(new Date().getTime() - 60000); // one minute before
  let messages = {
    1: { _id: '14', rid: '1', text: 'one', createdAt: date, user: { _id: '2', username: 'who', name: 'wh' } },
  };
  db.addMessages(db.groups.findById('1'), messages);
  messages = {
    2: { _id: '2', rid: '444', text: 'second', createdAt: new Date(), user: { _id: '2', username: 'who', name: 'wh' } },
  };
  db.addMessages(db.groups.findById('444'), messages);
  date = new Date(new Date().getTime() - 30000);
  messages = {
    3: { _id: '3', rid: '844', text: 'third', createdAt: date, user: { _id: '2', username: 'who', name: 'wh' } },
  };
  db.addMessages(db.groups.findById('844'), messages);
  let x = db.groups.sortedList;
  expect(x[0]).toMatchObject({ _id: '444' });

  date = new Date(new Date().getTime());
  messages = {
    4: { _id: '4', rid: '844', text: 'fourth', createdAt: date, user: { _id: '2', username: 'who', name: 'wh' } },
  };
  db.addMessages(db.groups.findById('844'), messages);
  x = db.groups.sortedList;
  expect(x[0]).toMatchObject({ _id: '844' });
});

it('delete groups', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  const g = sampleGroups();
  expect(db.groups.list).toHaveLength(g);
  // empty group passed to remove
  db.groups.deleteGroups({});
  expect(db.groups.list).toHaveLength(6);
  // no input to delete group
  db.groups.deleteGroups(null);
  expect(db.groups.list).toHaveLength(6);
  // delete group which is not present
  let objs = {
    51: { _id: '51',
      name: 'direct 51',
      type: 'd',
    },
  };
  db.groups.deleteGroups(objs);
  // delete group which is present
  expect(db.groups.list).toHaveLength(6);
  objs = {
    444: { _id: '444', name: 'public group1', type: 'c' },
  };
  db.groups.deleteGroups(objs);
  expect(db.groups.list).toHaveLength(5);
});

it('update groups', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  const g = sampleGroups();
  expect(db.groups.findById('777').heading).toBe('direct 1');
  let objs = {
    777: { _id: '777', name: 'direct 1', title: 'direct title', type: 'c' },
    4: { _id: '4', name: 'private1' },
    123: { _id: '123', name: 'public group2', type: 'c' },
    844: { _id: '844', name: 'private2', type: 'y' }, // invalid type
    444: { _id: '444', name: 'public group1', type: 'c' },
    1: { _id: '1', name: 'general', type: 'c' },
  };
  db.groups.addAll(objs);
  expect(db.groups.list).toHaveLength(g);
  expect(db.groups.findById('777').heading).toBe('direct title');
  // passing invalid groups for add or update groups
  db.groups.addAll(null);
  expect(db.groups.list).toHaveLength(g);
  // passing invalid groups for add or update groups
  db.groups.addAll({});
  expect(db.groups.list).toHaveLength(g);
  // passing invalid group without _id
  objs = {
    777: { name: 'direct 1', title: 'direct title', type: 'c' },
  };
  db.groups.addAll(objs);
  expect(db.groups.list).toHaveLength(g);
});

it('reply root message', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  sampleGroups();
  const date = new Date(); // one minute before
  const messages = {
    1: { _id: '14', rid: '1', text: 'one', createdAt: date, user: { _id: '2', username: 'who', name: 'wh' } },
  };
  db.addMessages(db.groups.findById('1'), messages);
  let replyMessage = {
    10: { _id: '22',
      rid: '4',
      text: '[ ] (sf/df/sd?msg=14) test reply',
      createdAt: date,
      editedAt: date,
      isReply: true,
      user: { _id: '2', username: 'who', name: 'wh' } },
  };
  db.addMessages(db.groups.findById('1'), replyMessage);
  replyMessage = {
    11: { _id: '23',
      rid: '4',
      text: '[ ] (sf/df/sd?msg=14) test reply 1',
      createdAt: date,
      editedAt: date,
      isReply: true,
      user: { _id: '2', username: 'who', name: 'wh' } },
  };
  db.addMessages(db.groups.findById('1'), replyMessage);
  replyMessage = {
    14: { _id: '25',
      rid: '4',
      text: '[ ] (sf/df/sd?msg=23) test reply 2',
      createdAt: date,
      editedAt: date,
      isReply: true,
      user: { _id: '2', username: 'who', name: 'wh' } },
  };
  db.addMessages(db.groups.findById('1'), replyMessage);
  // success scenario
  let x = db.groups.findById('1').findRootMessage('22');
  expect(x).toMatchObject({ _id: '14' });
  x = db.groups.findById('1').findRootMessage('23');
  expect(x).toMatchObject({ _id: '14' });
  // scenario 2: 14->23->25. root msg for 25 is 14
  x = db.groups.findById('1').findRootMessage('25');
  // TO-DO fix this bug
  console.log('findroot message log ', x);
//  expect(x).toMatchObject({ _id: '14' });
  // scenario 3: message is not reply message, returns same message
  x = db.groups.findById('1').findRootMessage('14');
  expect(x).toMatchObject({ _id: '14' });
  // failure scenario: message not found
  x = db.groups.findById('1').findRootMessage('101');
  expect(x).toBeNull();
});

it('more messages', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  sampleGroups();
  // Default value should be true
  expect(db.groups.findById('4').moreMessages).toBe(true);

  // when updated the more messages as false. it need to update in db
  db.groups.updateNoMoreMessages(db.groups.findById('4'));
  expect(db.groups.findById('4').moreMessages).toBe(false);

  // when group is passes as null, no changes in prev value
  db.groups.updateNoMoreMessages(null);
  expect(db.groups.findById('1').moreMessages).toBe(true);
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

it('filter out groups', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  const g = sampleGroups();
  expect(db.groups.list).toHaveLength(g);
  expect(db.groups.filteredList()).toHaveLength(g);
  // empty array
  expect(db.groups.filteredList([])).toHaveLength(g);
  expect(db.groups.filteredList(['unknown'])).toHaveLength(g);
  expect(db.groups.filteredList(['general'])).toHaveLength(g - 1);
  expect(db.groups.filteredList(['general', 'onemoreunknown'])).toHaveLength(g - 1);
  // shouldn't exclude 'public' matches
  expect(db.groups.filteredList(['public', 'general'])).toHaveLength(g - 1);
  // two successful one
  expect(db.groups.filteredSortedList(['private2', 'general'])).toHaveLength(g - 2);
});

it('group methods', () => {
  var db = new Database();
  db.switchDb('inst', 'test');
  // lets reset the db
  db.reset();
  sampleGroups();
  // private group types
  expect(db.groups.privateList[0].isPrivate).toBe(true);
  expect(db.groups.privateList[0].isPublic).toBe(false);
  expect(db.groups.privateList[0].isDirect).toBe(false);

  // public group types
  expect(db.groups.publicList[0].isPrivate).toBe(false);
  expect(db.groups.publicList[0].isPublic).toBe(true);
  expect(db.groups.publicList[0].isDirect).toBe(false);

  // direct group types
  expect(db.groups.directList[0].isPrivate).toBe(false);
  expect(db.groups.directList[0].isPublic).toBe(false);
  expect(db.groups.directList[0].isDirect).toBe(true);

  // avatar
  expect(db.groups.findById('4').avatar).not.toBeNull();
});
