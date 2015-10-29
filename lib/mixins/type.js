var utils = require('stylus/lib/utils.js');

var plugin = function(style){
    var type;

    (type = function(expr) {
        expr = utils.unwrap(expr);

        if(expr.nodes.length > 1) return 'list';
        if(typeof expr.first.vals == 'object') return 'hash';

        return expr.first.nodeName;
    }).raw = true;

    var nodeTypes = [
            'string',
            'list',
            'hash',
            'ident',
            'literal',
            'block',
            'function',
            'boolean',
            'rgba',
            'null',
            'unit',
            'hsla',
        ];

    style.define('type', type);

    for(var i = nodeTypes.length - 1; i >= 0; i--) {
        style.define('is_' + nodeTypes[i], (function(nodeType) {
            var fnc;

            (fnc = function(expr) {
                if(type(expr) == nodeType) return true;
            }).raw = true;

            return fnc;
        })(nodeTypes[i]));
    }


    style.define('is_color', (function() {
        var fnc;

        (fnc = function(expr) {
            var tp = type(expr);

            if(tp == 'rgba' || tp == 'hsla') return true;
        }).raw = true;

        return fnc;
    })());
};

module.exports = {
  plugin: plugin,
}