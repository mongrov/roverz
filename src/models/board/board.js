/*
 * Board model/schema file
 */

import Constants from '../constants';

const BoardSchema = {
  name: Constants.Board,
  primaryKey: '_id',
  properties: {
    // -- identity
    _id: 'string',
    title: 'string',
    // members: { type: 'list', objectType: Constants.User },
    archived: { type: 'bool', default: false },
    createdAt: { type: 'date', optional: true },
    stars: { type: 'int', default: 0 },
  },
};
export default class Board {
}

Board.schema = BoardSchema;
