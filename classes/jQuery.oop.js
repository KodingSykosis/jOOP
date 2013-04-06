///#source 1 1 /classes/jQuery.oop.overrides.js
/***
 *      Author: KodingSykosis
 *        Date: 04/04/2013
 *     Version: 1.0
 * Description: This plugin is designed to simplify 
 *              object oriented programing in javascript
 *
 *        Name: jQuery.oop.overrides.js
 *
 *    Requires: none
 ***/

(function($) {
    $.extend({
        override: function (sub, _super) {
            return function() {
                var tmp = this._super;
                this._super = _super || $.noop;

                var ret = sub.apply(this, arguments);

                this._super = tmp;
                return ret;
            };
        }
    })
})(jQuery);
///#source 1 1 /classes/jQuery.oop.inheritance.js
/***
 *      Author: KodingSykosis
 *        Date: 04/04/2013
 *     Version: 1.0
 * Description: This plugin is designed to simplify 
 *              object oriented programing in javascript
 *
 *        Name: jQuery.oop.inheritance.js
 *
 *    Requires: jQuery.oop.overrides.js
 ***/

(function ($) {
    $.extend({
        inherit: function (subtype, _super) {
            var _subtype = $.extend({ _super: $.noop }, subtype);

            for (var name in _super) {
                if (typeof subtype[name] == 'function' && typeof _super[name] == 'function') {
                    _subtype[name] = $.override(subtype[name], _super[name]);
                } else if (typeof subtype[name] == 'object' && typeof _super[name] == 'object') {
                    _subtype[name] = $.inherit(subtype[name], _super[name]);
                } else if (!_subtype[name]) {
                    _subtype[name] = _super[name];
                }
            }

            return _subtype;
        }
    })
})(jQuery);
///#source 1 1 /classes/jQuery.oop.class.js
/***
 *      Author: KodingSykosis
 *        Date: 04/04/2013
 *     Version: 1.0
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
                typeof _super == 'undefined' || _super == null
                    ? undefined
                    : _super.prototype
            );

            var fn = function () {
                function app() {
                    var args = arguments;
                    if (this.main) {
                        this.main.apply(this, args);
                    }
                };

                app.prototype = prototype;

                return app;
            };

            return fn();
        }
    });
})(jQuery);
///#source 1 1 /classes/jQuery.oop.factory.js
/***
 *      Author: KodingSykosis
 *        Date: 04/04/2013
 *     Version: 1.0
 * Description: This plugin is designed to simplify 
 *              an application or script factory
 *              with support for aJax script loading
 *
 *        Name: jQuery.oop.factory.js
 *
 *    Requires: jQuery.oop.class.js
 *              jQuery.oop.overrides.js
 *              jQuery.oop.inheritance.js
 ***/

(function ($) {
    try {
        var scripts = document.getElementsByTagName('script');
        var myTag = scripts[scripts.length - 1];
        var repoAttr = myTag.getAttribute('repository');

        if (typeof repoAttr != 'undefined') {
            $.scriptRepository = repoAttr;
        }
    } catch(e) { }
    
    var cache = function(overwriteException) {
        var store = {};
        
        return new ($.cls({
            add: function (key, value) {
                if (typeof store[key] != 'undefined' && overwriteException) {
                    $.error('Object already exists in cache.');
                }

                return store[key] = value;
            },
            
            remove: function(key) {
                delete store[key];
            },
            
            value: function(key) {
                return store[key] || this.find(key);
            },
            
            find: function (key) {
                var re = new RegExp(key + '$');
                for (var prop in store) {
                    if (re.test(prop)) {
                        return store[prop];
                    }
                }

                return null;
            },
            
            findBy: function(key, value) {
                for (var prop in store) {
                    if (store[prop][key] === value) {
                        return store[prop];
                    }
                }

                return null;
            },
            
            exist: function(key) {
                return key in store;
            },
            
            each: function(callback) {
                for (var key in store) {
                    if (callback.call(store[key], key, store[key]) === false) {
                        return;
                    }
                }
            }
        }))();
    };
    
    var factory = function () {
        var __pid__ = 0;
        var newPid = function () { return ++__pid__; };
        
        var privFact = new ($.cls({
            main: function () {
                var self = this;
                $.extend(this, {
                    scriptCache: new cache(),
                    appCache: new cache(),
                    repository: {},
                    initialized: $.scriptRepository === false
                });

                if (!this.initialized)
                this.deferred =
                    $.getJSON($.scriptRepository)
                        .done(function(data) {
                            self.repository = data;
                            self.initialized = true;
                        })
                        .promise();
            },
            
            load: function (scriptName, args) {
                /// <summary>Loads a class or a reference to the specified instance</summary>
                /// <param name="scriptName" type="Object">The name of the class or a PID to an instantiated instance</param>
                /// <param name="args" type="Array">Arguments to pass to the contructor.</param>
                
                var self = this,
                    deferred = $.Deferred();

                //If we haven't finished loading the repository
                //defer the load request
                if (!this.initialized) {
                    return this.deferred = this.deferred
                        .always(
                            function() {
                                return self.load(scriptName, args);
                            }
                        );
                }

                //If it's a number, it's a pid.
                if (typeof scriptName == 'number') {
                    return this.appCache.value(scriptName);
                }
                
                //Check the instance cache for a singleton
                var app = this.appCache.findBy('__name__', scriptName);
                if (app != null && app.singleton === true) {
                    return deferred.resolve(app);
                } 

                //Make sure we know what we are asking for here
                if (!(scriptName in this.repository) &&
                    !this.scriptCache.exist(scriptName)) {
                        deferred.reject(scriptName, 'Script not found');
                }

                //Setup our deffered object and vars to contain the magic.
                var create = function() {
                        var cls = self.scriptCache.value(scriptName);
                        var instance = self.createInstance(scriptName, cls, args);
                        return deferred.resolve(scriptName, 'success', instance);
                    };
                
                //We already have it so call the trigger the done
                if (this.scriptCache.exist(scriptName)) {
                    return create();
                }

                var url = this.getScriptUrl(scriptName);
                if (typeof url == 'undefined' || url === false) {
                    return deferred.reject(scriptName, 'Not Found');
                }

                $.getScript(
                    url
                ).done(
                    function (script) {
                        var results = eval(script);
                        self.scriptCache
                            .add(scriptName, results);

                        return create();
                    }
                ).fail(
                    function(jqxhr, settings, exception) {
                        return deferred.reject(scriptName, exception);
                    }
                );

                return deferred;
            },
            
            store: function (scriptName, parent, prototype) {
                /// <summary>Caches a script by it's name</summary>
                /// <param name="scriptName" type="String">Unique script name</param>
                /// <param name="parent" type="String">Super Class to inherit from</param>
                /// <param name="prototype" type="Object">Prototype of class to be stored</param>

                var cls = $.cls(prototype, parent);
                
                //If the class is a singleton, create a new instance and store
                if (cls.prototype.singleton === true) {
                    var self = this;
                    $(function() {
                        self.createInstance(scriptName, cls);
                    });

                    return null;
                }

                return this
                    .scriptCache
                    .add(scriptName, cls);
            },
            
            createInstance: function (scriptName, cls, args) {
                /// <summary>Creates a new instance of the provided class.  Class is stored with PID.</summary>
                /// <param name="cls" type="Object">Class to instantiated</param>
                /// <param name="args" type="Array">An array of arguments for the constructor.</param>

                //recreate the constructor so we can
                //apply the arguments
                var ctor = function() { };
                ctor.prototype = cls.prototype;
                
                //Instantiate tmp constructor and assign pid
                var instance = new ctor();
                instance.__pid__ = newPid();
                instance.__name__ = scriptName;
                cls.apply(instance, args);
                
                //Store the instance for use later
                return this.appCache.add(instance.__pid__, instance);
            },
            
            getScriptUrl: function(scriptName) {
                return this.repository[scriptName];
            }
        }))();

        return function(scriptName, parent, prototype) {
            //Allowed values are string names and PIDs
            if (typeof scriptName != 'string' && typeof scriptName != 'number') {
                $.error('Script name must be provided');
            }

            //Insure a PID is an Int
            if ($.isNumeric(scriptName)) {
                scriptName = parseInt(scriptName);
            }

            if ((typeof parent == 'undefined' || typeof parent.splice == 'function')
                && typeof prototype == 'undefined') {
                //We are asking for a new instance of [scriptName]
                //Parent could be arguments for the new instance's constructor
                return privFact.load(scriptName, parent);
            }

            //If no prototype is provided assume the parent
            //is the prototype
            if (typeof prototype == 'undefined') {
                prototype = parent;
                parent = null;
            }

            //We are creating a new script to store.
            return privFact.store(scriptName, parent, prototype);
        };
    };
    
    //Create as singleton class
    $.extend({ factory: new factory() });
})(jQuery);
