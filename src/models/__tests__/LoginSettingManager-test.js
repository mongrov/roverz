
import 'react-native';

import Database from '../';

it('list getters', () => {
  const db = new Database('inst', 'test');
  db.switchDb('inst', 'test');
  db.loginSettings.deleteAll();
  db.loginSettings.addAll(null);
  db.loginSettings.deleteAll();
  const objs = {
    1: { _id: 'test', lsName: 'loginsettings ', lsDesc: 'log desc1', dummy: 'ad' },
  };
  db.loginSettings.addAll(objs);

  expect(db.loginSettings.list.length).toBeGreaterThan(0);
  expect(db.loginSettings.findByKey('xyz')).toBeNull();
  const x = db.loginSettings.findByKey('lsName');
  console.log(x);
  db.loginSettings.deleteAll();
  expect(db.loginSettings.list).toHaveLength(0);
});

