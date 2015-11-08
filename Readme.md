# models-stack

[![Node.js Version][node-image]][node-url]
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Dependency Status][dep-image]][dep-url]
[![Coverage Status][cov-img]][cov-url]

Stack recursively model file on array.
You can stack `function`, `object` or `class`.

## installation

```
npm install model-stack
```

## Usage

if model file is a `function`, context will be automatically inject.

if model file is a `class` or `object`, you need to pass manualy the context, via `new` for example

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

const stack = require('model-stack')('./models', context);
//[
//  contacts : { method : ...},
//  other : [Function],
//  User : [Function: User]
//]
```


[node-image]: https://img.shields.io/node/v/models-stack.svg?style=flat-square
[node-url]: https://nodejs.org
[npm-image]: https://img.shields.io/npm/v/models-stack.svg?style=flat-square
[npm-url]: https://npmjs.org/package/models-stack
[travis-image]: https://img.shields.io/travis/menems/models-stack/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/menems/models-stack
[cov-img]: https://coveralls.io/repos/menems/models-stack/badge.svg?branch=master&service=github
[cov-url]: https://coveralls.io/github/menems/models-stack?branch=master
[dep-image]: http://david-dm.org/menems/models-stack.svg?style=flat-square
[dep-url]:http://david-dm.org/menems/models-stack
