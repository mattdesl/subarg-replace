# subarg-replace

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

Regex replace on [subarg](https://www.npmjs.com/package/subarg) list.

For example, given the following command:

```sh
node test.js --foo --debug -t [ plugin --debug ]
```

We can replace only the top-level `--debug` like so:

```js
var args = parse(process.argv.slice(2), {
  match: /--debug/,
  replace: '--no-debug'
})

var argv = require('subarg')(args)
argv.debug === false
argv.plugin.debug === true
```

If the result is an empty string, the argument is skipped.

## Usage

[![NPM](https://nodei.co/npm/subarg-replace.png)](https://www.npmjs.com/package/subarg-replace)

#### `args = parse(args, opt)`

In an arg list, replaces flags with given options:

- `match` the regex to match, or a pair of regexes to match a flags like `[ '--debug', 'eval' ]` 
- `replace` the value to replace the argument(s) with
- `depth` the depth at which this replacement should occur, default 0

If a pair is given and a match is found, the pair is replaced by the single `replace` string.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/subarg-replace/blob/master/LICENSE.md) for details.
