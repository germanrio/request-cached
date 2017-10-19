const _ = require('lodash');


/**
 * Check params are correct and with default values
 * @param  {Object} params
 * @return {undef|throw}
 */
function checkDefaults(params) {
  // No params
  if (!params) {
    throw new Error('Params are missing');
  }
  else if (!params.main) {
    throw new Error('Main params are missing');
  }

  // Create defaults
  _.defaults(params, {request: {}});
  _.defaults(params.request, {
    customErrorFn: (error, response, body) => error
  });

  // Check uris
  if ((params.main && !params.main.uri && !params.main.url) ||
      (params.cache && !params.cache.uri && !params.cache.url)) {
    throw new Error('Uri or url is missing');
  }

  // Check save path
  if (params.save && !params.save.path) {
    throw new Error('Save path is missing');
  }
}


module.exports = {
  checkDefaults
};
