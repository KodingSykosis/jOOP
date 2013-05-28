﻿/***
 *      Author: KodingSykosis
 *        Date: 04/04/2013
 *     Version: 1.0
 *     License: GPL v3 (see License.txt or http://www.gnu.org/licenses/)
 * Description: This plugin is designed to simplify 
 *              object oriented programing in javascript
 *
 *        Name: jQuery.oop.inheritance.js
 *
 *    Requires: jQuery.oop.overrides.js
 ***/

(function ($) {
    $.extend({
        inherit: function(subtype, _super) {
            var _subtype = $.extend({ _super: $.noop }, subtype);

            for (var name in _super) {
                if (typeof subtype[name] === 'function' && typeof _super[name] === 'function') {
                    _subtype[name] = $.override(subtype[name], _super[name]);
                } else if (typeof subtype[name] === 'object' && typeof _super[name] === 'object') {
                    _subtype[name] = $.inherit(subtype[name], _super[name]);
                } else if (!_subtype[name]) {
                    _subtype[name] = _super[name];
                }
            }
            
            //Inherit the existing controller if it 
            //hasn't been overwritten by a main
            if (typeof _super === 'object' && typeof _super.main === 'undefined') {
                _subtype.main = $.override(subtype.main, _super.constructor);
            }

            return _subtype;
        }
    });
})(jQuery);