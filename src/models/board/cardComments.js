/*
 * Card model/schema file
 */

import Constants from '../constants';

const CardCommentsSchema = {
  name: Constants.CardComments,
  primaryKey: '_id',
  properties: {
    // -- identity
    _id: 'string',
    text: 'string',
    userId: 'string',
    boardId: 'string',
    cardId: 'string',
    createdAt: { type: 'date', optional: true },
  },
};
export default class CardComments {
}

CardComments.schema = CardCommentsSchema;
