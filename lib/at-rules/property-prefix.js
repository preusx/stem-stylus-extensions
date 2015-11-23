var utils = require('stylus/lib/utils.js');

var plugin = function(style){
  var concatenator = function(atrule, node) {
    return [].concat(atrule, [new style.nodes.Literal('-')], node);
  };

  var getProperties = function(nodes) {
    return nodes.filter(function(e) {
        return e.nodeName == 'property';
      });
  };

  /**
   * Property prefix.
   */
  style.options.extensions.atRuleType.register('p', function(atrule) {
    var b = this.currentBlock;
    var block = atrule.block.clone();
    var prefixName = this.interpolate(atrule),
        prefix = atrule.segments;
    block.nodes = getProperties(block.nodes);

    for(var i = 0, l = block.nodes.length; i < l; i++) {
      if(this.interpolate(block.nodes[i].segments) === 'this') {
        block.nodes[i].segments = prefix;
      } else {
        block.nodes[i].segments = concatenator(prefix,
          block.nodes[i].segments);
      }

      block.nodes[i] = this.visitProperty(block.nodes[i]);
    }

    this.mixin(block.nodes, b);

    return style.nodes.null;
  });
};

module.exports = {
  plugin: plugin,
};
