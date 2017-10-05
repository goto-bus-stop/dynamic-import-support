var transform = require('transform-ast')
var babylon = require('babylon')

var importrx = /import/

function getHelperName (src) {
  var name = '_import'
  if (src.indexOf(name) === -1) {
    return name
  }
  for (var i = 0; true; i++) {
    if (src.indexOf(name + i) === -1) {
      return name + i
    }
  }
}

module.exports = function dynamicImport (src) {
  if (!importrx.test(src)) {
    return src
  }

  var nodes = []
  var result = transform(src, {
    parser: babylon,
    ecmaVersion: 9,
    allowImportExportEverywhere: true,
    plugins: ['dynamicImport']
  }, function (node) {
    if (node.type === 'Import') {
      nodes.push(node)
    }
  })

  if (nodes.length === 0) {
    return src
  }

  var helper = getHelperName(src)
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].edit.update(helper)
  }

  return 'function ' + helper + '(p){return Promise.resolve().then(function(){return require(p)})}\n' + result
}
