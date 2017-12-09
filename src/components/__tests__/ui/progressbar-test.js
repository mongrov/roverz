/**
 * Test to check if the component renders correctly
 */
/* global it expect */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import ProgressBar from '@ui/ProgressBar';

it('ProgressBar renders correctly', () => {
  const tree = renderer.create(
    <ProgressBar />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should change the password value', () => {
  const progressComponent = renderer.create(<ProgressBar />).getInstance();
  progressComponent.componentWillReceiveProps(50);
  expect(progressComponent.state.progress).toEqual(50);
});
