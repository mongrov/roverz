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
  db.remotefiles.deleteAll();
  const objs = {
    1: 'https://mongrov.redflock.net/group/idc',
    abc: 'https://mongrov.redflock.net',
    xyz: 'https://www.google.com',
    4: 'https://www.gmail.com',
    5: null,
  };
  db.remotefiles.addAll(objs);
  expect(db.remotefiles.list).toHaveLength(5);
  db.remotefiles.findById(null);
  db.remotefiles.findById('xyz');
  db.remotefiles.deleteAll();
});
