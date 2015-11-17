var AtRuleType = function AtRuleType() {
  this.type = {};
};

AtRuleType.prototype.exists = function(name) {
  return typeof this.type[name] !== 'undefined';
};

AtRuleType.prototype.register = function(type, callback) {
  if(!(typeof type == 'string' || type instanceof String)) {
    throw new Error('Name of the AtRule must be string instead of ' + typeof type);

    return false;
  }

  if(this.exists(type)) {
    // throw new Error('AtRule with the name of @' + type + ' already exists.');

    return false;
  }

  this.type[type] = callback;
};

AtRuleType.prototype.evaluate = function(type, evaluator, atrule) {
  if(typeof type === 'string' || type instanceof String) {
    if(this.exists(type)) {
      return this.type[type].call(evaluator, atrule);
    }
  }

  return null;
};

// AtRuleType method aliases
AtRuleType.prototype.add = AtRuleType.prototype.register;
AtRuleType.prototype.eval = AtRuleType.prototype.evaluate;

var atRuleType = new AtRuleType();


var plugin = function(style){
  var visitAtrule = style.options.Evaluator.prototype.visitAtrule;

  style.options.extensions.atRuleType = atRuleType;

  style.options.Evaluator.prototype.visitAtrule = function(atrule){
    if(atRuleType.exists(atrule.type)) {
      var result = atRuleType.evaluate(atrule.type, this, atrule);

      return result === null ? new style.nodes.Null() : result;
    }

    return visitAtrule.call(this, atrule);
  };
};

module.exports = {
  atRuleType: atRuleType,
  AtRuleType: AtRuleType,
  plugin: plugin,
};
