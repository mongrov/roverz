/**
 * User Actions
 */

import AppAPI from '@lib/api';
import Meteor from 'react-native-meteor';

/**
  * Login to API and receive Token
  */
export function login(credentials) {
  return () => new Promise(async (resolve, reject) => {
    Meteor.loginWithPassword(credentials.username, credentials.password, (err) => {
      if (err) {
        return reject(err.reason);
      }
      resolve(credentials);
    });
  });
}

/**
  * Logout
  */
export function logout() {
  return dispatch => AppAPI.deleteToken()
    .then(() => {
      dispatch({
        type: 'USER_REPLACE',
        data: {},
      });
    });
}

/**
  * Get My User Data
  */
export function getMe() {
  return dispatch => AppAPI.me.get()
    .then((userData) => {
      dispatch({
        type: 'USER_REPLACE',
        data: userData,
      });

      return userData;
    });
}

/**
  * Update My User Data
  * - Receives complete user data in return
  */
export function updateMe(payload) {
  return dispatch => AppAPI.me.post(payload)
    .then((userData) => {
      dispatch({
        type: 'USER_REPLACE',
        data: userData,
      });

      return userData;
    });
}
