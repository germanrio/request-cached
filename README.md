# Request cached

* [Install](#install)
* [Use](#use)
* [Example](#example)

## Install

Install request-cached with npm.

```
npm install request-cached --save
```

## Use
```javascript
var requestCached = require('request-cached');
requestCached(params, callback);
```

### Params

* main: Compulsory object where are set the params to access real data
  - All possible [request params][requestParams]
* cache: Optional object where are set the params to access cached data
  - All possible [request params][requestParams]
* save: Optional object where are set the params to save real data
  - path: Path to save data to
  - fn: Function used to modify data before saving them
* request: Optional object where are set the aditional params to access real and cached data
  - All possible [request params][requestParams]

[requestParams]: https://github.com/mikeal/request#requestoptions-callback "Params in request library"


## Example
```javascript
var requestCached = require('request-cached'),
    userId = 15654;

var params = {
  main: {
    uri: 'http://real/data/domain/mainUrl',
    qs: {
      id: userId
    }
  },
  cache: {
    uri: 'http://localhost/cachedUrl/' + userId
  },
  save: {
    path: '/var/www/cachedUrl/' + userId
  },
  request: {
    proxy: 'http://localhost:8080',
    encoding: 'utf8'
  }
};

requestCached(params, function (error, response, body) {
  console.log(body);
});
```
