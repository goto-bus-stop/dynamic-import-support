var test = require('tape')
var dynamicImport = require('../')
var vm = require('vm')

test('import()', function (t) {
  t.plan(1)

  var logs = []
  var src = dynamicImport(`
    var a = import('./fixtures/a')
    a.then(function (exports) {
      console.log(exports)
      done()
    })
    console.log('first')
  `)

  vm.runInNewContext(src, {
    require: require,
    console: { log: log },
    done: done
  })
  function log (message) {
    logs.push(message)
  }
  function done () {
    t.deepEqual(['first', 'second'], logs)
  }
})
