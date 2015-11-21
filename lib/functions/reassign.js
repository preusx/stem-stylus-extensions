var su = require('stylus/lib/utils.js'),
    n = require('stylus/lib/nodes'),
    u = require('../common/utils.js');


(module.exports = function reassign(name, expr) {
  name = su.unwrap(name).first;
  expr = su.unwrap(expr);
  su.assertType(name, 'string', 'name');
  var scope = u.variableFrameLookup.call(this, name.val, false).scope;

  if(!scope) {
    throw new Error('There is no variable called: "' + name.val + '"');
  }

  if(expr.nodes.length == 1) {
    expr = expr.first;
  }

  var node = new n.Ident(name.val, expr);
  scope.add(node);

  return n.null;
}).raw = true;
