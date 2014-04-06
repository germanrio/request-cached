var expect = require('chai').expect,
    request = require('../lib/request'),
    getMain = request.main,
    getCache = request.cache;

describe('Request', function () {
  describe('getCache', function () {
    it('should return error when no cache params', function (done) {
      getCache({}, function (err) {
        expect(err).to.be.ok;
        done();
      });
    });
  });
});
