/*
 * Message data structure
 */
import Constants from './constants';

const AttachmentSchema = {
  name: Constants.Attachment,
  primaryKey: '_id',
  properties: {
    _id: 'string',
    fileURL: 'string',
    fileName: { type: 'string', optional: true }, // TODO mandatory
    fileDesc: { type: 'string', optional: true },
    fileType: { type: 'string', optional: true },
    fileSize: { type: 'string', optional: true },
    createdAt: { type: 'date', optional: true },
  },
};
export default class Attachment {
}
Attachment.schema = AttachmentSchema;
