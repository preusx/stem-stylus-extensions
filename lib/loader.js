var loader = function(style, list){
  var base = [
    'components/ExtendNode', 'components/AtRuleTypes',
  ];
  list = base.concat(list);

  for(var i = 0, l = list.length; i < l; i++) {
    var fName = list[i];

    require('./' + fName).plugin(style);
  }
};

module.exports = loader;