/**
 * Database constants
 */
export default {
  MODULE: 'Database',

  // tables
  App: 'Rover',
  Group: 'Group',
  Message: 'Message',
  User: 'User',
  RemoteFile: 'RemoteFile',
  Board: 'Board',
  Lists: 'Lists',
  Card: 'Card',
  CardComments: 'CardComments',
  Checklists: 'Checklists',

  // server
  Servers: 'app:servers',
  LastDBUsed: 'app:database',
  LastUserId: 'app:userid',

  // common date fields
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  LAST_MESSAGE_AT: 'lastMessageAt',

  // group types
  G_PUBLIC: 'public',
  G_PRIVATE: 'private',
  G_DIRECT: 'direct',

  // User status
  U_ONLINE: 'online',
  U_OFFLINE: 'offline',
  U_AWAY: 'away',
  U_BUSY: 'busy',

  // Message status
  M_LOCAL: 0,
  M_DELIVERED: 10,
  M_READ: 100,

  // Message type
  M_TYPE_TEXT: 0,
  M_TYPE_IMAGE: 1,
  M_TYPE_VIDEO: 2,
  M_TYPE_AUDIO: 3,
  M_TYPE_LOCATION: 4,

};
