/*
 * app related all data structures
 */
import App from './App';
import User from './user';
import Message from './message';
import Attachment from './attachment';
import Group from './group';
import RemoteFile from './RemoteFile';

// @todo:
// - next round of refactoring, move some helpers
//   with regards to this schema here

module.exports = {
  schema: [App, User, Group, Message, Attachment, RemoteFile],
  schemaVersion: 1,
  migration: () => { },
};
