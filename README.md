# Request cached

[![Build Status][travisImg]][travisUrl]
[![Coverage Status][coverallsImg]][coverallsUrl]
[![NPM Version][npmImg]][npmUrl]

[travisImg]: https://travis-ci.org/germanrio/request-cached.svg?branch=master
[travisUrl]: https://travis-ci.org/germanrio/request-cached

[coverallsImg]: https://img.shields.io/coveralls/germanrio/request-cached.svg
[coverallsUrl]: https://coveralls.io/r/germanrio/request-cached

[npmImg]: https://img.shields.io/npm/v/request-cached.svg
[npmUrl]: https://npmjs.org/package/request-cached

This library adds to [request library][requestWeb] the ability to cache data retrieved from a main server into a local server.

So, when you are requesting data for the first time, it will be retrieved from the main server and saved locally. Afterwards whenever you do the request for a second time, the data is retrieved locally.

Useful when scrapping.

[requestWeb]: https://github.com/mikeal/request "Request library"


## Index
* [Install](#install)
* [Use](#use)
  - [Different request objects for main and cache requests](#different-request-objects-for-main-and-cache-requests)
  - [Params](#params)
  - [`Result` parameter if resolved](#result-parameter-if-resolved)
  - [`Error` parameter if rejected](#error-parameter-if-rejected)
* [Example](#example)
* [Code testing](#code-testing)
  - [Code coverage](#code-coverage)
* [License](#license)


## Install
Install `request-cached` with npm.

```
npm install request-cached --save
```


## Use
In order to use `request-cached` you need to provide the `request` object you want to use.

```javascript
const request = require('request'),
    requestCached = require('request-cached')(request);

return requestCached(params)
  .then((result) => {
    // Do something with the result
  })
  .catch((error) => {
    // Do something with the error
  });
```


### Different request objects for main and cache requests
The `request` object can be any other request-compatible object like `throttled-request`. You can even provide a different object for the cache and for the main requests, as you could probably have some limitations for the requests to the main server which you don't for the local server.

```javascript
const cacheRequest = require('request'),
    mainRequest = require('throttled-request')(cacheRequest),
    requestCached = require('request-cached')(mainRequest, cacheRequest);

mainRequest.configure({
  requests: 2,
  milliseconds: 1000
});

return requestCached(params)
  .then((result) => {
    // Do something with the result
  })
  .catch((error) => {
    // Do something with the error
  });
```


### Params
* `main`: Compulsory object where are set the params to access online data
  - All possible [request params][requestParams]
* `cache`: Optional object where are set the params to access cached data
  - All possible [request params][requestParams]
* `save`: Optional object where are set the params to save online data
  - `path`: Path to save data to
  - `parseFn`: Function used to modify data before saving it
* `request`: Optional object where are set the additional params to access online and cached data
  - All possible [request params][requestParams]
  - `customErrorFn`: Custom function to determine when a response is considered an error. By default:
  ```javascript
  customErrorFn: (error, response, body) =>
    error || (response.statusCode !== 200) || !body
  ```

[requestParams]: https://github.com/mikeal/request#requestoptions-callback "Params in request library"

### `Result` parameter if resolved
Object with the following keys:
- `response`: Second argument of a [request callback][requestParams]
- `body`: Third argument of a [request callback][requestParams]
- `isCached`: A boolean indicating whether the data is retrieved from cache or not.

### `Error` parameter if rejected
It is the first argument of a [request callback][requestParams]


## Example
```javascript
const request = require('request'),
    requestCached = require('request-cached')(request);

function getParams(userId) {
  return {
    main: {
      uri: 'http://real/data/domain/mainUrl',
      qs: {
        id: userId
      }
    },
    cache: {
      uri: `http://localhost/cachedUrl/${userId}`
    },
    save: {
      path: `/var/www/cachedUrl/${userId}`
    },
    request: {
      proxy: 'http://localhost:8080',
      encoding: 'utf8'
    }
  };
}

var userId = 12345;
return requestCached(getParams(userId))
  .then((result) => {
    console.log(result.body);
  })
  .catch((error) => {
    console.error(error);
  });
```


## Code testing
If you wanna test the code, follow these steps:

```
> git clone https://github.com/germanrio/request-cached.git
> cd request-cached
> npm install
> npm test
```
**Note:** Of course is also needed to have properly installed `node` and `npm`.


### Code coverage
If you also want to see the code coverage of tests:

```
> npm run cov
```

It will generate a `coverage` folder with the coverage report.


## License
MIT

More details in the `LICENSE` file in root folder.
