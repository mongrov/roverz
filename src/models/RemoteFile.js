/*
 * app related data structures
 */
import Constants from './constants';

// roverz master/global holder

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
