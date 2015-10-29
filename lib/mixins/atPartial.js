var utils = require('stylus/lib/utils.js');

var lookupProperty = require('./atProperty').lookupProperty;

var plugin = function(style){
  style.define('at_partial', function(property) {
    utils.assertType(property, 'string', 'property');
    property = property.string;
    var self = this;

    var list = property.split('-'),
        temp = 0,
        result = 0;

    if(list[0] == 'border') {
      var positions = {
        width:0,
        style:1,
        color:2
      };

      function _border_part(value, part) {
        if(value) {
          return value.nodes[positions[part]];
        } else{
          return 0
        }
      }

      temp = lkp(property);

      if(!temp)
        if(list.length == 3)
          temp = _border_part(lkp(list[0] + '-' + list[1]), list[2]);

          if(!temp){ // Searching for the border-{property}
            temp = lkp(list[0] + '-' + list[2]);

            if(!temp) { // Getting border property
              temp = _border_part(lkp(list[0]), list[2]);
            }
          }

        if(list.length == 2) {
          if(['left', 'right', 'top', 'bottom'].indexOf(list[1]) >= 0) {
            temp = lkp(list[0])
          } else{
            temp = _border_part(lkp(list[0]), list[1]);
          }
        }
    }

    if(['margin', 'padding'].indexOf(list[0]) >= 0) {
      temp = lkp(property);

      if(list.length == 2) {
        positions = {
          top: [0, 0],
          right: [1, 1],
          bottom: [0, 2],
          left: [1, 3]
        };

        properties = {};

        if(!temp) {
          temp = lkp(list[0]);

          if(temp) {
            if(temp.nodes.length > 1) {
              for(var prop in positions) {
                if(!positions.hasOwnProperty(prop)) continue;
                var pos = positions[prop];

                properties[prop] = temp.nodes[pos[1]] ? temp.nodes[pos[1]]
                  : temp.nodes[pos[0]];
              }

              temp = properties[list[1]];
            }
          }
        }
      }
    }

    if(temp) {
      result = temp;
    }

    return result;

    function lkp(name) {
      var prop = lookupProperty.call(self, name);

      if(typeof prop !== 'undefined') {
        return prop.expr;
      } else {
        return 0;
      }
    }
  });
};

module.exports = {
  plugin: plugin,
}
