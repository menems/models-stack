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

    const addService = (name, value) => {
        if (services[name])
            throw new Error('service already on stack: ' + name);

        services[name] = value;
    }

    walk(options.path, {globs : options.globs}).forEach(s => {
        const abs = path.join(options.path,s);
        const name = path.basename(abs, path.extname(abs));

        const fn = require(abs);

        if (typeof fn === 'function'){
            const match = util.inspect(fn).toString().match(/\[Function: (.*)\]/);
            if (!match)
                addService(name, fn(options.context));
            else {
                addService(match[1],fn);
            }
        } else {
                addService(name, fn);

        }
    })

    return services;
}
