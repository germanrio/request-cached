var _ = require('lodash'),
    fs = require('fs');


function saveFile(path, content) {
  fs.writeFile(path, content, function(err) {
    if (err) console.log(err);
  });
}

function saveJson(data) {
  return JSON.stringify(data);
}

function savePage(reqParams, saveParams, body) {
  var saveFn = saveParams.fn || (reqParams.json && saveJson),
      data = _.isFunction(saveFn) ? saveFn(body) : body;
  saveFile(saveParams.path, data);
}


exports.page = savePage;
