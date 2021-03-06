﻿/***
 *      Author: KodingSykosis
 *        Date: 04/04/2013
 *     Version: 1.0
 *     License: GPL v3 (see License.txt or http://www.gnu.org/licenses/)
 * Description: This plugin is designed to simplify 
 *              object oriented programing in javascript
 *
 *        Name: jQuery.oop.class.js
 *
 *    Requires: jQuery.oop.overrides.js
 *              jQuery.oop.inheritance.js
 ***/

(function ($) {
    $.extend({
        cls: function (proto, _super) {
            var prototype =
            $.inherit(
                proto,
                typeof _super === 'undefined' || _super === null
                    ? undefined
                    : _super.prototype
            );

            var fn = function () {
                function app() {
                    var args = arguments;

                    if (this.main) {
                        this.main.apply(this, args);
                    }
                }

                app.prototype = prototype;

                return app;
            };

            return fn();
        },
        ns: function (namespace, parent) {
            var parts = namespace.split('.');
            var target = parts.splice(0, 1);
            parent = parent || window;

            if (typeof parent[target] === "undefined") {
                parent[target] = {};
            }

            if (parts.length > 0) {
                $.ns(parts.join('.'), parent[target]);
            }
        }
    });
})(jQuery);