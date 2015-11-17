var plugin = function(){
  return function(style){
    require('./lib/loader.js')(style, [
      'at-rules/property-prefix',

      'functions/timer',

      'functions/str',
      'functions/math',

      'functions/type',
      'functions/to',
      'functions/reassign',
      'functions/assign',
      'functions/var',
      'functions/list-separator-set',

      'functions/prop',
    ]);
  };
};

module.exports = plugin;