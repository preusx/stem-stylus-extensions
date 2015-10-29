var Extend;

var plugin = function(style){
  Extend = function Extend(selectors) {
    style.nodes.Extend.call(this, selectors);
  };
  Extend.prototype.__proto__ = style.nodes.Extend.prototype;

  Extend.prototype.toString = function() {
    return '/* ' + style.nodes.Extend.prototype.toString.call(this) + ' */';
  };

  Extend.prototype.__defineGetter__('hash', function(){
    return this.val;
  });

  var visitExtend = style.options.Evaluator.prototype.visitExtend;
  style.options.Evaluator.prototype.visitExtend = function(extend){
    visitExtend.call(this, extend);

    return new Extend(extend.selectors);
  };
}

module.exports = {
  Extend: Extend,
  plugin: plugin,
}