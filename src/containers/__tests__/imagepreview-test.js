/**
 * Test to check if the component renders correctly
 */
/* global it expect */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import ImagePreview from '@containers/image/ImagePreview';
// import { Actions } from 'react-native-router-flux';


it('ImagePreview renders correctly', () => {
  const tree = renderer.create(
    <ImagePreview />,
    ).toJSON();
  expect(tree).toMatchSnapshot();
});


// it('Actions renders correctly', () => {
//   const cameraData = 'viswa';
//   const cameraMessage = 'message';
//   const expectedAction = {
//       // type: 'ADD_TODO',
//     cameraData: 'viswa',
//     cameraMessage: 'message',
//   };
//   expect(Actions.refresh(cameraData, cameraMessage)).toEqual(expectedAction);
// });

// it('Actions renders correctly', () => {
//  const attach = { cameraData: 'data', cameraMessage: 'message', video: true };
//   const expectedAction = {
//         // type: 'ADD_TODO',
//     cameraData: 'viswa',
//     cameraMessage: 'message',
//     video: 'true',
//   };
//  expect(Actions.refresh()).toEqual(attach);
// });

// it(' pop Actions renders correctly', () => {
//   expect(Actions.pop()).toEqual();
// });

