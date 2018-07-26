/*
 * Card model/schema file
 */

import Constants from '../constants';

const ChecklistitemsSchema = {
  name: Constants.Checklistitems,
  primaryKey: '_id',
  properties: {
    // -- identity
    _id: 'string',
    checklistId: 'string',
    cardId: 'string',
    title: 'string',
    userId: 'string',
    sort: { type: 'int', default: 0 },
    isFinished: { type: 'bool', default: false },
  },
};

export default class Checklistitems {
}

Checklistitems.schema = ChecklistitemsSchema;
