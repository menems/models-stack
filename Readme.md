# services-stack

[![Node.js Version][node-image]][node-url]
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Dependency Status][dep-image]][dep-url]
[![Coverage Status][cov-img]][cov-url]

Stack recursively services file on array.
You can stack `function`, `object` or `class`.

## installation

```
npm install services-stack
```

## Usage

if services file is a `function`, context will be automatically inject.

if services file is a `class` or `object`, you need to pass manualy the context, via `new` for example

`context` is an `object`. It contains a `service()` function. this allow to get services from another service.

```
models/
	contacts.js // object
    other.js // function
	user/user.js // class
    ...
```

```javascript
const context = {
    db : db,
    config : config,
    ...
};

const services = require('services-stack')({
    path : './models'
    context: context
});

const contact = services.get('contacts');
```

Example of a service.

```javascript
module.exports = ctx => {
    const db = ctx.db;
    const contacts = ctx.service('contacts');

    return {
        ...
    }
}
```

[node-image]: https://img.shields.io/node/v/services-stack.svg?style=flat-square
[node-url]: https://nodejs.org
[npm-image]: https://img.shields.io/npm/v/services-stack.svg?style=flat-square
[npm-url]: https://npmjs.org/package/services-stack
[travis-image]: https://img.shields.io/travis/menems/services-stack/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/menems/services-stack
[cov-img]: https://coveralls.io/repos/menems/services-stack/badge.svg?branch=master&service=github
[cov-url]: https://coveralls.io/github/menems/services-stack?branch=master
[dep-image]: http://david-dm.org/menems/services-stack.svg?style=flat-square
[dep-url]:http://david-dm.org/menems/services-stack
