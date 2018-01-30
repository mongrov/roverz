import 'react-native';

import Database from '../';

it('addAll', () => {
  var db = new Database();
  db.switchDb('mongrov', 'test');
  // lets reset the db
  db.reset();
  db.remotefiles.addAll(null);
  expect(db.remotefiles.list).toHaveLength(0);
  db.remotefiles.addAll({});
  expect(db.remotefiles.list).toHaveLength(0);
  expect(db.remotefiles.cacheList).toMatchObject({});
  db.remotefiles.deleteAll();
  let objs = {
    1: 'https://mongrov.redflock.net/group/idc',
    abc: 'https://mongrov.redflock.net',
    xyz: 'https://www.google.com',
    4: 'https://www.gmail.com',
    5: null,
  };
  db.remotefiles.addAll(objs);
  expect(db.remotefiles.list).toHaveLength(5);

  // null value will be replaced by empty string
  objs = {
    1: 'https://mongrov.redflock.net/group/idc',
    abc: 'https://mongrov.redflock.net',
    xyz: 'https://www.google.com',
    4: 'https://www.gmail.com',
    5: '',
  };
  expect(db.remotefiles.cacheList).toMatchObject(objs);
  expect(db.remotefiles.findById('xyz')).not.toBeNull();
  // try to search id which is not present
  expect(db.remotefiles.findById(null)).toBeNull();
  expect(db.remotefiles.findById('lmn')).toBeNull();
  db.remotefiles.deleteAll();
});

it('cacheList', () => {
  var db = new Database();
  db.switchDb('mongrov', 'test');
  // lets reset the db
  db.reset();
  // initial it should be empty
  expect(db.remotefiles.cacheList).toMatchObject({});

  // after populated cachelist should have the same
  const objs = {
    1: 'https://mongrov.redflock.net/group/idc',
    abc: 'https://mongrov.redflock.net',
    xyz: 'https://www.google.com',
    4: 'https://www.gmail.com',
    5: '',
  };
  db.remotefiles.addAll(objs);
  expect(db.remotefiles.cacheList).toMatchObject(objs);
});
