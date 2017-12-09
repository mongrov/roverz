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

};
