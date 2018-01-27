/**
 * Test to check if utils is working as expected
 */
/* global it expect jest */
import 'react-native';

import NetworkUtil from '@network/util';

it('find room in array', () => {
  var users = [{ name: 'test1' }, { name: 'sample' }];
  NetworkUtil.findRoomKeyInArray(users, 'sample');
});

