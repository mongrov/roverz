import 'react-native';

import Database from '../';

it('addAll', () => {
  var db = new Database();
  db.switchDb('elix', 'test');
  // lets reset the db
  db.reset();
  db.remotefiles.addAll(null);
  expect(db.remotefiles.list).toHaveLength(0);
  db.remotefiles.addAll({});
  expect(db.remotefiles.list).toHaveLength(0);
  console.log(db.remotefiles.cacheList);
  db.remotefiles.deleteAll();
  const objs = {
    1: 'https://elix.yap.im/group/idc',
    abc: 'https://elix.yap.im',
    xyz: 'https://www.google.com',
    4: 'https://www.gmail.com',
    5: null,
  };
  db.remotefiles.addAll(objs);
  expect(db.remotefiles.list).toHaveLength(5);
  console.log(db.remotefiles.cacheList);
  db.remotefiles.findById(null);
  db.remotefiles.findById('xyz');
  db.remotefiles.deleteAll();
});
