/**
 * Test to check if the component renders correctly
 */
/* global it expect */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import ListItem from '@ui/ListItem';

/* eslint-disable global-require */
it('ListItem renders correctly', () => {
  const tree = renderer.create(
    <ListItem
      title={'Hello world'}
      subTitle={'Sub title'}
      roundAvatar
      avatar={require('../../../image.png')}  // eslint-disable-line global-require
    />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
/* eslint-enable global-require */
