var loader = function(style, list){
  var path = require('path');

  style.options.extensions = {};
  style.options.extensions.utils = require('./common/utils.js');

  var pluggable = [
    'common/node/Extend',

    'common/AtRuleType',
  ];

  for(var i = 0, l = pluggable.length; i < l; i++) {
    require('./' + pluggable[i]).plugin(style);
  }

  for(var i = 0, l = list.length; i < l; i++) {
    var contents = require('./' + list[i]);

    if(typeof contents.plugin != 'undefined') {
      contents.plugin(style);
    } else if(typeof contents == 'function') {
      style.define(path.basename(list[i], '.js'), contents);
    } else if(Object.prototype.toString.call(contents) == '[object Object]') {
      for(var j in contents) {
        if(!contents.hasOwnProperty(j)) continue;

        style.define(j, contents[j]);
      }
    }
  }
};

module.exports = loader;
