/*
 * app related data structures
 */
import Constants from './constants';

// roverz master/global holder

const LoginSettingsSchema = {
  name: Constants.LoginSettings,
  primaryKey: 'key',
  properties: {
    key: 'string',
    value: { type: 'string', default: '' },
  },
};
export default class LoginSettings {
}
LoginSettings.schema = LoginSettingsSchema;
