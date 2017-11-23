/*
 * Group data structure
 */
import Application from '../constants/config';
import Constants from './constants';

const GroupSchema = {
  name: Constants.Group,
  primaryKey: '_id',
  properties: {
    _id: 'string',
    name: { type: 'string', default: '' },
    type: { type: 'string', default: Constants.G_PUBLIC }, // direct (1:1), public (open channel), private (group)
    title: { type: 'string', default: '' },
    unread: { type: 'int', default: 0 },
    updatedAt: { type: 'date', optional: true },
    lastMessageAt: { type: 'date', optional: true },
    messages: { type: 'list', objectType: Constants.Message },
    moreMessages: { type: 'bool', default: true },
    attachments: { type: 'list', objectType: Constants.Attachment },
    jitsiTimeout: { type: 'date', optional: true },
    jitsiRunning: { type: 'bool', default: false },
  },
};

export default class Group {
  get avatar() {
    return `${Application.urls.SERVER_URL}/avatar/${this.name}`;
  }
  get heading() {
    return this.title ? this.title : this.name;
  }
  get sortedMessages() {
    return this.messages.sorted(Constants.CREATED_AT, true);
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
    if (this.messages.length > 0) {
      return this.sortedMessages[0];
    }
    return null;
  }
  get sortedAttachments() {
    return this.attachments.sorted(Constants.CREATED_AT, true);
  }

  // TO-DO use indexed search instead of loop
  findMessageById(msgId) {
    if (msgId && this.messages.length > 0) {
      for (let i = 0; i < this.messages.length; i += 1) {
        const m = this.messages[i];
        if (m._id === msgId) {
          return m;
        }
      }
    }
    return null;
  }

  findRootMessage(msgId) {
    let replMsg = null;
    if (msgId && this.messages.length > 0) {
      let tempArray = this.messages.filtered(`_id = "${msgId}"`);
      replMsg = (tempArray && tempArray.length > 0) ? tempArray['0'] : null;
      while (replMsg && replMsg.isReply) {
        tempArray = this.messages.filtered(`_id = "${replMsg.replyMessageId}"`);
        replMsg = (tempArray && tempArray.length > 0) ? tempArray['0'] : null;
      }
    }
    return replMsg;
  }

  // TO-DO use indexed search instead of loop
  findAttachmentById(attachmentId) {
    if (attachmentId && this.attachments.length > 0) {
      for (let i = 0; i < this.attachments.length; i += 1) {
        const a = this.attachments[i];
        if (a._id === attachmentId) {
          return a;
        }
      }
    }
    return null;
  }

  // --- find utilities ---

  // find non-present messages {id: message obj} that are not present in group
  // simple algorithm to loop thru group messages would work better
  findMissingMessages(messages) {
    var nonExisting = Object.assign({}, messages);
    if (!messages) return nonExisting;
    for (let i = 0; i < this.messages.length; i += 1) {
      const m = this.messages[i];
      if (Object.prototype.hasOwnProperty.call(nonExisting, m._id)) {
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

  commentsList(msgId) {
    if (msgId) {
      return this.messages.filtered('isReply==true');
    }
    return null;
  }

}
Group.schema = GroupSchema;
