var _ = require('lodash'),
    request = require('request'),
    savePage = require('./save').page;


function getPageFromServer(params, pageResult) {
  request.get(params, function (error, response, body) {
    pageResult(error || (response.statusCode !== 200 || !body), arguments);
  });
}

function getMain(params, callback) {
  var tmpParams = _.extend({}, params.main, params.request);
  getPageFromServer(tmpParams, function (err, res) {
    // Save to cache
    var body = res[2];
    if (!err && params.save) savePage(tmpParams, params.save, body);

    callback(err, res);
  });
}

function getCache(params, callback) {
  if (params.cache) {
    var tmpParams = _.extend({}, params.cache, params.request);
    getPageFromServer(tmpParams, function (err, res) {
      callback(err, res);
    });
  }
  else {
    callback(true);
  }
}


exports = {
  main: getMain,
  cache: getCache
};
