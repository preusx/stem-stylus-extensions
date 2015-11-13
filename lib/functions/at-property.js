var su = require('stylus/lib/utils.js'),
    u = require('../common/utils.js');

module.exports = function atProperty(property) {
  su.assertType(property, 'string', 'property');

  var prop = u.lookupProperty.call(this, property.string);

  if(typeof prop !== 'undefined') {
    return prop.expr;
  } else {
    return 0;
  }
};
