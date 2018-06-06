/*
 * Card model/schema file
 */

 import Constants from '../constants';

 const CardSchema = {
   name: Constants.Card,
   primaryKey: '_id',
   properties: {
    // -- identity
     _id: 'string',
     title: 'string',
     userId: 'string',
     boardId: 'string',
     sort: { type: 'int', default: 0 },
     archived: { type: 'bool', default: false },
     isOvertime: { type: 'bool', default: false },
     createdAt: { type: 'date', optional: true },
     dateLastActivity: { type: 'date', optional: true },
   },
 };
 export default class Card {
}

 Card.schema = CardSchema;
