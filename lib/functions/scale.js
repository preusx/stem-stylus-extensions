var su = require('stylus/lib/utils.js'),
    n = require('stylus/lib/nodes'),
    u = require('../common/utils.js');

module.exports = {};


module.exports['scale-geometric-progression'] = function(base, value, rate) {
  return new n.Unit(base.val * Math.pow(rate.val, (value.val - 1)),
      (value.type ? value.type: (base.type ? base.type : rate.type)));
};


module.exports['scale-geometric-progression_reverse'] =
function(base, value, rate, round) {
  round = typeof round == 'undefined' ? false : round.val;

  var r = Math.log(value.val / base.val) / Math.log(rate.val) + 1;

  return new n.Unit(round ? Math.round(r) : r,
      (value.type ? value.type: (base.type ? base.type : rate.type)));
};

module.exports['scale-modular'] = module.exports['scale-geometric-progression'];
module.exports['scale-modular_reverse'] =
  module.exports['scale-geometric-progression_reverse'];


module.exports['scale-arithmetic-progression'] = function(base, value, d) {
  d = typeof d == 'undefined' ? base : d;

  return new n.Unit(base.val + (d.val * (value.val - 1)),
      (value.type ? value.type: (base.type ? base.type : d.type)));
};

module.exports['scale-arithmetic-progression_reverse'] =
function(base, value, d, round) {
  d = typeof d == 'undefined' ? base : d;
  round = typeof round == 'undefined' ? false : round.val;

  var r = (value.val - base.val) / d.val + 1;

  return new n.Unit(round ? Math.round(r) : r,
      (value.type ? value.type: (base.type ? base.type : d.type)));
};


module.exports['scale-exponential-growth'] = function(base, value, rate) {
  return new n.Unit(base.val * Math.pow((rate.val + 1), value.val),
      (value.type ? value.type: (base.type ? base.type : rate.type)));
};

module.exports['scale-exponential-growth_reverse'] =
function(base, value, rate) {
  round = typeof round == 'undefined' ? false : round.val;

  var r = Math.log(value.val / base.val) / Math.log(rate.val + 1);

  return new n.Unit(round ? Math.round(r) : r,
      (value.type ? value.type: (base.type ? base.type : rate.type)));
};


module.exports['scale-expotential'] = function(base, value, rate) {
  return new n.Unit(base.val * Math.exp(rate.val * value.val),
      (value.type ? value.type: (base.type ? base.type : rate.type)));
};

module.exports['scale-expotential_reverse'] = function(base, value, rate) {
  var exp = Math.exp(1);

  return new n.Unit(Math.log(value.val / base.val) / Math.log(exp) / rate.val,
      (value.type ? value.type: (base.type ? base.type : rate.type)));
};


module.exports['scale-qubic'] = function(a, b, c, d, x) {
  return new n.Unit(
    a.val * Math.pow(x.val, 3) + b.val * Math.pow(x.val, 2)
      + c.val * x.val + d.val,
    x.type ? x.type : d.type);
};
