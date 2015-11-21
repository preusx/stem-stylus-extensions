module.exports = {};


/**
 * Byte operator functions.
 */

module.exports['byte-or'] = function byteOr(first, second) {
  return first.val | second.val;
};

module.exports['byte-and'] = function byteAnd(first, second) {
  return first.val & second.val;
};



/**
 * GCD and LCM functions.
 */

var gcd = function(a, b) {
  return b ? gcd(b, a % b) : a;
};

var lcm = function(a, b) {
  var divider = gcd(a, b);

  return Math.abs(a * b) / (divider ? divider : 1);
};

module.exports['math-gcd'] =
module.exports['math-nod'] = function mathGcd(first, second) {
  return gcd(first.val, second.val);
};


module.exports['math-lcm'] =
module.exports['math-nok'] = function mathLcm(first, second) {
  return lcm(first.val, second.val);
};



/**
 * Getting the math simple fraction from the decimal.
 */

module.exports['math-simple-fraction'] = function mathSimpleFraction(decimal) {
  var denominator = 100000000000;
  var numerator = Math.round(decimal.val * denominator);
  var _gcd = gcd(numerator, denominator);

  return [numerator / _gcd, denominator / _gcd];
};
