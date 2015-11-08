'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const walk = (modulesPath, excludeDir, callback) => {
    fs.readdirSync(modulesPath).forEach( file => {
        const newPath = path.join(modulesPath, file);

        const stat = fs.statSync(newPath);

        if ( stat && stat.isFile() && /(.*)\.(js|coffee)$/.test(file))
            return callback(newPath);

        if (stat && stat.isDirectory() && file !== excludeDir)
            return walk(newPath, excludeDir, callback);
    });
};

module.exports = (dir, ctx) => {

    if (!dir) throw new Error('dir is required');

    const models = [];

    const stat = fs.statSync(dir);
    if(!stat.isDirectory()) throw new Error('dir must be a directory');

    const register = (name, value) => {
        if (models[name]) throw new Error('model already on stack: ' + name);
        models[name] = value;
    }

    walk(dir, null, file => {
        const basename = path.basename(file, path.extname(file));
        const m = require(file);

        if (typeof m === 'function'){
            // test if function is a class
            const match = util.inspect(m).toString().match(/^\[Function: (.*)\]$/);

            if (!match) register(basename, m(ctx));
            else register(match.slice(1), m);
        }

        if (typeof m === 'object') register(basename, m);

    });
    return models;
}
