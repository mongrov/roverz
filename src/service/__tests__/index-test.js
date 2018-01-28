/* global it expect jest */
import 'react-native';

import Service from '../';

it('get filtered channels', () => {
  var s = new Service();
  expect(s.getFilteredChannels()).toBeNull();
});

