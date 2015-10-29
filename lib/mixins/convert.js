/**
 * Convert unit from one unit type to another.
 * ======================================================================== */

var plugin = function(style){

  /**
   * Convert any CSS <length> or <percentage> value to any another.
   *
   * Used: Compass `convert-length` function with some changes
   */
  var to_unit = function(length, to, from_context, to_context) {
    // Context values must be in px so we can determine a conversion ratio for
    // relative units.
    var base = 16,
        DPI = 72,
        ratio = (3 / 5),
        Unit = style.nodes.Unit;

    if(typeof from_context == 'undefined') {
      from_context = base;
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
    to = to.name ? to.name : to.val;

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
        length = length * base;
      } else if(from == '%') {
        length = length * from_context;
      } else if(from == 'ex') {
        length = length * from_context / 2;
      } else if(from == 'ch') {
        length = length * from_context * ratio;
      } else if(from == 'in') {
        length = length * DPI;
      } else if(from == 'mm') {
        length = length / 2.54 * DPI / 10;
      } else if(from == 'cm') {
        length = length / 2.54 * DPI;
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
        length = length / base;
      } else if(to == '%') {
        length = length / to_context * 100;
      } else if(to == 'ex') {
        length = length / to_context * 2;
      } else if(to == 'ch') {
          length = length / to_context / ratio;
      } else if(to == 'in') {       // Absolute units
        length = length / DPI;
      } else if(to == 'mm') {
        length = length * 2.54 / DPI * 10;
      } else if(to == 'cm') {
        length = length * 2.54 / DPI;
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

  style.define('to_unit', to_unit);

};


module.exports = {
  plugin: plugin,
}