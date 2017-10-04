
/**
 * Obtain page using params provided
 * @param  {Request} requestInstance
 * @param  {Object} params
 * @return {Promise<Object>}
 */
function getPageFromServer(requestInstance, params) {
  return new Promise((resolve, reject) => {
    requestInstance(params, (error, response, body) => {
      const err = params.customErrorFn(error, response, body);

      if (err) reject(err);
      else {
        resolve({
          response,
          body
        });
      }
    });
  });
}

/**
 * Obtain page from main source
 * @param  {Request} requestInstance
 * @param  {Object} params
 * @return {Promise<Object>}
 */
function getMain(requestInstance, params) {
  let {savePage} = require('./save'),
      pageParams = Object.assign({}, params.request, params.main);

  return getPageFromServer(requestInstance, pageParams)
    .then((result) => {
      if (params.save) {
        return savePage(pageParams, params.save, result.body)
          .then(() => {
            return result;
          });
      }
      return result;
    });
}

/**
 * Obtain page from cache source
 * @param  {Request} requestInstance
 * @param  {Object} params
 * @return {Promise<Object>|throw}
 */
function getCache(requestInstance, params) {
  if (params.cache) {
    return getPageFromServer(requestInstance,
      Object.assign({}, params.request, params.cache));
  }
  throw new Error('No cache configured');
}


module.exports = {
  getMain,
  getCache
};
