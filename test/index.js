'use strict';

const assert = require('assert');

process.env.NODE_ENV = 'test';

const servicesStack = require('..');

const _path = __dirname + '/fixtures';
const _gpath = _path + '/resources';

describe('services-stack', () => {

    it('should throw if resources root path not exist', done => {
        (() => servicesStack('./bad')).should.throw(/ENOENT.*/);
        done();
    });

    it('should throw if resources root is not a directory', done => {
        (() => servicesStack(_path + '/nop.js')).should.throw('_path must be a directory');
        done();
    });

    it('should work', done => {
        const services = servicesStack(_gpath, {test: 'test'});
        services.should.have.property('test');
        services.test.should.have.property('name');
        services.should.have.property('test1');
        services.test1.should.have.property('serv');
        services.should.have.property('Test');
        assert(typeof services.Test === 'function');
        done();
    })

    it('should throw if resources already exists', done => {
        (() => servicesStack(_gpath + '2' )).should.throw('model already on stack: test');
        done();
    });

});
