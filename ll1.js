// FIRST AND FOLLOW SET TEXT FILE GENERATOR
// AUTHOR: Vijay
// DATE: April 24, 2017

var EPSILON = "ε";
var firstSets = {};
var followSets = {};

function buildFirstSets(grammar) {
  firstSets = {};
  buildSet(firstOf);
}

function firstOf(symbol) {
  if (firstSets[symbol]) {
    return firstSets[symbol];
  }
  var first = firstSets[symbol] = {};

  if (isTerminal(symbol)) {
    first[symbol] = true;
    return firstSets[symbol];
  }

  var productionsForSymbol = getProductionsForSymbol(symbol);
  for (var k in productionsForSymbol) {
    var production = getRHS(productionsForSymbol[k]);

    for (var i = 0; i < production.length; i++) {
      var productionSymbol = production[i];
      if (productionSymbol === EPSILON) {
        first[EPSILON] = true;
        break;
      }
      var firstOfNonTerminal = firstOf(productionSymbol);
      if (!firstOfNonTerminal[EPSILON]) {
        merge(first, firstOfNonTerminal);
        break;
      }
      merge(first, firstOfNonTerminal, [EPSILON]);
    }
  }

  return first;
}

function getProductionsForSymbol(symbol) {
  var productionsForSymbol = {};
  for (var k in grammar) {
    if (grammar[k][0] === symbol) {
      productionsForSymbol[k] = grammar[k];
    }
  }
  return productionsForSymbol;
}

function getLHS(production){
  return production.split('->')[0].replace(/\s+/g, '');
}

function getRHS(production) {
  return production.split('->')[1].replace(/\s+/g, '');
}

function buildFollowSets(grammar) {
  followSets = {};
  buildSet(followOf);
}

function followOf(symbol) {

  if (followSets[symbol]) {
    return followSets[symbol];
  }

  var follow = followSets[symbol] = {};

  if (symbol === START_SYMBOL) {
    follow['$'] = true;
  }

  var productionsWithSymbol = getProductionsWithSymbol(symbol);
  for (var k in productionsWithSymbol) {
    var production = productionsWithSymbol[k];
    var RHS = getRHS(production);

    // Get the follow symbol of our symbol.
    var symbolIndex = RHS.indexOf(symbol);
    var followIndex = symbolIndex + 1;

    while (true) {

      if (followIndex === RHS.length) {
        var LHS = getLHS(production);
        if (LHS !== symbol) {
          merge(follow, followOf(LHS));
        }
        break;
      }

      var followSymbol = RHS[followIndex];
      var firstOfFollow = firstOf(followSymbol);
      if (!firstOfFollow[EPSILON]) {
        merge(follow, firstOfFollow);
        break;
      }

      merge(follow, firstOfFollow, [EPSILON]);
      followIndex++;
    }
  }
  return follow;
}

function buildSet(builder) {
  for (var k in grammar) {
    builder(grammar[k][0]);
  }
}

function getProductionsWithSymbol(symbol) {
  var productionsWithSymbol = {};
  for (var k in grammar) {
    var production = grammar[k];
    var RHS = getRHS(production);
    if (RHS.indexOf(symbol) !== -1) {
      productionsWithSymbol[k] = production;
    }
  }
  return productionsWithSymbol;
}

function isTerminal(symbol) {
  return !/[A-Z]/.test(symbol);
}

function merge(to, from, exclude) {
  exclude || (exclude = []);
  for (var k in from) {
    if (exclude.indexOf(k) === -1) {
      to[k] = from[k];
    }
  }
}

function printGrammar(grammar) {
  console.log('Grammar:\n');
  for (var k in grammar) {
    console.log('  ', grammar[k]);
  }
  console.log('');
}

function writeFirst(set) {
  var fs = require('fs')
  var ft = require('fs')
  //console.log(name + ': \n');
  for (var k in set) {
    fs.appendFile('firstLeft.txt',k+" "+ Object.keys(set[k])+"\n")
    //ft.appendFile('firstRight.txt',Object.keys(set[k])+"\n")
  }
}

function writeFollow(set) {
  var qs = require('fs')
  var qt = require('fs')
  for (var k in set) {
    qs.appendFile('followLeft.txt',k+" " +Object.keys(set[k])+"\n")
    //qt.appendFile('followRight.txt',Object.keys(set[k])+"\n")
  }
}

// Test case 1
//Example Strings: a$, or (a + a)$...
var grammar = {
  1: 'S -> F',
  2: 'S -> (S + F)',
  3: 'F -> a',
};
var START_SYMBOL = 'S';


// Test Case 2
// Example Strings: (a + a) * a $
// var grammar = {
//   1: 'E -> TX',
//   2: 'X -> +TX',
//   3: 'X -> ε',
//   4: 'T -> FY',
//   5: 'Y -> *FY',
//   6: 'Y -> ε',
//   7: 'F -> a',
//   8: 'F -> (E)',
// };
// var START_SYMBOL = 'E';

//Test Case 3
//Example String: int*int$
// var grammar = {
//   1: 'E -> TX',
//   2: 'X -> +E',
//   3: 'X -> ε',
//   4: 'T -> (E)',
//   5: 'T -> iY',
//   6: 'Y -> *T',
//   7: 'Y -> ε',
// };
// var START_SYMBOL = 'E';

//Test Case 4
// Example String: abba$, baab$
// var grammar = {
//   1: 'S -> XY',
//   2: 'S -> YX',
//   2: 'X -> ab', 
//   3: 'Y -> ba',
// }

var START_SYMBOL = 'S';
buildFirstSets(grammar);
writeFirst(firstSets);
buildFollowSets(grammar);
writeFollow(followSets);
console.log('File Generated');

