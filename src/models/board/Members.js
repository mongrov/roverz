/*
 * Card model/schema file
 */

import Constants from '../constants';

const MembersSchema = {
  name: Constants.Members,
  primaryKey: 'userId',
  properties: {
    // -- identity
    userId: 'string',
    isAdmin: { type: 'bool', default: false },
    isActive: { type: 'bool', default: false },
    isCommentOnly: { type: 'bool', default: false },
  },
};

export default class Members {
}

Members.schema = MembersSchema;
