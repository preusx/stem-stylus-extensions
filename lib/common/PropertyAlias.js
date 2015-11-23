var su = require('stylus/lib/utils.js'),
    n = require('stylus/lib/nodes'),
    u = require('../common/utils.js');

var PropertyAlias = function PropertyAlias() {
  this.list = {};
};

PropertyAlias.prototype.exists = function(name) {
  return typeof this.list[name] !== 'undefined';
};

PropertyAlias.prototype.register = function(name, cssName) {
  if(!(typeof name == 'string' || name instanceof String)) {
    throw new Error('Name of the alias must be string instead of ' + typeof name);

    return false;
  }

  this.list[name] = cssName;
};

PropertyAlias.prototype.get = function(name) {
  if(typeof name === 'string' || name instanceof String) {
    if(this.exists(name)) {
      return this.list[name];
    }
  }

  return false;
};

// PropertyAlias method aliases
PropertyAlias.prototype.add = PropertyAlias.prototype.register;

var propertyAlias = new PropertyAlias();


var plugin = function(style) {
  var visitProperty = style.options.Evaluator.prototype.visitProperty;

  style.options.extensions.propertyAlias = propertyAlias;

  style.options.Evaluator.prototype.visitProperty = function(property){
    var name = this.interpolate(property);

    if(propertyAlias.exists(name)) {
      var alias = propertyAlias.get(name);

      if(alias) {
        property.segments = [alias];
      }
    }

    return visitProperty.call(this, property);
  };

  style.define('register-alias', function(hash) {
    hash = u.hashToObject(hash);

    for(var i in hash) {
      propertyAlias.add(i, hash[i]);
    }
  });
};

module.exports = {
  propertyAlias: propertyAlias,
  PropertyAlias: PropertyAlias,
  plugin: plugin,
};
