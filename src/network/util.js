const UTIL = {

  findRoomKeyInArray: (arrayData, filterRoom) => {
    var matchKey = null;
    Object.keys(arrayData).forEach((k) => {
      var obj = arrayData[k];
      if (obj.name === filterRoom) {
        matchKey = k;
      }
    });
    return matchKey;
  },

  findUserKeyInArray: (arrayData, idToMatch) => {
    var matchKey = null;
    Object.keys(arrayData).forEach((k) => {
      var obj = arrayData[k];
      if (obj._id === idToMatch) {
        matchKey = k;
      }
    });
    return matchKey;
  },

};

/* Export ==================================================================== */
module.exports = UTIL;
