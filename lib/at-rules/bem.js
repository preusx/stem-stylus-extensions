var su = require('stylus/lib/utils.js'),
    u = require('../common/utils.js'),
    n = require('stylus/lib/nodes'),
    sf = require('stylus').functions;

var toLit = require('../functions/to')['to-literal'];

var plugin = function(style) {
  var BEM = {
    p: {
      block: [new n.Literal('')],
      state: [new n.Literal('is')],
      utility: [new n.Literal('u')],
    },

    s: {
      prefix: [new n.Literal('-')],
      element: [new n.Literal('__')],
      modifer: [new n.Literal('--')],
    }
  };


  var bemConfig = function(hash) {
    hash = u.toJS(hash);

    var parts = ['p', 's'];

    if(u.noNull(hash)) {
      for(var i = parts.length - 1; i >= 0; i--) {
        var part = parts[i];
        if(!hash.hasOwnProperty(part)) continue;

        for(var j in hash[part]) {
          if(hash[part].hasOwnProperty(j) && typeof BEM[part][j] != 'undefiend') {
            BEM[part][j] = [toLit(hash[part][j])];
          }
        }
      }
    }

    var coercedData = new n.Expression();
    coercedData.push(su.coerce(BEM, true));
    this.functions.reassign.call(this, new n.String('BEM'), coercedData);

    if(this.return) {
      return coercedData;
    }
  };

  /**
   * Block parts regular expression.
   *
   * $3   - Prefix
   * $5   - Block name
   * $8   - Element name
   * $11  - Modificator name
   */
  var bemRegExp = function() {
    return '(\.)' +
      '(([a-z0-9]{1,3})(' + BEM.s.prefix[0].string + ')|)' +
      '([a-z0-9]+)' +
      '((' + BEM.s.element[0].string + ')([a-z0-9]+)|)' +
      '((' + BEM.s.modifer[0].string + ')([a-z0-9_]+)|)';
  };


  var bemSelectorParts = function() {
    var selector = sf.selector.call(this),
        matches = (new RegExp(bemRegExp(), 'img')).exec(selector);

    return su.coerce({
      prefix: matches[3],
      block: matches[5],
      element: matches[8],
      mod: matches[11],
    }, true)
  };


  var bemCompose = function(b, e, m, p) {
    b = su.unwrap(b).first.string;
    e = u.noNull(e) ? su.unwrap(e).first.string : '';
    m = u.noNull(m) ? su.unwrap(m).first.string : '';
    p = u.noNull(p) ? p.string : BEM.p.block[0].string ? BEM.p.block[0].string : '';

    return new n.String(
        (p ? p + BEM.s.prefix[0].string : '') +
        b +
        (e ? Bem.s.element[0].string + e : '') +
        (m ? Bem.s.modifer[0].string + m : '')
      );
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
        new n.Literal(' '),
        new n.Literal('.'),
      ];

    if(!!BEM.p.utility[0].val) segments = segments.concat(BEM.p.utility, BEM.s.prefix);

    bemPrefixBlock.call(this, atrule, segments);

    return style.nodes.null;
  };

  var bemRuleState = function(atrule) {
    var segments = [
        new n.Literal('.'),
      ];

    if(!!BEM.p.state[0].val) segments = segments.concat(BEM.p.state, BEM.s.prefix);

    bemPrefixBlock.call(this, atrule, segments);

    return style.nodes.null;
  };


  style.define('bem-config', bemConfig);
  style.define('bem-reg-exp', bemRegExp);
  style.define('bem-selector-parts', bemSelectorParts);
  style.define('bem-compose', bemCompose);

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

  style.options.extensions.atRuleType.register('s', bemRuleState);
  // style.options.extensions.atRuleType.register('state', bemRuleState);

};

module.exports = {
  plugin: plugin,
};
