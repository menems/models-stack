'use strict';

const assert = require('assert');

process.env.NODE_ENV = 'test';

const servicesStack = require('..');

const _path = __dirname + '/fixtures';
const _gpath = _path + '/resources';

describe('services-stack', () => {

    it('should throw if options is undefined', done => {
        (() => servicesStack()).should.throw('options is required');
        done();
    });

    it('should throw if options is not an object', done => {
        (() => servicesStack(true)).should.throw('options must be an object');
        done();
    });

    it('should throw if options.path is undefined', done => {
        (() => servicesStack({})).should.throw('options.path is required');
        done();
    });


    it('should throw if resources  path not exist', done => {
        (() => servicesStack({path : './bad'})).should.throw(/ENOENT.*/);
        done();
    });

    it('should throw if resources root is not a directory', done => {
        (() => servicesStack({path : _path + '/nop.js'})).should.throw('options.path must be a directory');
        done();
    });

    it('should work', done => {
        const services = servicesStack({
            path: _gpath,
            context: {test: 'test'}
        });

        services.should.have.property('test');
        services.test.should.have.property('name');
        services.should.have.property('test1');
        services.test1.should.have.property('serv');
        services.should.have.property('Test');
        assert(typeof services.Test === 'function');
        done();
    })

    it('should throw if resources already exists', done => {
        (() => servicesStack({path: _gpath + '2'})).should.throw('service already on stack: test');
        done();
    });

});
