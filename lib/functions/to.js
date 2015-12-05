var su = require('stylus/lib/utils.js'),
    n = require('stylus/lib/nodes'),
    u = require('../common/utils.js');

module.exports = {};

var config = {
  base:   16,
  DPI:    96,
  ratio:  3 / 5
};

module.exports['to-config'] = function(hash) {
  hash = u.toJS(hash);

  config.base = hash.base ? hash.base.val : config.base;
  config.DPI = hash.DPI ? hash.DPI.val : config.DPI;
  config.ratio = hash.ratio ? hash.ratio.val : config.ratio;

  if(this.return ) {
    return su.coerce(config, true);
  }
};


/**
 * Convert any CSS <length> or <percentage> value to any another.
 *
 * Used: Compass `convert-length` function with some changes
 */

var toUnit = module.exports['to-unit'] = function toUnit(length, to, from_context, to_context) {
  // Context values must be in px so we can determine a conversion ratio for
  // relative units.
  var c = config, Unit = n.Unit;

  if(typeof from_context == 'undefined') {
    from_context = c.base;
  } else {
    if(from_context.type != 'px') {
      console.error("Paremeter from_context must resolve to a value in pixel units.")
    }

    from_context = from_context.val;
  }

  if(typeof to_context == 'undefined') {
    to_context = from_context;
  } else {
    if(to_context.type != 'px') {
      console.error("Parameter to_context must resolve to a value in pixel units.")
    }

    to_context = to_context.val;
  }

  from = length.type;
  length = length.val;
  to = to.name ? to.name : to.val ? to.val : to;

  // Optimize for cases where `from` and `to` units are accidentally the same.
  if(from == to) {
    return new Unit(length, from);
  }

  if(from == '' || typeof from == 'undefined') {
    return new Unit(length, to);
  }

  if(from != 'px') {
    // Convert relative units using the from-context parameter.
    if     (from == 'em') {
      length = length * from_context;
    } else if(from == 'rem') {
      length = length * c.base;
    } else if(from == '%') {
      length = length * from_context;
    } else if(from == 'ex') {
      length = length * from_context / 2;
    } else if(from == 'ch') {
      length = length * from_context * c.ratio;
    } else if(from == 'in') {
      length = length * c.DPI;
    } else if(from == 'mm') {
      length = length / 2.54 * c.DPI / 10;
    } else if(from == 'cm') {
      length = length / 2.54 * c.DPI;
    } else if(from == 'pt') {
      length = length * 96 / 72;
    } else if(from == 'pc') {
      length = length * from_context;
    } else {
      // Certain units can't be converted.
      if(from == 'vw' || from == 'vh' || from == 'vmin') {
        console.warn("From: '" + from + "' units can't be reliably converted. " +
            "Returning original value.");
        return new Unit(length, from);
      } else {
        console.warn("From: '" + from + "' is an unknown length unit. " +
            "Returning original value.")
        return new Unit(length, from);
      }
    }
  }

  if(to != 'px') {
    if       (to == 'em') {       // Relative units
      length = length / to_context;
    } else if(to == 'rem') {
      length = length / c.base;
    } else if(to == '%') {
      length = length / to_context * 100;
    } else if(to == 'ex') {
      length = length / to_context * 2;
    } else if(to == 'ch') {
        length = length / to_context / c.ratio;
    } else if(to == 'in') {       // Absolute units
      length = length / c.DPI;
    } else if(to == 'mm') {
      length = length * 2.54 / c.DPI * 10;
    } else if(to == 'cm') {
      length = length * 2.54 / c.DPI;
    } else if(to == 'pt') {
      length = length * 72 / 96;
    } else if(to == 'pc') {
      length = length / to_context;
    } else if(to == 'vw' || to == 'vh' || to == 'vmin') {
      console.warn("To: '" + to + "' units can't be reliably converted. " +
          "Returning original value.");
      return new Unit(length, from);
    } else {
      console.warn("To: '" + to + "' is an unknown length unit. " +
          "Returning original value.");
      return new Unit(length, from);
    }
  }

  return new Unit(length, to);
};



/**
 * Defining the shorthand functions for the unit conversion.
 */
var convertableUnits = [
    'em',
    'rem',
    'px',
    'ex',
    'ch',
    'in',
    'mm',
    'cm',
    'pt',
    'pc',
  ];

for(var i = convertableUnits.length - 1; i >= 0; i--) {
  module.exports['to-' + convertableUnits[i]] = (function(to) {
    var fnc;

    (fnc = function(length, from_context, to_context) {
      return toUnit(length, to, from_context, to_context);
    }).raw = false;

    return fnc;
  })(convertableUnits[i]);
}


module.exports['to-decimal-pct'] =
module.exports['to-raw-pct'] =
module.exports['to-decimal-percent'] =
module.exports['to-raw-percent'] = function(unit) {
  su.assertType(unit, 'unit', 'unit');

  if(unit.type == '%') {
    unit.val /= 100;
  }

  return new n.Unit(unit.val, '');
};


module.exports['to-pct'] =
module.exports['to-percent'] = function(unit) {
  su.assertType(unit, 'unit', 'unit');
  if(unit.type == '%') return unit;

  return new n.Unit(unit.val * 100, '%');
};


/**
 * String conversions.
 */

module.exports['to-str'] =
module.exports['to-string'] = function(node) {
  if(node.nodeName == 'string') return node;

  return new n.String(node.toString());
};


module.exports['to-lit'] =
module.exports['to-literal'] = function(node) {
  if(node.nodeName == 'literal') return node;

  return new n.Literal(node.nodeName == 'string' ? node.val : node.toString());
};
