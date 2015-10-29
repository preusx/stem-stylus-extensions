var utils = require('stylus/lib/utils.js');

var lookupProperty = function(name){
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

var plugin = function(style){
  style.define('at_property', function(property) {
    utils.assertType(property, 'string', 'property');

    var prop = lookupProperty.call(this, property.string);

    if(typeof prop !== 'undefined') {
      return prop.expr;
    } else {
      return 0;
    }
  });
};

module.exports = {
  plugin: plugin,
  lookupProperty: lookupProperty,
}