var su = require('stylus/lib/utils.js'),
    surl = require('stylus/lib/functions/url.js');

module.exports = fn = surl({
    mimes: surl.mimes,
    limit: false
  });

// (module.exports = function iurl(url) {
//   return fn(url);
// }).raw = true;
