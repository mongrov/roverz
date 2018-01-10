/**
 * Test to check if the component renders correctly
 */
/* global it expect */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Preloader from '@components/general/ActivityIndicator';

it('Preloader renders correctly', () => {
  const tree = renderer.create(
    <Preloader />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
