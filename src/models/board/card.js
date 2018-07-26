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
     listId: 'string',
     description: { type: 'string', optional: true },
     dueAt: { type: 'date', optional: true },
     receivedAt: { type: 'date', optional: true },
     startAt: { type: 'date', optional: true },
     endAt: { type: 'date', optional: true },
     spentTime: { type: 'date', optional: true },
     members: 'string',
   },
 };
 export default class Card {
}

 Card.schema = CardSchema;
