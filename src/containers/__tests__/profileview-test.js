/**
 * Test to check if the component renders correctly
 */
/* global it expect jest */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import ProfileView from '@containers/profile/ProfileView';

// Login prop expects a promise
const mockPromise = new Promise(resolve => resolve());

it('ProfileView renders correctly', () => {
  const tree = renderer.create(
    <ProfileView currentUser={() => mockPromise} />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
