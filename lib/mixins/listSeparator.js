var utils = require('stylus/lib/utils.js');

/**
 * Setting up a list separator
 * ======================================================================== */

var plugin = function(style){

  var listSeparatorSet;

  (listSeparatorSet = function (list, separator) {
    list = utils.unwrap(list).clone();
    separator = typeof separator != 'undefined' ?
        utils.unwrap(separator).first.val : void 0;

    list.isList = separator;

    return list;
  }).raw = true;

  style.define('list-separator-set', listSeparatorSet);

};


module.exports = {
  plugin: plugin,
}