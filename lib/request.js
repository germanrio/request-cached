var _ = require('lodash'),
    request = require('request'),
    savePage = require('./save').page;


function getPageFromServer(params, pageResult) {
  request.get(params, function (error, response, body) {
    pageResult(error || (response.statusCode !== 200 || !body), arguments);
  });
}

function getMain(params, callback) {
  var tmpParams = _.extend({}, params.request, params.main);
  getPageFromServer(tmpParams, function (err, reqRes) {
    // Save to cache
    var body = reqRes[2];
    if (!err && params.save) savePage(tmpParams, params.save, body);

    callback(err, reqRes);
  });
}

function getCache(params, callback) {
  if (params.cache) {
    var tmpParams = _.extend({}, params.request, params.cache);
    getPageFromServer(tmpParams, callback);
  }
  else {
    callback(true);
  }
}


module.exports = {
  main: getMain,
  cache: getCache
};
