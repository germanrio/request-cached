var _ = require('lodash');


function checkDefaults (params) {
  _.defaults(params, {
    main: {},
    request: {}
  });

  // No params
  if (!params) {
    throw new Error('Params are missing');
  }

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


exports.checkDefaults = checkDefaults;
