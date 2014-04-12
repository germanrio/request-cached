var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    expect = chai.expect,
    params = require('../lib/params'),
    request = require('../lib/request'),

    getPage,
    errorParams = 'not ok',
    okParams = 'ok',
    checkParamsStub,
    mainStub,
    cacheStub;

chai.use(sinonChai);

describe('Get page', function () {
  before(function () {

    function getMock(params, callback) {
      var error = (params === errorParams);
      callback(error, [error]);
    }

    checkParamsStub = sinon.stub(params, 'checkDefaults');
    mainStub = sinon.stub(request, 'main', getMock);
    cacheStub = sinon.stub(request, 'cache', getMock);

    // In this case should be loaded after setting the stubs
    // It's because 'getPage' alias all methods when loading
    delete require.cache[require.resolve('../lib')];
    getPage = require('../lib').getPage;
  });

  after(function () {
    checkParamsStub.restore();
    mainStub.restore();
    cacheStub.restore();
  });

  beforeEach(function () {
    checkParamsStub.reset();
    mainStub.reset();
    cacheStub.reset();
  });

  it('should check params', function (done) {
    getPage(okParams, function () {
      expect(checkParamsStub).to.have.been.calledOnce;
      done();
    });
  });

  it('should get data from cache when available', function (done) {
    getPage(okParams, function (err, isCached) {
      expect(checkParamsStub).to.have.been.calledOnce;
      expect(cacheStub).to.have.been.calledOnce;
      expect(isCached).to.be.true;
      done();
    });
  });

  it('should get data from main when cache not available', function (done) {
    getPage(errorParams, function (err, isCached) {
      expect(checkParamsStub).to.have.been.calledOnce;
      expect(cacheStub).to.have.been.calledOnce;
      expect(mainStub).to.have.been.calledOnce;
      expect(isCached).to.be.false;
      done();
    });
  });

});
