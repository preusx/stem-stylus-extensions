var utils = require('stylus/lib/utils.js');

var plugin = function(style){
  var timers = {};

  var tStart = function(label) {
    utils.assertType(label, 'string', 'label');
    var l = label.val;
    timers[l] = timers[l] ? timers[l] : {start: 0, count: 0};
    timers[l].start = Date.now();
  };

  var tStop = function(label) {
    utils.assertType(label, 'string', 'label');
    var l = label.val;
    timers[l].count += Date.now() - timers[l].start;
    timers[l].start = 0;
  };

  var tFlush = function(label) {
    utils.assertType(label, 'string', 'label');
    var l = label.val;
    timers[l] = {start: 0, count: 0};
  };

  var tShow = function(label) {
    utils.assertType(label, 'string', 'label');
    var l = label.val;

    if(timers[l]) {
      console.log('Time spent on "%s" is: %dms', l, timers[l].count);
    }
  };

  var tShowAll = function() {
    var tm = timers;
    for(var i in tm) {
      if(!tm.hasOwnProperty(i)) continue;

      console.log('Time spent on "%s" is: %dms', i, tm[i].count);
    }
  };

  var tFinish = function(label) {
    tStop(label);
    tShow(label);
    tFlush(label);
  };

  style.define('timer-start', tStart);

  style.define('timer-stop', tStop);

  style.define('timer-flush', tFlush);

  style.define('timer-show', tShow);

  style.define('timer-show-all', tShowAll);

  style.define('timer-finish', tFinish);
};

module.exports = {
  plugin: plugin,
}