var test = require('tape')
var parse = require('./')

var argv = [ 
  '-t', '--debug=true',
  '[', 'p', '--foo', ']',
  '--debug', '-p',
  '[', 'something', '--debug', ']',
  '-r',
  '[', 
    'foo', '-r', '[',
      '--debug',
    ']',
  ']' 
]

test('should replace with regex at depth 0', function(t) {
  var result = parse(argv, {
    match: /--debug(=true)?/,
    replace: '--foobar$1',
  })
  t.deepEqual(result, [ '-t', '--foobar=true', '[', 'p', '--foo', ']', '--foobar', '-p', '[', 'something', '--debug', ']', '-r', '[', 'foo', '-r', '[', '--debug', ']', ']' ])
  t.end()
})

test('should replace with regex at depth 0', function(t) {
  var result = parse([ '-t', '--debug', 'eval', '--debug', '--debug=true', '--d=true', '-d=true' ], {
    match: /(--debug(=.*)?)|(-(-)?d(=.*)?)/,
    replace: '--no-debug',
  })
  t.deepEqual(result, [ '-t', '--no-debug', 'eval', '--no-debug', '--no-debug', '--no-debug', '--no-debug' ])
  t.end()
})

test('should replace paired argument', function(t) {
  var result = parse([ '-t', '--debug', 'eval', '--debug', '--debug=true', '--d=true', '-d=true' ], {
    match: [ /--debug/, /^(true|false|eval)$/ ],
    replace: '--no-debug',
  })
  t.deepEqual(result, [ '-t', '--no-debug', '--debug', '--debug=true', '--d=true', '-d=true' ])
  t.end()
})

test('should clear only depth 1', function(t) {
  var arglist = [ '-t', '-p', '[', '--debug', ']', '--debug' ]
  var result = parse(arglist, {
    match: /--debug/,
    depth: 1,
    replace: '--no-debug'
  })
  t.deepEqual(result, [ '-t', '-p', '[', '--no-debug', ']', '--debug' ])
  t.end()
})

test('should clear paired argument', function(t) {
  var arglist = [ '-t', '-p', '[', '--debug', ']',
    '--d', 'true',
    '--debug', 'true', '--debug=eval', '--debug', '--debug=true', '--d=true', '-d=true' ]

  //first pass, remove pairs
  var result = parse(arglist, {
    match: [ /--d(ebug)?/, /^(true|false)$/ ],
    replace: '',
  })

  //second pass, remove singles
  result = parse(result, {
    match: /(--debug(=.*)?)|(-(-)?d(=.*)?)/,
    replace: '',
  })

  //add flag
  result.push('--debug')
  t.deepEqual(result, [ '-t', '-p', '[', '--debug', ']', '--debug' ])
  t.end()
})