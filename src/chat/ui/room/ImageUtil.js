
import Meteor from 'react-native-meteor';
import Network from '../../../network';


class ImageUtil {

  _slugify(desc, acfileame) {
    var text = desc;
    if (!text) {
      text = acfileame.split('.');
      text = text[0];
    }
    text = text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // eslint-disable-line no-useless-escape
      .replace(/\-\-+/g, '-')         // eslint-disable-line no-useless-escape
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
    if (text.length < 1) {
      text = acfileame;
    }
    return text;
  }

  _getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i).toLowerCase();
  }


  uploadImage(data, rid, isImage, desc, callBack) {
    let ezfilesize = 10050000;
    const _net = new Network();
    const maxfileSize = _net.getServerSetting('FileUpload_MaxFileSize');
    if (maxfileSize && maxfileSize.value) {
      ezfilesize = maxfileSize.value;
    }
    const _super = this;
    if (data.size) {
      ezfilesize = data.size;
    }
    _super._metUploadRequest(data, ezfilesize, rid, isImage, desc, callBack);
  }

  _metUploadRequest(data, filesize, roomid, isImage, desc, callBack) {
    var acfilename = data.path.replace(/^.*[\\\/]/, ''); // eslint-disable-line no-useless-escape
    const fileTemp = acfilename.split('?');// this is the key we got from meteor
    acfilename = fileTemp[0];
    const _super = this;
        // upload request
    let ezType = 'video/mp4';
    if (isImage) { ezType = 'image/jpeg'; }
    const newFileName = this._slugify(desc, acfilename) + this._getExtension(acfilename);

    Meteor.call('slingshot/uploadRequest', 'rocketchat-uploads', { name: newFileName, size: filesize, type: ezType },
    { rid: roomid }, (err, res) => {
      _super._parseMetUploadResponse(data, newFileName, filesize, res, ezType, desc, callBack);
    });
  }

  _parseMetUploadResponse(data, newfilename, filesize, res, ezType, desc, callBack) {
    let fileType = ezType;
    var uploadFilename = '';
    for (let i = 0; i < res.postData.length; i += 1) {
      const name = res.postData[i].name;
      const value = res.postData[i].value;
      if (name === 'key') {
        uploadFilename = value;
      } else if (name === 'Content-Type') {
        fileType = value;
      }
    }
    const file = {
      uri: data.path,
      name: newfilename,
      type: fileType,
    };

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    for (let i = 0; i < res.postData.length; i += 1) {
      const name = res.postData[i].name;
      const value = res.postData[i].value;
      formData.append(name, value);
    }

    formData.append('file', file);
    callBack(newfilename, 0, 'STARTED');
    xhr.upload.addEventListener('progress', (evt) => {
      if (evt.lengthComputable) {
        const percentComplete = evt.loaded / evt.total;
        if (percentComplete === 1) {
          callBack(newfilename, percentComplete, 'COMPLETE');
        } else {
          callBack(newfilename, percentComplete, 'INPROGRESS');
        }
      }
    }, false);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 204) {
          const ezURI = decodeURIComponent(xhr.responseHeaders.Location); // .replace('%2F', '/');
          const temp = uploadFilename.split('/');// this is the key we got from meteor
          const ezid = temp[temp.length - 1];
          temp.pop();
//          const subFolder = temp[temp.length - 1];// unused
          temp.pop();
          const folder = temp[temp.length - 1];
          const fileObj = {
            type: fileType, size: filesize, name: newfilename, description: desc, _id: ezid, url: ezURI,
          };

          Meteor.call('sendFileMessage', folder, 's3', fileObj, (sferr, sfres) => {
          });
          callBack(newfilename, 1, 'SENT');
        } else {
          callBack(newfilename, 1, 'FAILED');
        }
      }
    };
    xhr.open('POST', res.upload);
    xhr.setRequestHeader('Content-Length', formData.length);
    xhr.send(formData);
  }

}

export default ImageUtil;
