var checkDefaults = require('./params').checkDefaults,
    request = require('./request'),
    getMain = request.main,
    getCache = request.cache;


function getPage(params, callback) {
  // Check default params
  checkDefaults(params);

  // Make request
  getCache(params, function (err, res) {
    if (err) {
      getMain(params, function (err, res) {
        res.push(false);
        callback.apply(null, res);
      });
    }
    else {
      res.push(true);
      callback.apply(null, res);
    }
  });
}


exports.getPage = getPage;
