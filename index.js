'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const walk = (modulesPath, excludeDir, callback) => {
    fs.readdirSync(modulesPath).forEach( file => {
        const newPath = path.join(modulesPath, file);

        const stat = fs.statSync(newPath);

        if (stat && stat.isFile() && /(.*)\.(js|coffee)$/.test(file))
            return callback(newPath);

        if (stat && stat.isDirectory() && file !== excludeDir)
            return walk(newPath, excludeDir, callback);
    });
};

module.exports = (dir, ctx) => {

    console.log('msg')
    if (!dir) throw new Error('dir is required');

    const services = {};

    const stat = fs.statSync(dir);
    if(!stat.isDirectory()) throw new Error('dir must be a directory');

    ctx.service = name => services[name];

    walk(dir, null, file => {
        const basename = path.basename(file, path.extname(file));
        const m = require(file);
        if (services[name]) throw new Error('model already on stack: ' + name);
        services[name] = value;
        register(basename, m);
    });

    for(let m  in services) {
        const service = services[m];

        if (typeof service === 'function'){
            const match = util.inspect(service).toString().match(/^\[Function: (.*)\]$/);
            if (!match) services[m] = service(ctx);
        }
    }
    return services;
}
