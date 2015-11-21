var su = require('stylus/lib/utils.js');


(module.exports = function listSeparatorSet(list, separator) {
  list = su.unwrap(list).clone();
  separator = typeof separator != 'undefined' ?
      su.unwrap(separator).first.val : void 0;

  list.isList = separator;

  return list;
}).raw = true;
