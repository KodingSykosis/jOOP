(function ($) {
    //This should load on document ready
    $.factory('shell', {
        singleton: true,
        
        //Entry point for all classes
        main: function () {
            var self = this;
            this.output = $('#output');
            this.writeLine('Document Loaded: ' + this.__pid__);

            $.factory('apps.test1', [this.output])
             .done(function(scriptName, status, script) {
                 console.log(scriptName, status, script);
             });
            
            $.factory('apps.test2', [this.output])
             .done(function (scriptName, status, script) {
                 console.log(scriptName, status, script);
             });
        },
        
        writeLine: function(message) {
            this.output
                .append(message + '\n');
        }
    });
})(jQuery);