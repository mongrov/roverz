/**
 * Test to check if the component renders correctly
 */
/* global it expect */
import { Platform } from 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import ProgressBar from '@ui/ProgressBar';

it('ProgressBar renders correctly', () => {
  const tree = renderer.create(
    <ProgressBar />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('progressbar componentWillReceiveProps', () => {
  const progressComponent = renderer.create(<ProgressBar />).getInstance();
  const tree = progressComponent.componentWillReceiveProps(50);
  expect(progressComponent.state.progress).toEqual(tree);
});

it('android', () => {
  Platform.OS = 'android';
  const component = renderer.create(<ProgressBar />).toJSON();
  expect(component).toMatchSnapshot();
});
it('ios', () => {
  Platform.OS = 'ios';
  const component = renderer.create(<ProgressBar />).toJSON();
  expect(component).toMatchSnapshot();
});
