var plugin = function(){
  return function(style){
    require('./lib/loader.js')(style, [
      'mixins/strings', 'mixins/regexp', 'mixins/math', 'mixins/byteOperations',

      'mixins/timer', 'mixins/type', 'mixins/convert', 'mixins/reassign',
      'mixins/listSeparator',

      'mixins/atProperty', 'mixins/atCurrent', 'mixins/atPartial',

      'atRules/propertyPrefix',
    ]);
  };
};

module.exports = plugin;