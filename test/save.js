/* eslint-disable no-unused-expressions */
const chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    expect = chai.expect,
    fs = require('fs'),
    path = require('path'),

    {savePage} = require('../lib/save'),
    savePath = '/tmp';

let mkdirpStub,
    pathStub,
    fsWriteStub;

chai.use(sinonChai);


describe('Save page', function () {
  before(function () {
    require('mkdirp');
    mkdirpStub = sinon.stub(require.cache[require.resolve('mkdirp')], 'exports');
    pathStub = sinon.stub(path, 'dirname');
    fsWriteStub = sinon.stub(fs, 'writeFile');
  });

  after(function () {
    mkdirpStub.restore();
    pathStub.restore();
    fsWriteStub.restore();
  });

  beforeEach(function () {
    mkdirpStub.reset();
    pathStub.reset();
    fsWriteStub.reset();
  });

  it('should not use parseFn when not stated', function () {
    const reqParams = {},
        saveParams = {path: savePath},
        body = 'text not parsed';

    mkdirpStub.yields(null);
    fsWriteStub.yields(null);
    return savePage(reqParams, saveParams, body)
      .then(() => {
        expect(mkdirpStub).to.have.been.calledOnce;
        expect(pathStub).to.have.been.calledOnce;
        expect(fsWriteStub).to.have.been.calledOnce;
        expect(fsWriteStub).to.have.been.calledWith(savePath, body);
      });
  });

  it('should use parseFn when stated in params', function () {
    const body = 'text not parsed',
        bodyParsed = 'text parsed',
        parseFn = sinon.stub().returns(bodyParsed),
        reqParams = {json: true},
        saveParams = {path: savePath, parseFn: parseFn};

    mkdirpStub.yields(null);
    fsWriteStub.yields(null);
    return savePage(reqParams, saveParams, body)
      .then(() => {
        expect(parseFn).to.have.been.calledOnce;
        expect(mkdirpStub).to.have.been.calledOnce;
        expect(pathStub).to.have.been.calledOnce;
        expect(fsWriteStub).to.have.been.calledOnce;
        expect(fsWriteStub).to.have.been.calledWith(savePath, bodyParsed);
      });
  });

  it('should use default paseJson when data is json', function () {
    const body = {param: 'value'},
        reqParams = {json: true},
        saveParams = {path: savePath};

    mkdirpStub.yields(null);
    fsWriteStub.yields(null);
    return savePage(reqParams, saveParams, body)
      .then(() => {
        expect(mkdirpStub).to.have.been.calledOnce;
        expect(pathStub).to.have.been.calledOnce;
        expect(fsWriteStub).to.have.been.calledOnce;
        expect(fsWriteStub).to.have.been.calledWith(savePath, JSON.stringify(body));
      });
  });

  it('should reject when error creating folder', function () {
    const body = 'text not parsed',
        reqParams = {},
        saveParams = {path: savePath};

    mkdirpStub.yields(true);
    fsWriteStub.yields(null);
    return savePage(reqParams, saveParams, body)
      .then(() => expect.fail(), (error) => {
        expect(mkdirpStub).to.have.been.calledOnce;
        expect(pathStub).to.have.been.calledOnce;
        expect(fsWriteStub).to.have.not.been.called;
        expect(error).to.be.true;
      });
  });

  it('should reject when error saving to disk', function () {
    const body = 'text not parsed',
        reqParams = {},
        saveParams = {path: savePath};

    mkdirpStub.yields(null);
    fsWriteStub.yields(true);
    return savePage(reqParams, saveParams, body)
      .then(() => expect.fail(), (error) => {
        expect(mkdirpStub).to.have.been.calledOnce;
        expect(pathStub).to.have.been.calledOnce;
        expect(fsWriteStub).to.have.been.calledOnce;
        expect(fsWriteStub).to.have.been.calledWith(savePath, body);
        expect(error).to.be.true;
      });
  });
});
