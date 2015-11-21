var su = require('stylus/lib/utils.js'),
    n = require('stylus/lib/nodes'),
    u = require('../common/utils.js');


(module.exports = function variable(name) {
  name = su.unwrap(name).first;
  su.assertType(name, 'string', 'name');
  var scope = u.variableFrameLookup.call(this, name.val).scope;

  return scope.lookup(name.val);
}).raw = true;
