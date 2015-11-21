module.exports = {};


module.exports['str-replace'] = function(what, expression, by) {
  var regExp = new RegExp(expression.string, 'igm');

  return what.string.replace(regExp, by.string);
};


module.exports['str-split'] = function split(what, by) {
  var splitter = new RegExp('\\s*' + by.string + '\\s*', 'igm');

  return what.string.split(splitter);
};
