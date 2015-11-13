/**
 * Check current property existance.
 *
 * @param {string} [property] - Property that you need.
 * @returns {bool}
 */

module.exports = function atCurrentExists(property) {
  return this.closestBlock.nodes.some(function(node) {
    if(node.nodeName == 'property') {
      return node.segments[0].name == property.string;
    }

    return false;
  });
};
