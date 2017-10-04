const {checkDefaults} = require('./params'),
    {getMain, getCache} = require('./request');


/**
 * Initialise request-cached
 * @param  {Request} mainRequestInstance
 * @param  {Request} [cacheRequestInstance]
 * @return {Function}
 */
module.exports = (mainRequestInstance, cacheRequestInstance) => {
  if (!mainRequestInstance) {
    throw new Error('Request param needed');
  }
  else if (!cacheRequestInstance) {
    cacheRequestInstance = mainRequestInstance;
  }

  /**
   * Request a page
   * @param  {Object} params
   *   @config {Object} main
   *   @config {Object} [cache]
   *   @config {Object} [save]
   *   @config {Object} [request]
   * @return {Promise<Object>}
   */
  return function getPage(params) {
    // Check default params
    checkDefaults(params);

    // Make request
    return getCache(cacheRequestInstance, params)
      .then(function (result) {
        return Object.assign(result, {isCached: true});
      })
      .catch(function () {
        return getMain(mainRequestInstance, params)
          .then(function (result) {
            return Object.assign(result, {isCached: false});
          });
      });
  };
};
