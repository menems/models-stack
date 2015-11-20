'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const walk = require('walk-sync');

module.exports = options => {

    if (!options)
        throw new Error('options is required');

    if (typeof options != 'object')
        throw new TypeError('options must be an object')

    if (!options.path)
        throw new Error('options.path is required');

    options.path = path.resolve(options.path);

    const stat = fs.statSync(options.path);

    if(!stat.isDirectory())
        throw new Error('options.path must be a directory');

    options.globs = options.globs || ['**/*.js'];

    const services = {};

    options.context = options.context || {};

    options.context.service = name => services[name];

    walk(options.path, {globs : options.globs}).forEach(s => {
        const abs = path.join(options.path,s);
        const name = path.basename(abs, path.extname(abs));
        if (services[name])
            throw new Error('model already on stack: ' + name);
        services[name] = require(abs);
    })

    for(let m  in services) {
        const service = services[m];

        if (typeof service === 'function'){
            const match = util.inspect(service).toString().match(/^\[Function: (.*)\]$/);
            if (!match) services[m] = service(options.context);
        }
    }
    return services;
}
