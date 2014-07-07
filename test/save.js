var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    expect = chai.expect,
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),

    savePage = require('../lib/save').page,
    errorPath = 'not/a/folder',
    okPath = '/tmp',
    mkdirpStub,
    pathStub,
    fsWriteStub,
    consoleStub;

chai.use(sinonChai);


describe('Save page', function () {
  before(function () {

    function fsMock(path, content, callback) {
      callback(path === errorPath);
    }

    mkdirpStub = sinon.stub(mkdirp, 'sync');
    pathStub = sinon.stub(path, 'dirname');
    fsWriteStub = sinon.stub(fs, 'writeFile', fsMock);
    consoleStub = sinon.stub(console, 'error');
  });

  after(function () {
    mkdirpStub.restore();
    pathStub.restore();
    fsWriteStub.restore();
    consoleStub.restore();
  });

  beforeEach(function () {
    mkdirpStub.reset();
    pathStub.reset();
    fsWriteStub.reset();
    consoleStub.reset();
  });

  it('should not use parseFn when not stated', function () {
    var body = 'text not parsed',
        reqParams = {},
        saveParams = {path: okPath};

    savePage(reqParams, saveParams, body);

    expect(mkdirpStub).to.have.been.calledOnce;
    expect(pathStub).to.have.been.calledOnce;
    expect(fsWriteStub).to.have.been.calledOnce;
    expect(fsWriteStub).to.have.been.calledWith(okPath, body);
    expect(consoleStub).to.have.not.been.called;
  });

  it('should use parseFn when stated in params', function () {
    var body = 'text not parsed',
        bodyParsed = 'text parsed',
        parseFn = sinon.stub().returns(bodyParsed),
        reqParams = {json: true},
        saveParams = {path: okPath, parseFn: parseFn};

    savePage(reqParams, saveParams, body);

    expect(parseFn).to.have.been.calledOnce;
    expect(fsWriteStub).to.have.been.calledOnce;
    expect(fsWriteStub).to.have.been.calledWith(okPath, bodyParsed);
    expect(consoleStub).to.have.not.been.called;
  });

  it('should use default paseJson when data is json', function () {
    var body = {param: 'value'},
        reqParams = {json: true},
        saveParams = {path: okPath};

    savePage(reqParams, saveParams, body);

    expect(fsWriteStub).to.have.been.calledOnce;
    expect(fsWriteStub).to.have.been.calledWith(okPath, JSON.stringify(body));
    expect(consoleStub).to.have.not.been.called;
  });

  it('should show error when not saved to disk', function () {
    var reqParams = {},
        saveParams = {path: errorPath},
        body = 'text not parsed';

    savePage(reqParams, saveParams, body);

    expect(mkdirpStub).to.have.been.calledOnce;
    expect(pathStub).to.have.been.calledOnce;
    expect(consoleStub).to.have.been.calledOnce;
    expect(consoleStub).to.have.been.calledWith(true);
  });
});


