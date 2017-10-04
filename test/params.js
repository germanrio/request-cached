/* eslint-disable no-unused-expressions */
const {expect} = require('chai'),
    {checkDefaults} = require('../lib/params');


describe('Check default params', function () {
  it('should throw error when params missing', function () {
    expect(function () {
      checkDefaults();
    }).to.throw('Params');
  });

  it('should throw error when main params missing', function () {
    expect(function () {
      checkDefaults({});
    }).to.throw('Main params');

    expect(function () {
      checkDefaults({cache: {}});
    }).to.throw('Main params');
  });

  it('should add customErrorFn if missing', function () {
    const params = {main: {uri: 'http'}};
    expect(function () {
      checkDefaults(params);
    }).to.not.throw('Uri or url');

    expect(params.request.customErrorFn).to.be.a('function');
    expect(params.request.customErrorFn(true)).to.be.true;
    expect(params.request.customErrorFn(false, {statusCode: 400})).to.be.true;
    expect(params.request.customErrorFn(false, {statusCode: 200})).to.be.true;
    expect(params.request.customErrorFn(false, {statusCode: 200}, '')).to.be.true;
    expect(params.request.customErrorFn(false, {statusCode: 200}, 'body')).to.be.false;
  });

  it('should throw error when uri is missing', function () {
    expect(function () {
      checkDefaults({main: {}});
    }).to.throw('Uri or url');

    expect(function () {
      checkDefaults({main: {}, cache: {}});
    }).to.throw('Uri or url');

    expect(function () {
      checkDefaults({main: {uri: ''}});
    }).to.throw('Uri or url');

    expect(function () {
      checkDefaults({main: {uri: 'http'}});
    }).to.not.throw('Uri or url');

    expect(function () {
      checkDefaults({main: {url: 'http'}});
    }).to.not.throw('Uri or url');

    expect(function () {
      checkDefaults({main: {url: 'http'}, cache: {}});
    }).to.throw('Uri or url');

    expect(function () {
      checkDefaults({main: {url: 'http'}, cache: {uri: ''}});
    }).to.throw('Uri or url');

    expect(function () {
      checkDefaults({main: {url: 'http'}, cache: {uri: 'http'}});
    }).to.not.throw('Uri or url');

    expect(function () {
      checkDefaults({main: {url: 'http'}, cache: {url: 'http'}});
    }).to.not.throw('Uri or url');
  });

  it('should throw exception when save path is missing', function () {
    expect(function () {
      checkDefaults({
        main: {url: 'http'},
        save: {}
      });
    }).to.throw('Save path');

    expect(function () {
      checkDefaults({
        main: {url: 'http'},
        save: {path: ''}
      });
    }).to.throw('Save path');

    expect(function () {
      checkDefaults({
        main: {url: 'http'},
        save: {path: '/tmp'}
      });
    }).to.not.throw('Save path');
  });
});
