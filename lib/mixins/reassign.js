/**
 * Reassign
 * ======================================================================== */
var utils = require('stylus/lib/utils.js');

var variableFrameLookup = function(name, first) {
  var i = this.stack.length - 1,
      frame = this.stack[i],
      first = typeof first == 'undefined' ? true : false,
      find = i,
      val;

  do {
    frame = this.stack[i];

    if (frame && (val = frame.lookup(name))) {
      find = i;
      if(first) break;
    }
  } while(i--);

  return this.stack[find];
};

var blockFrameLookup = function(paternity) {
  var i = 0, l = this.stack.length - 1,
      paternity = typeof paternity == 'undefined' ? true : paternity,
      frame;

  if(l < paternity) return;

  if(paternity === true) {
    do {
      frame = this.stack[l];

      if(frame.block.nodeName == 'root') return frame;

      if (frame.block.node && (frame.block.node.nodeName == 'group')) {
        return frame;
      }
    } while(l--);
  }

  do {
    frame = this.stack[l - i];
    i++;

    if(frame.block.node) {
      paternity--;
    }
  } while(paternity >= 0 && l - i >= 0);

  if(paternity <= 0) {
    return this.stack[l - i + 1];
  }
}


var plugin = function(style) {
  var reassign, assign, lookup;

  (reassign = function(name, expr) {
    name = utils.unwrap(name).first;
    expr = utils.unwrap(expr);
    utils.assertType(name, 'string', 'name');
    var scope = variableFrameLookup.call(this, name.val, false).scope;

    if(!scope) {
      throw new Error('There is no variable called: "' + name.val + '"');
    }

    if(expr.nodes.length == 1) {
      expr = expr.first;
    }

    var node = new style.nodes.Ident(name.val, expr);
    scope.add(node);

    return style.nodes.null;
  }).raw = true;

  style.define('reassign', reassign);

  (assign = function(name, expr, paternity) {
    name = utils.unwrap(name).first;
    expr = utils.unwrap(expr);
    paternity = utils.unwrap(paternity).first;
    utils.assertType(name, 'string', 'name');
    var i = this.stack.length - 1
        paternity = typeof paternity == 'undefined' ? true : paternity.val,
        frame = blockFrameLookup.call(this, paternity);

    if(!frame) {
      throw new Error('The value(' + paternity + ') of the paterninty is too big!');
    }

    var scope = frame.scope;

    if(expr.nodes.length == 1) {
      expr = expr.first;
    }

    var node = new style.nodes.Ident(name.val, expr);
    scope.add(node);

    return style.nodes.null;
  }).raw = true;

  style.define('assign', assign);

  (lookup = function(name) {
    name = utils.unwrap(name).first;
    utils.assertType(name, 'string', 'name');
    var scope = variableFrameLookup.call(this, name.val).scope;

    return scope.lookup(name.val);
  }).raw = true;

  style.define('lookup', lookup);
  style.define('var', lookup);
};


module.exports = {
  plugin: plugin,
  variableFrameLookup: variableFrameLookup,
  blockFrameLookup: blockFrameLookup,
}