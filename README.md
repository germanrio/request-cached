# Request cached

This library adds to [request library][requestWeb] the ability to cache data retrieved from a real server into a local server.

So, when you are requesting the data for the first time, the data will be retrieved from the real server and saved locally. And whenever you do the request for a second time, the data is retrieved locally.

Useful when scrapping.

[requestWeb]: https://github.com/mikeal/request "Request library"


## Index
* [Install](#install)
* [Use](#use)
  - [Params](#params)
  - [Callback](#callback)
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
* `main`: Compulsory object where are set the params to access real data
  - All possible [request params][requestParams]
* `cache`: Optional object where are set the params to access cached data
  - All possible [request params][requestParams]
* `save`: Optional object where are set the params to save real data
  - path: Path to save data to
  - fn: Function used to modify data before saving them
* `request`: Optional object where are set the additional params to access real and cached data
  - All possible [request params][requestParams]

[requestParams]: https://github.com/mikeal/request#requestoptions-callback "Params in request library"


### Callback
1. First argument of [request callback][requestParams]
2. Second argument of [request callback][requestParams]
3. Third argument of [request callback][requestParams]
4. A boolean indicating whether the data is retrieved from cache or not.


## Example

```javascript
var requestCached = require('request-cached'),
    userId = 12345;

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

requestCached(params, function (error, response, body, isCached) {
  console.log(body);
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
Note: Of course is needed to have properly installed node and npm.

