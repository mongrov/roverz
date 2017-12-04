/**
 * Test to check if the component renders correctly
 */
/* global it expect */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import AboutView from '@containers/about/AboutView';

it('AboutView renders correctly', () => {
  const tree = renderer.create(
    <AboutView />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
