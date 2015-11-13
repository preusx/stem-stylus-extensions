var su = require('stylus/lib/utils.js'),
    n = require('stylus/lib/nodes'),
    u = require('../common/utils.js');


var timers = {};

var tStart = function(label) {
  su.assertType(label, 'string', 'label');
  var l = label.val;
  timers[l] = timers[l] ? timers[l] : {start: 0, count: 0};
  timers[l].start = Date.now();
};

var tStop = function(label) {
  su.assertType(label, 'string', 'label');
  var l = label.val;
  timers[l].count += Date.now() - timers[l].start;
  timers[l].start = 0;
};

var tFlush = function(label) {
  su.assertType(label, 'string', 'label');
  var l = label.val;
  timers[l] = {start: 0, count: 0};
};

var tShow = function(label) {
  su.assertType(label, 'string', 'label');
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

module.exports['timer-start'] = tStart;
module.exports['timer-stop'] = tStop;
module.exports['timer-flush'] = tFlush;
module.exports['timer-show'] = tShow;
module.exports['timer-show-all'] = tShowAll;
module.exports['timer-finish'] = tFinish;
