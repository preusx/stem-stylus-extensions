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
  require('../components/AtRuleTypes').atRuleTypes.register('p', function(atrule) {
    var b = this.currentBlock;
    var block = atrule.block.clone();
    var prefixName = this.interpolate(atrule),
        prefix = atrule.segments;
    block.nodes = getProperties(block.nodes);

    var unprefixed = {
      font: [
          'letter-spacing',
          'line-height',
          'direction',
          'color',
        ],
    };

    var shortcuts = {
      'bg': ['background'],
    };

    // Checking if shortcut
    if(typeof shortcuts[prefixName] != 'undefined') {
      prefix = shortcuts[prefixName].map(function(e) {
          return new style.nodes.Literal(e);
        });
      prefixName = this.interpolate({segments:prefix});
    }

    for(var i = 0, l = block.nodes.length; i < l; i++) {
      if(typeof unprefixed[prefixName] != 'undefined') {
        if(unprefixed[prefixName]
            .indexOf(this.interpolate(block.nodes[i])) >= 0) {
          continue;
        }
      }

      if(this.interpolate(block.nodes[i].segments) === 'this') {
        block.nodes[i].segments = prefix;
      } else {
        block.nodes[i].segments = concatenator(prefix,
          block.nodes[i].segments);
      }
    }

    this.mixin(block.nodes, b);

    return style.nodes.null;
  });
};

module.exports = {
  plugin: plugin,
}