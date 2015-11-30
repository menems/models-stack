/**
 * author : blaz <blaz@menems.net
 */

'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const walk = require('walk-sync');

module.exports = options => {

  if (!options)
    throw new Error('options is required');

  if (typeof options != 'object')
    throw new TypeError('options must be an object');

  if (!options.path)
    throw new Error('options.path is required');

  options.path = path.resolve(options.path);

  const stat = fs.statSync(options.path);

  if (!stat.isDirectory())
    throw new Error('options.path must be a directory');

  options.globs = options.globs || ['**/*.js'];

  const services = {};

  const _cache = {};

  options.context = options.context || {};

  // central function
  const service = options.context.service = name => {
    if (!services[name])
      throw new Error('service ' + name + ' undefined');

    if (_cache[name])
      return _cache[name];

    const fn = services[name];
    if (typeof fn === 'function') {
      const match = util.inspect(fn).toString().match(/\[Function: (.*)\]/);
      if (!match) {
        _cache[name] = fn(options.context);
      } else {
        _cache[name] = fn;
      }
    } else {
      _cache[name] = fn;
    }
    return _cache[name];
  };

  const _addService = (name, value) => {
    if (services[name])
      throw new Error('service already on stack: ' + name);
    services[name] = value;
  };

  walk(options.path, {
    globs: options.globs
  }).forEach(s => {
    const abs = path.join(options.path, s);
    const name = path.basename(abs, path.extname(abs));

    const fn = require(abs);

    if (typeof fn === 'function') {
      const match = util.inspect(fn).toString().match(/\[Function: (.*)\]/);
      if (match)
        _addService(match[1], fn);
      else
        _addService(name, fn);
    } else {
      _addService(name, fn);
    }
  })

  // return service function
  return {
    get: service
  };
}
