/**
 * String functions
 * ======================================================================== */

var plugin = function(style){

  style.define('split', function(what, by) {
    var splitter = new RegExp('\\s*' + by.string + '\\s*', 'igm');

    return what.string.split(splitter);
  });
};


module.exports = {
  plugin: plugin,
}