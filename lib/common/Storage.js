var su = require('stylus/lib/utils.js'),
    n = require('stylus/lib/nodes'),
    u = require('../common/utils.js');

var Storage = function Storage() {
  this.list = {};
};

Storage.prototype.exists = function(name) {
  return typeof this.list[name] !== 'undefined';
};

Storage.prototype.register = function(name, data) {
  if(!(typeof name == 'string' || name instanceof String)) {
    throw new Error('Name of the property must be string instead of ' + typeof name);

    return false;
  }

  this.list[name] = data;
};

Storage.prototype.get = function(name) {
  if(typeof name === 'string' || name instanceof String) {
    if(this.exists(name)) {
      return this.list[name];
    }
  }

  return false;
};

// Storage method aliases
Storage.prototype.set = Storage.prototype.register;


var plugin = function(style) {
  style.options.extensions.storage = new Storage();
};

module.exports = {
  Storage: Storage,
  plugin: plugin,
};
