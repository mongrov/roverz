/*
 * Card model/schema file
 */

import Constants from '../constants';

const ChecklistsSchema = {
  name: Constants.Checklists,
  primaryKey: '_id',
  properties: {
    // -- identity
    _id: 'string',
    cardId: 'string',
    title: 'string',
    userId: 'string',
    sort: { type: 'int', default: 0 },
    createdAt: { type: 'date', optional: true },
  },
};
export default class Checklists {
}

Checklists.schema = ChecklistsSchema;
