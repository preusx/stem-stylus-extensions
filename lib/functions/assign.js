var su = require('stylus/lib/utils.js'),
    n = require('stylus/lib/nodes'),
    u = require('../common/utils.js');



(module.exports = function assign(name, expr, depth) {
  name = su.unwrap(name).first;
  expr = su.unwrap(expr);
  paternity = su.unwrap(paternity).first;
  su.assertType(name, 'string', 'name');
  var i = this.stack.length - 1
      paternity = typeof paternity == 'undefined' ? true : paternity.val,
      frame = u.blockFrameLookup.call(this, paternity);

  if(!frame) {
    throw new Error('The value(' + paternity + ') of the depth is too big!');
  }

  var scope = frame.scope;

  if(expr.nodes.length == 1) {
    expr = expr.first;
  }

  var node = new n.Ident(name.val, expr);
  scope.add(node);

  return n.null;
}).raw = true;
