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

```javascript
{
  main: {
    uri: 'http://domain/mainUrl',
    qs: {
      id: 'userId'
    }
  },
  cache: {
    uri: 'http://localhost/cachedUrl'
  },
  save: {
    path: '/tmp/'
  },
  request: {
    proxy: 'http://localhost:8880',
    encoding: 'utf8'
  }
}
```

## Example
