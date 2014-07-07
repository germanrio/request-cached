var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    expect = chai.expect,
    _ = require('lodash'),
    request = require('request'),
    save = require('../lib/save'),

    getMain, getCache,
    // errorParams = 'not ok',
    // okParams = 'ok',
    requestStub,
    response,
    saveStub;

chai.use(sinonChai);


describe('Request', function () {

  before(function () {

    function getMock(params, callback) {
      callback.apply(null, response);
    }

    requestStub = sinon.stub(request, 'get', getMock);
    saveStub = sinon.stub(save, 'page');

    // In this case should be loaded after setting the stubs
    // It's because 'request' alias 'savePage' when loading
    delete require.cache[require.resolve('../lib/request')];
    var req = require('../lib/request');
    getMain = req.main;
    getCache = req.cache;
  });

  after(function () {
    requestStub.restore();
    saveStub.restore();
  });

  beforeEach(function () {
    requestStub.reset();
    saveStub.reset();
  });

  describe('getCache', function () {
    it('should return error when no cache params', function (done) {
      getCache({}, function (err) {
        expect(requestStub).to.have.not.been.called;
        expect(err).to.be.ok;
        done();
      });
    });

    it('should return data when params ok', function (done) {
      var params = {
            cache: {uri: true},
            request: {}
          };

      response = [false, {statusCode: 200}, 'text'];

      getCache(params, function (err, reqRes) {
        expect(requestStub).to.have.been.calledOnce;
        expect(err).to.be.false;
        expect(reqRes).to.be.eql(response);
        done();
      });
    });

    it('should return error when request empty or not 200', function (done) {
      var params = {
            cache: {uri: true},
            request: {}
          };

      response = [false, {statusCode: 200}, ''];

      // Body empty
      getCache(params, function (err, reqRes) {
        expect(requestStub).to.have.been.calledOnce;
        expect(err).to.be.ok;
        expect(reqRes).to.be.eql(response);

        // Status code not 200
        response = [false, {statusCode: 500}, 'text'];
        getCache(params, function (err, reqRes) {
          expect(requestStub).to.have.been.calledTwice;
          expect(err).to.be.ok;
          expect(reqRes).to.be.eql(response);
          done();
        });
      });
    });
  });

  describe('getMain', function () {
    it('should not save when no save params', function (done) {
      var params = {
            main: {uri: true},
            request: {}
          };

      response = [false, {statusCode: 200}, 'text'];

      getMain(params, function (err, reqRes) {
        expect(requestStub).to.have.been.calledOnce;
        expect(saveStub).to.have.not.been.called;
        expect(err).to.be.false;
        expect(reqRes).to.be.eql(response);
        done();
      });
    });

    it('should return data when params ok', function (done) {
      var params = {
            main: {uri: true},
            save: {path: true},
            request: {}
          };

      response = [false, {statusCode: 200}, 'text'];

      getMain(params, function (err, reqRes) {
        expect(requestStub).to.have.been.calledOnce;
        expect(saveStub).to.have.been.calledOnce;
        expect(err).to.be.false;
        expect(reqRes).to.be.eql(response);
        done();
      });
    });

    it('should return error when request empty or not 200', function (done) {
    var params = {
          main: {uri: true},
          save: {path: true},
          request: {}
        };

      response = [false, {statusCode: 200}, ''];

      // Body empty
      getMain(params, function (err, reqRes) {
        expect(requestStub).to.have.been.calledOnce;
        expect(saveStub).to.have.not.been.called;
        expect(err).to.be.ok;
        expect(reqRes).to.be.eql(response);

        // Status code not 200
        response = [false, {statusCode: 500}, 'text'];
        getMain(params, function (err, reqRes) {
          expect(requestStub).to.have.been.calledTwice;
          expect(saveStub).to.have.not.been.called;
          expect(err).to.be.ok;
          expect(reqRes).to.be.eql(response);
          done();
        });
      });
    });

  });
});
