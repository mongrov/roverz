/*
 * app related all data structures
 */
import App from './App';
import User from './user';
import Message from './message';
import Attachment from './attachment';
import Event from './event';
import Group from './group';
import LoginSettings from './loginsettings';
import RemoteFile from './RemoteFile';

// @todo:
// - next round of refactoring, move some helpers
//   with regards to this schema here

module.exports = {
  schema: [App, User, Group, Message, Attachment, Event, LoginSettings, RemoteFile],
  schemaVersion: 1,
  migration: () => { },
};
