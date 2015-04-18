module.exports = parse

function parse(args, opt) {
  opt = opt||{}
  var match = opt.match
  var matchDepth = opt.depth || 0
  var replace = opt.replace || ''
  var doReplace = Boolean(match)

  var arglist = []

  recurse(args, 0)

  return arglist

  function recurse(args, depth) {
    arglist = arglist || []
    depth = depth || 0

    var level = 0, index
    var args_ = []
    for (var i = 0; i < args.length; i++) {
      if (typeof args[i] === 'string' && /^\[/.test(args[i])) {
        if (level++ === 0) {
          index = i
        }
      }
      if (typeof args[i] === 'string' && /\]$/.test(args[i])) {
        if (--level > 0) continue

        var sub = args.slice(index, i + 1)
        var start = sub[0], end = sub[sub.length-1]
        arglist.push(start)

        if (typeof sub[0] === 'string') {
          sub[0] = sub[0].replace(/^\[/, '')
        }
        if (sub[0] === '') sub.shift()

        var n = sub.length - 1
        if (typeof sub[n] === 'string') {
          sub[n] = sub[n].replace(/\]$/, '')
        }
        if (sub[n] === '') sub.pop()

        args_.push(recurse(sub, depth+1))
        arglist.push(end)
      }
      else if (level === 0)  {
        var next = args[i]
        if (depth === matchDepth && doReplace) {
          if (Array.isArray(match)) { //a key / value pair
            if (match.length !== 2)
              throw new Error('expected pair, instead got multiple matches')
            next = replacePair(args, i, match, replace)
          } else { //test against single arg
            if (match.test(next)) {            
              next = next.replace(match, replace)
            }
          }
        }

        if (next === '')
          continue
        arglist.push(next)
        args_.push(next)
      }
    }
    return args_
  }

  function replacePair(arglist, index, matches) {
    var first = matches[0]
    var second = matches[1]
    //both do not match
    if (index+1 > arglist.length-1)
      return arglist[index]
    //if both match
    if (first.test(arglist[index]) && second.test(arglist[index+1])) {
      var next = arglist[index].replace(first, replace)
      //delete second match
      arglist[index+1] = ''
      return next
    }
    return arglist[index]
  }
}