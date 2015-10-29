var AtRuleTypes = function AtRuleTypes() {
  this.type = {};
};

AtRuleTypes.prototype.exists = function(name) {
  return typeof this.type[name] !== 'undefined';
};

AtRuleTypes.prototype.register = function(type, callback) {
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

AtRuleTypes.prototype.evaluate = function(type, evaluator, atrule) {
  if(typeof type === 'string' || type instanceof String) {
    if(this.exists(type)) {
      return this.type[type].call(evaluator, atrule);
    }
  }

  return null;
};

// AtRuleTypes method aliases
AtRuleTypes.prototype.add = AtRuleTypes.prototype.register;
AtRuleTypes.prototype.eval = AtRuleTypes.prototype.evaluate;

var atRuleTypes = new AtRuleTypes();


var plugin = function(style){
  var visitAtrule = style.options.Evaluator.prototype.visitAtrule;

  style.options.Evaluator.prototype.visitAtrule = function(atrule){
    if(atRuleTypes.exists(atrule.type)) {
      var result = atRuleTypes.evaluate(atrule.type, this, atrule);

      return result === null ? new style.nodes.Null() : result;
    }

    return visitAtrule.call(this, atrule);
  };
};

module.exports = {
  atRuleTypes: atRuleTypes,
  AtRuleTypes: AtRuleTypes,
  plugin: plugin,
}