/*
 * file cache - mostly for images
 */
import Constants from './constants';

const RemoteFileSchema = {
  name: Constants.RemoteFile,
  primaryKey: 'fileId',
  properties: {
    fileId: 'string',
    url: { type: 'string', default: '' },
  },
};

export default class RemoteFile {
}

RemoteFile.schema = RemoteFileSchema;
