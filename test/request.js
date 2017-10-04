/* eslint-disable no-unused-expressions */
const chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    expect = chai.expect,
    {getMain, getCache} = require('../lib/request'),
    save = require('../lib/save');

let reqResponse,
    requestSpy,
    saveStub;

chai.use(sinonChai);


describe('Request', function () {
  before(function () {
    requestSpy = sinon.spy((params, callback) => callback.apply(null, reqResponse));
    saveStub = sinon.stub(save, 'savePage').resolves(true);
  });

  after(function () {
    saveStub.restore();
  });

  beforeEach(function () {
    requestSpy.reset();
    saveStub.resetHistory();
  });

  describe('getCache', function () {
    it('should throw error when no cache params', function () {
      expect(function () {
        getCache(requestSpy, {});
      }).to.throw('No cache');

      expect(requestSpy).to.have.not.been.called;
    });

    it('should return data when params ok', function () {
      const response = {statusCode: 200},
          body = 'text';

      let params = {
        cache: {uri: true},
        request: {
          customErrorFn: () => false
        }
      };

      reqResponse = [false, response, body];

      return getCache(requestSpy, params)
        .then((result) => {
          expect(requestSpy).to.have.been.calledOnce;
          expect(result).to.be.eql({
            response,
            body
          });
        });
    });

    it('should reject when customErrorFn fails', function () {
      let params = {
        cache: {uri: true},
        request: {
          customErrorFn: () => true
        }
      };

      reqResponse = [false, {statusCode: 200}, 'text'];

      return getCache(requestSpy, params)
        .then(() => expect.fail(),
          (error) => {
            expect(requestSpy).to.have.been.calledOnce;
            expect(error).to.be.ok;
          });
    });
  });

  describe('getMain', function () {
    it('should not save when no save params', function () {
      const response = {statusCode: 200},
          body = 'text';

      let params = {
        main: {uri: true},
        request: {
          customErrorFn: () => false
        }
      };

      reqResponse = [false, response, body];

      return getMain(requestSpy, params)
        .then((result) => {
          expect(requestSpy).to.have.been.calledOnce;
          expect(saveStub).to.have.not.been.called;
          expect(result).to.be.eql({
            response,
            body
          });
        });
    });

    it('should save data when params ok', function () {
      const response = {statusCode: 200},
          body = 'text';

      let params = {
        main: {uri: true},
        save: {path: true},
        request: {
          customErrorFn: () => false
        }
      };

      reqResponse = [false, response, body];
      return getMain(requestSpy, params)
        .then((result) => {
          expect(requestSpy).to.have.been.calledOnce;
          expect(saveStub).to.have.been.calledOnce;
          expect(result).to.be.eql({
            response,
            body
          });
        });
    });

    it('should reject when customErrorFn fails', function () {
      let params = {
        main: {uri: true},
        save: {path: true},
        request: {
          customErrorFn: () => true
        }
      };

      reqResponse = [false, {statusCode: 200}, 'text'];

      return getMain(requestSpy, params)
        .then(() => expect.fail(),
          (error) => {
            expect(requestSpy).to.have.been.calledOnce;
            expect(saveStub).to.have.not.been.called;
            expect(error).to.be.ok;
          });
    });
  });
});
