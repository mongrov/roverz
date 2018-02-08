/*
 * Message data structure
 */
import Constants from './constants';

const MessageSchema = {
  name: Constants.Message,
  primaryKey: '_id',
  properties: {
    // -- identity
    _id: 'string',
    user: { type: Constants.User, optional: true },
    replyMessageId: { type: 'string', optional: true },

    // -- type & status
    type: { type: 'int', default: 0 }, // text, image
    isReply: { type: 'bool', default: false },
    status: { type: 'int', default: Constants.M_LOCAL }, // delivered, read
    likes: { type: 'int', default: 0 }, // thumsup value

    // -- data
    original: { type: 'string', optional: true }, // optional - store the original message
    text: 'string',
    image: { type: 'string', optional: true },
    remoteFile: { type: 'string', optional: true },  // needs to be used to fetch the image url

    // -- meta data
    createdAt: { type: 'date', optional: true },
    updatedAt: { type: 'date', optional: true },
  },
};

export default class Message {
  setStatusAsDelivered() {
    this.status = Constants.M_DELIVERED;
  }

  setStatusAsRead() {
    this.status = Constants.M_READ;
  }
}

Message.schema = MessageSchema;
