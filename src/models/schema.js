/*
 * app related all data structures
 */
import App from './App';
import User from './user';
import Message from './message';
import Group from './group';
import RemoteFile from './RemoteFile';
import Board from './board/board';
import Lists from './board/lists';
import Card from './board/card';
import CardComments from './board/cardComments';
import Checklists from './board/checklists';
import Checklistitems from './board/checklistitems';
import Members from './board/Members';
// @todo:
// - next round of refactoring, move some helpers
//   with regards to this schema here

module.exports = {
  schema: [App, User, Group, Message, RemoteFile, Card, Board, Lists, CardComments, Checklists, Checklistitems, Members],
  schemaVersion: 1,
  migration: () => { },
};
