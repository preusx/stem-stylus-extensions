/**
 * Current at(@) rule.
 *
 * Recieves property value from current node block.
 *
 * @param {string} [property] - Property that you need.
 * @returns {mixed} - Value of property or null if cant get.
 */

module.exports = function atCurrent(property) {
  var nodes = this.closestBlock.nodes, node, i, l;

  if(typeof property !== 'undefined') {
    for(i = 0, l = nodes.length, node = nodes[i]; i < l; i++) {
      if(node.nodeName == 'property') {
        if(node.segments[0].name == property.string) {
          return node.expr;
        }
      }
    }
  }

  return null;
};
