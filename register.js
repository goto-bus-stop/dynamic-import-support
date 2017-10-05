var pirates = require('pirates')
var dynamicImport = require('./')

exports.remove = pirates.addHook(function (code) {
  return dynamicImport(code)
}, {})
