var pcfgTransition = function(symbol) {
  var rules = {'start': {rhs: [['NP', 'V', 'NP'], ['NP', 'V']], probs: [0.4, 0.6]},
               'NP': {rhs: [['A', 'NP'], ['N']], probs: [0.4, 0.6]} }
  return rules[symbol].rhs[ discrete(rules[symbol].probs) ]
}

var preTerminal = function(symbol) {
  return symbol=='N' | symbol=='V' | symbol=='A'
}

var terminal = function(symbol) {
  var rules = {'N': {words: ['John', 'soup'], probs: [0.6, 0.4]},
               'V': {words: ['loves', 'hates', 'runs'], probs: [0.3, 0.3, 0.4]},
               'A': {words: ['tall', 'salty'], probs: [0.6, 0.4]} }
  return rules[symbol].words[ discrete(rules[symbol].probs) ]
}


var pcfg = function(symbol) {
  preTerminal(symbol) ? [terminal(symbol)] : expand(pcfgTransition(symbol))
}

var expand = function(symbols) {
  if(symbols.length==0) {
    return []
  } else {
    var f = pcfg(symbols[0])
    return f.concat(expand(symbols.slice(1)))
  }
}

var model = function(){
  var y = pcfg("start")
  factor(_.isEqual(y.slice(0,2), ["tall", "John"]) ? 0 : -Infinity) // yield starts with "tall John"
  return y[2] ? y[2] : "" // distribution on next word?
}

viz.table(Infer({ model, method: 'enumerate', maxExecutions: 20}))
