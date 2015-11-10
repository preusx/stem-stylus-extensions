var plugin = function(style){
  var concatenator = function(atrule, node) {
    return [].concat(atrule, [new style.nodes.Literal('-')], node);
  };

  var getProperties = function(nodes) {
    return nodes.filter(function(e) {
        return e.nodeName == 'property';
      });
  };

  var BEM = {
    s: {
      p: '-',
      e: '__',
      m: '--',
    }
  };

  var groupBlock = function(block) {
    var n = style.nodes;

    var selector = new n.Selector([new n.Literal('&')]);
    selector.lineno = block.lineno;
    selector.column = block.column;
    selector.filename = block.filename;

    var group = new n.Group();
    group.lineno = block.lineno;
    group.column = block.column;
    group.filename = block.filename;

    var bl = new n.Block(block.parent, group);
    bl.lineno = block.lineno;
    bl.column = block.column;
    bl.filename = block.filename;

    group.push(selector);
    group.block = block;

    bl.nodes = [];
    bl.push(group);

    return bl;
  };

  style.define('-settings', function(hash) {
    console.log(JSON.stringify(hash, null, 2));
  });

  var bemAddSeparator = function(block, separator) {
    var n = style.nodes;

    block = groupBlock(block);
    block.nodes[0].nodes[0].segments.push(new n.Literal(separator));

    return block;

    // var nodes = block.nodes;

    // for(var i = 0; i < nodes.length; i++) {
    //   if(nodes[i].nodeName == 'group') {
    //     for(var j = 0; j < nodes[i].nodes.length; j++) {
    //       var sgn = [];
    //       var sg = nodes[i].nodes[j].segments;

    //       for(var k = 0; k < sg.length; k++) {
    //         sgn.push(sg[k]);

    //         if(sg[k].val == '&') {
    //           sgn.push(new style.nodes.Literal(separator));
    //         }
    //       }

    //       nodes[i].nodes[j].segments = sgn;
    //     }
    //   }
    // }

    // return block;
  };

  require('../components/AtRuleTypes').atRuleTypes.register('e', function(atrule) {
    var b = this.currentBlock;
    var block = atrule.block.clone();

    block = bemAddSeparator(block, BEM.s.e);

    this.visit(block);
    this.mixin(block.nodes, b);

    return style.nodes.null;
  });

  require('../components/AtRuleTypes').atRuleTypes.register('m', function(atrule) {
    var b = this.currentBlock;
    var block = atrule.block.clone();

    block = bemAddSeparator(block, BEM.s.m);

    this.visit(block);
    this.mixin(block.nodes, b);

    return style.nodes.null;
  });

  require('../components/AtRuleTypes').atRuleTypes.register('t', function(atrule) {
    var b = this.currentBlock;
    var block = atrule.block.clone();

    // console.log(JSON.stringify(block, null, 2));

    return style.nodes.null;
  });



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