/**
 * Chat specific methods/functionality
 *
 * -- This is the business logic layer for chat --
 */
// import { ModuleConfig } from '../constants/';

// Enable debug output when in Debug mode
// const DEBUG_MODE = ModuleConfig.DEV;

// use cases:
// 1) user sends a message:
//  (a) UI would send message to db
//  (b) this layer that observes DB changes would get the message
//  (c) queues the request to send to backend
// 2) user deletes a message:
//  (a) UI checks permission to delete - from this layer
//  (b) this layer co-ordinates with RC layer to check permissions
//  (c) UI deletes from db
//  (d) this layer observes db changes and would get the change
//  (e) queues the request

class Chat {
  constructor() {
    if (!this._db) {
      this._db = null;
    }
  }

  // @todo - do any reinitializations here
  set db(dbHandle) {
    this._db = dbHandle;
  }
}

/* Export ==================================================================== */
export default Chat;
