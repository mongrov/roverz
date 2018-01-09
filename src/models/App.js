/*
 * app related data structures
 */
import Constants from './constants';

// roverz master/global holder

const AppSchema = {
  name: Constants.App,
  primaryKey: '_id',
  properties: {
    _id: { type: 'int', default: 0 },
    lastSync: { type: 'date', optional: true },
    isServerConnected: { type: 'bool', default: false },
  },
};
export default class App {
}
App.schema = AppSchema;
