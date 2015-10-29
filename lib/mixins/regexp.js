/**
 * RegExp functions
 * ======================================================================== */

var plugin = function(style){

  style.define('reg_replace', function(what, expression, by) {
    var regExp = new RegExp(expression.string, 'igm');

    return what.string.replace(regExp, by.string);
  });

};


module.exports = {
  plugin: plugin,
}