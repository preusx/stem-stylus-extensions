var su = require('stylus/lib/utils.js'),
    n = require('stylus/lib/nodes');

module.exports = {};


var setBlockPosition = module.exports.setBlockPosition = function(block, opts) {
  block.lineno = opts.lineno;
  block.column = opts.column;
  block.filename = opts.filename;

  return block;
};


var groupBlock = module.exports.groupBlock = function(block) {
  var selector = setBlockPosition(new n.Selector([new n.Literal('&')]), block);
  var group = setBlockPosition(new n.Group(), block);
  var bl = setBlockPosition(new n.Block(block.parent, group), block);

  group.push(selector);
  group.block = block;

  bl.nodes = [];
  bl.push(group);

  return bl;
};


/**
 * Get the frame by the variable name that is located there.
 *
 * @param {string} [name]   - Property name that you need.
 * @param {bool} [first]    - Defines wether return the first or the last frame
 *                            with the variable exists.
 * @returns {node}          - Stack frame.
 */
var variableFrameLookup = module.exports.variableFrameLookup = function(name, first) {
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



/**
 * Get the parent frame block.
 *
 * @param {int} [depth]     - Depth of the block.
 * @returns {node}          - Block node or Root if cant get.
 */
var blockFrameLookup = module.exports.blockFrameLookup = function(depth) {
  var i = 0, l = this.stack.length - 1,
      depth = typeof depth == 'undefined' ? true : depth,
      frame;

  if(l < depth) return;

  if(depth === true) {
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
      depth--;
    }
  } while(depth >= 0 && l - i >= 0);

  if(depth <= 0) {
    return this.stack[l - i + 1];
  }
};



/**
 * Recieves property that is located in the current stack.
 *
 * @param {string} [name]   - Property name that you need.
 * @returns {node}          - Property node or null if cant get.
 */
var lookupProperty = module.exports.lookupProperty = function(name){
  try {
    var prop = lkp.call(this, name);
  } catch(e) {}

  if(typeof prop !== 'undefined') {
    return prop;
  } else {
    return 0;
  }

  function lkp(name) {
    var i = this.stack.length,
        index = this.closestBlock.index,
        top = i,
        nodes,
        block,
        len,
        other;

    while (i--) {
      block = this.stack[i].block;
      if (!block.node) continue;
      switch (block.node.nodeName) {
        case 'group':
        case 'function':
        case 'if':
        case 'each':
        case 'atrule':
        case 'media':
        case 'atblock':
        case 'call':
          nodes = block.nodes;
          index = block.index;

          while (index--) {
            // ignore current property
            if (this.property == nodes[index]) continue;
            other = this.interpolate(nodes[index]);
            if (name == other) return nodes[index].clone();
          }

          break;
      }
    }

    return nodes.null;
  }
};



/**
 * Traslates stylus hashes and lists to JS equivalent.
 *
 * @param  {node} node  - Stylus node
 * @return {object}     - JS object
 */
var toJS = module.exports.toJS = function(object) {
  switch(object.nodeName) {
    case 'expression':
      var nodes = [];
      object = su.unwrap(object).nodes;

      for(var i = 0, l = object.length; i < l; i++) {
        nodes.push(toJS(object[i]));
      }
      return nodes.length > 1 ? nodes : nodes[0];
    case 'object':
      var obj = {};

      for(var i in object.vals) {
        obj[i] = toJS(object.vals[i]);
      }

      return obj;
    case 'boolean':
      return object.val;
    case 'string':
    case 'literal':
    case 'indent':
    case 'unit':
    case 'rgba':
    case 'hsla':
      return object;
    case 'null':
      return null;
    default:
      return object;
  }
};


var merge = module.exports.merge = function(a) {
  for(var i = 1, l = arguments.length; i < l; i++) {
    var b = arguments[i];

    if(typeof b.nodeName != 'undefined') {
      a = b;

      continue;
    }

    if((!Array.isArray(b) && typeof b == 'object') &&
       (!Array.isArray(a) && typeof a == 'object')) {
      for(var j in b) {
        a[j] = merge(a[j], b[j]);
      }

      continue;
    }

    a = b;
  }

  return a;
};
