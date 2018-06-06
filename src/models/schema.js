/*
 * app related all data structures
 */
import App from './App';
import User from './user';
import Message from './message';
import Group from './group';
import RemoteFile from './RemoteFile';
import Card from './board/card';

// @todo:
// - next round of refactoring, move some helpers
//   with regards to this schema here

module.exports = {
  schema: [App, User, Group, Message, RemoteFile, Card],
  schemaVersion: 1,
  migration: () => { },
};
