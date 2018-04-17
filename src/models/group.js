/*
 * Group data structure
 */

import moment from 'moment';
import Application from '../constants/config';
import Constants from './constants';

const GroupSchema = {
  name: Constants.Group,
  primaryKey: '_id',
  properties: {
    // -- identity
    _id: 'string',
    name: { type: 'string', default: '' },
    title: { type: 'string', default: '' },

    // -- type & status
    type: { type: 'string', default: Constants.G_PUBLIC }, // direct (1:1), public (open channel), private (group)
    unread: { type: 'int', default: 0 },

    // -- meta data
    updatedAt: { type: 'date', optional: true },
    lastMessageAt: { type: 'date', optional: true },

    // -- data
    messages: { type: 'list', objectType: Constants.Message },
    moreMessages: { type: 'bool', default: true },
    readonly: { type: 'bool', default: false },
  },
};

export default class Group {
  get avatar() {
    return `${Application.urls.SERVER_URL}/avatar/${this.name}`;
  }
  get heading() {
    return this.title || this.name;
  }
  get sortedMessages() {
    return this.messages.filtered(`type != ${Constants.M_TYPE_LOCATION}`).sorted(Constants.CREATED_AT, true);
  }
  get isPrivate() {
    return this.type === Constants.G_PRIVATE;
  }
  get isPublic() {
    return this.type === Constants.G_PUBLIC;
  }
  get isDirect() {
    return this.type === Constants.G_DIRECT;
  }
  get lastMessage() {
    return (this.messages.length > 0) ? this.sortedMessages[0] : null;
  }
  get locationMessages() {
    var res = this.messages.filtered(`type = ${Constants.M_TYPE_LOCATION}`);
    if (!res || res.length <= 0) {
      return res;
    }
    const filtered = res.filter((msg) => {
      const msgTs = moment(msg.createdAt);
      const currentTsDiff = moment().diff(msgTs, 'day');
      return currentTsDiff < 1;
    });
    return filtered;
  }

  // --- find utilities ---

  findMessageById(msgId) {
    if (msgId && this.messages.length > 0) {
      const res = this.messages.filtered(`_id = "${msgId}"`);
      return (res && res.length > 0) ? res['0'] : null;
    }
    return null;
  }

  findRootMessage(msgId) {
    var replMsg = this.findMessageById(msgId);
    while (replMsg && replMsg.isReply) {
      replMsg = this.findMessageById(replMsg.replyMessageId);
    }
    return replMsg;
  }

  // find non-present messages {id: message obj} that are not present in group
  // simple algorithm to loop thru group messages would work better
  findMissingMessages(messages) {
    var nonExisting = Object.assign({}, messages);
    if (!messages) return nonExisting;
    for (let i = 0; i < this.messages.length; i += 1) {
      const m = this.messages[i];
      if (m.likes === 0 && Object.prototype.hasOwnProperty.call(nonExisting, m._id)) {
        delete nonExisting[m._id];
      }
    }
    // lets also filter out messages that don't belong to the group
    Object.keys(nonExisting).forEach((k) => {
      const m = nonExisting[k];
      if (!('rid' in m && m.rid === this._id)) {
        delete nonExisting[m._id];
      }
    });
    return nonExisting;
  }

}
Group.schema = GroupSchema;
