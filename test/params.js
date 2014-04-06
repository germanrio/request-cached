var expect = require('chai').expect,
    checkDefaults = require('../lib/params').checkDefaults;

describe('Check default params', function () {
  it('should throw error when params missing', function () {
    expect(function () {
        checkDefaults();
    }).to.throw('Params');
  });


  it('should throw error when uri is missing', function () {
    expect(function () {
        checkDefaults({});
    }).to.throw('Uri or url');

    expect(function () {
        checkDefaults({main: {}});
    }).to.throw('Uri or url');

    expect(function () {
        checkDefaults({cache: {}});
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


