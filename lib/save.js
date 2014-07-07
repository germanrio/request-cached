var _ = require('lodash'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path');


function saveFile(filePath, content) {
  // Create folder if doesn't exist
  mkdirp.sync(path.dirname(filePath));

  fs.writeFile(filePath, content, function(err) {
    if (err) console.error(err);
  });
}

function parseJson(data) {
  return JSON.stringify(data);
}

function savePage(reqParams, saveParams, body) {
  var parseFn = saveParams.parseFn || (reqParams.json && parseJson),
      data = _.isFunction(parseFn) ? parseFn(body) : body;
  saveFile(saveParams.path, data);
}


exports.page = savePage;
