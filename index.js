'use strict';

const fs = require('fs');
const path = require('path');

module.exports = (dir, db) => {

    if (!dir)
        throw new Error('dir is required');

    const models = [];

    const stat = fs.statSync(dir);
    if(!stat.isDirectory())
        throw new Error('dir has to be a directory');

    fs.readdirSync(dir).filter(p => path.extname(p) === '.js').forEach(p => {
        const basename = path.basename(p,'.js');
        models[basename] =  require(path.join(dir, basename))(db);
    });

    return models;
}
