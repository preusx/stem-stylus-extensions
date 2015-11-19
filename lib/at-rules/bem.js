var su = require('stylus/lib/utils.js'),
    u = require('../common/utils.js'),
    n = require('stylus/lib/nodes');

var toLit = require('../functions/to')['to-literal'];

var plugin = function(style) {
  var BEM = {
    p: {
      block: [new n.Literal('')],
      utility: [new n.Literal('is')],
    },

    s: {
      prefix: [new n.Literal('-')],
      element: [new n.Literal('__')],
      modifer: [new n.Literal('--')],
    }
  };

  var bemConfig = function(hash) {
    hash = u.hashToObject(hash);

    var parts = ['p', 's'];

    for(var i = parts.length - 1; i >= 0; i--) {
      var part = parts[i];
      if(!hash.hasOwnProperty(part)) continue;

      for(var j in hash[part]) {
        if(hash[part].hasOwnProperty(j) && typeof BEM[part][j] != 'undefiend') {
          BEM[part][j] = [toLit(hash[part][j])];
        }
      }
    }
  };

  var bemAddSeparator = function(block, separator) {
    var n = style.nodes;

    block = u.groupBlock(block);
    block.nodes[0].nodes[0].segments = block.nodes[0].nodes[0].segments.concat(separator);

    return block;
  };

  var bemPrefixBlock = function(atrule, prefix) {
    var b = this.currentBlock;
    var block = atrule.block.clone();

    if(atrule.segments.length > 0) prefix = prefix.concat(atrule.segments);
    block = bemAddSeparator(block, prefix);

    this.visit(block);
    this.mixin(block.nodes, b);
  };

  var bemRuleBlock = function(atrule) {
    var segments = [
        new n.Literal('.'),
      ];

    if(!!BEM.p.block[0].val) segments = segments.concat(BEM.p.block, BEM.s.prefix);

    bemPrefixBlock.call(this, atrule, segments);

    return style.nodes.null;
  };

  var bemRuleElement = function(atrule) {
    bemPrefixBlock.call(this, atrule, BEM.s.element);

    return style.nodes.null;
  };

  var bemRuleModifer = function(atrule) {
    bemPrefixBlock.call(this, atrule, BEM.s.modifer);

    return style.nodes.null;
  };

  var bemRuleUtility = function(atrule) {
    var segments = [
        new n.Literal('.'),
      ];

    if(!!BEM.p.utility[0].val) segments = segments.concat(BEM.p.utility, BEM.s.prefix);

    bemPrefixBlock.call(this, atrule, segments);

    return style.nodes.null;
  };


  style.define('bem-config', bemConfig);

  style.options.extensions.atRuleType.register('b', bemRuleBlock);
  // style.options.extensions.atRuleType.register('block', bemRuleBlock);
  // style.options.extensions.atRuleType.register('component', bemRuleBlock);

  style.options.extensions.atRuleType.register('e', bemRuleElement);
  // style.options.extensions.atRuleType.register('elem', bemRuleElement);
  // style.options.extensions.atRuleType.register('part', bemRuleElement);
  // style.options.extensions.atRuleType.register('element', bemRuleElement);

  style.options.extensions.atRuleType.register('m', bemRuleModifer);
  // style.options.extensions.atRuleType.register('mod', bemRuleModifer);
  // style.options.extensions.atRuleType.register('modifer', bemRuleModifer);

  style.options.extensions.atRuleType.register('u', bemRuleUtility);
  // style.options.extensions.atRuleType.register('utility', bemRuleUtility);

};

module.exports = {
  plugin: plugin,
}