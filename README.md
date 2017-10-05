# dynamic-import-support

enable dynamic imports in node.js

```js
import('./whatever').then(function (exports) {
  console.log(exports)
})
```

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/dynamic-import-support.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/dynamic-import-support
[travis-image]: https://img.shields.io/travis/goto-bus-stop/dynamic-import-support.svg?style=flat-square
[travis-url]: https://travis-ci.org/goto-bus-stop/dynamic-import-support
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

## Install

```
npm install dynamic-import-support
```

## Usage

Use `dynamic-import-support/register` to enable `import()` in all modules loaded after the current one:

```js
require('dynamic-import-support/register')
```

Use `dynamic-import-support` to transform some source code containing `import()` calls:

```js
var dynamicImport = require('dynamic-import-support')

dynamicImport(`
  import('./whatever').then(function (exports) {
    console.log(exports)
  })
`) === `
function _import(p){return Promise.resolve().then(function(){return require(p)})}

  _import('./whatever').then(function (exports) {
    console.log(exports)
  })
`
```

It uses [js-tokens](https://github.com/lydell/js-tokens) instead of a full parser, so it's very quick.
Some patterns aren't supported though.
For example, `import()` inside a template string won't be transformed.
If this is a problem, please open an issue and we'll figure out how to make it work :)

## License

[MIT](LICENSE.md)
