/**
 * Math functions
 * ======================================================================== */

var plugin = function(style){

  var gcd = function(a, b) {
    return b ? gcd(b, a % b) : a;
  };

  var lcm = function(a, b) {
    var divider = gcd(a, b);

    return Math.abs(a * b) / (divider ? divider : 0);
  };

  style.define('math_gcd', function(first, second) {
    return gcd(first.val, second.val);
  });

  style.define('math_nod', function(first, second) {
    return gcd(first.val, second.val);
  });

  style.define('math_lcm', function(first, second) {
    return lcm(first.val, second.val);
  });

  style.define('math_nok', function(first, second) {
    return lcm(first.val, second.val);
  });

  style.define('math_simple_fraction', function(decimal) {
    var denominator = 100000000000;
    var numerator = Math.round(decimal.val * denominator);
    var _gcd = gcd(numerator, denominator);

    return [numerator / _gcd, denominator / _gcd];
  });

};


module.exports = {
  plugin: plugin,
}