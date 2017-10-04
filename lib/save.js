const _ = require('lodash'),
    fs = require('fs'),
    path = require('path');


/**
 * Save content to a file
 * @param  {String} filePath
 * @param  {String} content
 * @return {Promise}
 */
function saveFile(filePath, content) {
  return new Promise((resolve, reject) => {
    // Create folder if doesn't exist
    require('mkdirp')(path.dirname(filePath), (err) => {
      if (err) reject(err);
      else {
        // Write the file
        fs.writeFile(filePath, content, (err) => {
          if (err) reject(err);
          else resolve();
        });
      }
    });
  });
}

/**
 * Parse json content in a response
 * @param  {Object} data
 * @return {String}
 */
function parseJson(data) {
  return JSON.stringify(data);
}

/**
 * Save a page into a file
 * @param  {Object} reqParams
 * @param  {Object} saveParams
 * @param  {String} body
 * @return {Promise}
 */
function savePage(reqParams, saveParams, body) {
  const parseFn = saveParams.parseFn || (reqParams.json && parseJson),
      data = _.isFunction(parseFn) ? parseFn(body) : body;
  return saveFile(saveParams.path, data);
}


module.exports = {
  savePage
};
