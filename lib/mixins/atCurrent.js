var plugin = function(style){
  /**
   * Check current property existance.
   *
   * @param {string} [property] - Property that you need.
   * @returns {bool}
   */
  var atCurrentExists = function(property) {
    return this.nodes.some(function(node) {
      if(node.nodeName == 'property') {
        return node.segments[0].name == property.string;
      }

      return false;
    });
  };

  style.define('at_current_exists', function(property) {
    return atCurrentExists.call(this.closestBlock, property);
  });


  /**
   * Current at(@) rule.
   *
   * Recieves property value from current node block.
   *
   * @param {string} [property] - Property that you need.
   * @returns {mixed} - Value of property or null if cant get.
   */
  var atCurrent = function(property) {
    var nodes = this.nodes, node, i, l;

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

  style.define('at_current', function(property) {
    return atCurrent.call(this.closestBlock, property);
  });
};

module.exports = {
  plugin: plugin,
}