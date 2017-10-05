var tokensRx = require('js-tokens').default

module.exports = function (src) {
  if (!/import/.test(src)) {
    return src
  }

  var replacements = gatherImportCalls(src)
  if (replacements.length === 0) {
    return src
  }

  var helper = getHelperName(src)
  var offset = helper.length - 'import'.length
  var result = ''
  var prev = 0
  for (var i = 0; i < replacements.length; i++) {
    var start = replacements[i] + offset * i
    var end = start + 'import'.length
    result += src.slice(prev, start) + helper
    prev = end
  }
  result += src.slice(prev)

  return 'function ' + helper + '(p){return Promise.resolve().then(function(){return require(p)})}\n' + result
}

function gatherImportCalls (src) {
  var tokens = src.match(tokensRx)
  var importToken = -1
  var calls = []
  var pos = 0
  for (var i = 0; i < tokens.length; i++) {
    pos += tokens[i].length
    if (tokens[i] === 'import') {
      importToken = pos - tokens[i].length
      continue
    } else if (tokens[i] === '(') {
      if (importToken !== -1) {
        calls.push(importToken)
        importToken = -1
      }
      continue
    }
    if (isComment(tokens[i]) || isWhitespace(tokens[i])) {
      continue
    }
    importToken = -1
  }

  return calls
}

function isComment (str) {
  return str[0] === '/' && (str[1] === '*' || str[1] === '/')
}
function isWhitespace (str) {
  return /^\s+$/.test(str)
}

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
