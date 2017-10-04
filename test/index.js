/* eslint-disable no-unused-expressions */
const chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    expect = chai.expect,

    params = require('../lib/params'),
    request = require('../lib/request'),
    mainRequestInstance = {mainInstance: true},
    cacheRequestInstance = {cacheInstance: true},
    reqParams = 'ok';

let requestCached,
    checkParamsStub,
    mainStub,
    cacheStub;

chai.use(sinonChai);


describe('Get page', function () {
  before(function () {
    checkParamsStub = sinon.stub(params, 'checkDefaults');
    mainStub = sinon.stub(request, 'getMain');
    cacheStub = sinon.stub(request, 'getCache');

    // In this case should be loaded after setting the stubs
    // It's because 'requestCached' alias all methods when loading
    delete require.cache[require.resolve('../lib')];
    requestCached = require('../lib');
  });

  after(function () {
    checkParamsStub.restore();
    mainStub.restore();
    cacheStub.restore();
  });

  beforeEach(function () {
    checkParamsStub.resetHistory();
    mainStub.reset();
    cacheStub.reset();
  });

  it('should throw error when main params missing', function () {
    expect(function () {
      requestCached();
    }).to.throw('Request param needed');
  });

  it('should check params', function () {
    const getPage = requestCached(mainRequestInstance);
    cacheStub.resolves(true);

    return getPage(reqParams)
      .then(() => {
        expect(checkParamsStub).to.have.been.calledOnce;
        expect(checkParamsStub).to.have.been.calledWithExactly(reqParams);
      });
  });

  it('should use main request instance for cache if not provided', function () {
    const getPage = requestCached(mainRequestInstance);
    cacheStub.resolves(true);

    return getPage(reqParams)
      .then(() => {
        expect(cacheStub).to.have.been.calledOnce;
        expect(cacheStub).to.have.been.calledWithExactly(mainRequestInstance, reqParams);
      });
  });

  it('should use cache request instance for cache if provided', function () {
    const getPage = requestCached(mainRequestInstance, cacheRequestInstance);
    cacheStub.resolves(true);

    return getPage(reqParams)
      .then(() => {
        expect(cacheStub).to.have.been.calledOnce;
        expect(cacheStub).to.have.been.calledWithExactly(cacheRequestInstance, reqParams);
      });
  });

  it('should get data from cache when available', function () {
    const getPage = requestCached(mainRequestInstance, cacheRequestInstance);
    cacheStub.resolves({isCached: true});

    return getPage(reqParams)
      .then((result) => {
        expect(checkParamsStub).to.have.been.calledOnce;
        expect(checkParamsStub).to.have.been.calledWithExactly(reqParams);
        expect(cacheStub).to.have.been.calledOnce;
        expect(cacheStub).to.have.been.calledWithExactly(cacheRequestInstance, reqParams);
        expect(result.isCached).to.be.true;
      });
  });

  it('should get data from main when cache not available', function () {
    const getPage = requestCached(mainRequestInstance, cacheRequestInstance);
    cacheStub.rejects();
    mainStub.resolves({isCached: false});

    return getPage(reqParams)
      .then((result) => {
        expect(checkParamsStub).to.have.been.calledOnce;
        expect(checkParamsStub).to.have.been.calledWithExactly(reqParams);
        expect(cacheStub).to.have.been.calledOnce;
        expect(cacheStub).to.have.been.calledWithExactly(cacheRequestInstance, reqParams);
        expect(mainStub).to.have.been.calledOnce;
        expect(mainStub).to.have.been.calledWithExactly(mainRequestInstance, reqParams);
        expect(result.isCached).to.be.false;
      });
  });
});
