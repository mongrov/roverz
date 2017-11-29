/**
 * Test to check if the component renders correctly
 */
/* global it expect */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import FormInput from '@ui/FormInput';
import FormInputSimple from '@ui/FormInputSimple';

it('FormInput renders correctly', () => {
  const tree = renderer.create(
    <FormInput value={'John Smith'} />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});


it('FormInputSimple renders correctly', () => {
  const tree = renderer.create(
    <FormInputSimple value={'John Smith'} />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
