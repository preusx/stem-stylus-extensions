/**
 * Byte operator functions
 * ======================================================================== */

var plugin = function(style){

  style.define('byte_or', function(first, second) {
    return first.val | second.val;
  });


  style.define('byte_and', function(first, second) {
    return first.val & second.val;
  });

};


module.exports = {
  plugin: plugin,
}