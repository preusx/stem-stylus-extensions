var su = require('stylus/lib/utils.js'),
  n = require('stylus/lib/nodes'),
  u = require('../common/utils.js');


module.exports = {};


(module.exports.type = function type(expr) {
  expr = su.unwrap(expr);

  if(expr.nodes.length > 1) return 'list';
  if(typeof expr.first.vals == 'object') return 'hash';

  return expr.first.nodeName;
}).raw = true;



var nodeTypes = [
    'string',
    'list',
    'hash',
    'ident',
    'literal',
    'block',
    'function',
    'boolean',
    'rgba',
    'null',
    'unit',
    'hsla',
  ];

for(var i = nodeTypes.length - 1; i >= 0; i--) {
  module.exports['is-' + nodeTypes[i]] = (function(nodeType) {
    var fnc;

    (fnc = function(expr) {
      if(type(expr) == nodeType) return true;
    }).raw = true;

    return fnc;
  })(nodeTypes[i]));
}


(module.exports['is-color'] = function(expr) {
  var tp = type(expr);

  if(tp == 'rgba' || tp == 'hsla') return true;
}).raw = true;