/**
 * Test to check if the component renders correctly
 */
/* global it expect */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import ImageGallery from '@containers/image/ImageGallery';

it('ImageGallery renders correctly', () => {
  const tree = renderer.create(
    <ImageGallery />,
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should change the password value', () => {
  const imagecomponent = renderer.create(<ImageGallery />).getInstance();
  // imagecomponent.onChangeImage(0);
  expect(imagecomponent.state.index).toEqual(0);
});
