/*
 * Message data structure
 */
import Constants from './constants';

const MessageSchema = {
  name: Constants.Message,
  primaryKey: '_id',
  properties: {
    _id: 'string',
    text: 'string',
    image: { type: 'string', optional: true },
    remoteFile: { type: 'string', optional: true },  // needs to be used to fetch the image url
    createdAt: { type: 'date', optional: true },
    updatedAt: { type: 'date', optional: true },
    status: { type: 'int', default: 0 }, // delivered, read
    original: { type: 'string', optional: true }, // optional - store the original message
    user: { type: Constants.User, optional: true },
    type: { type: 'int', default: 0 }, // text, image
    replyMessageId: { type: 'string', optional: true },
    isReply: { type: 'bool', default: false },
    likes: { type: 'int', default: 0 }, // thumsup value
  },
};
export default class Message {
}
Message.schema = MessageSchema;
