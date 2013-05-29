(function ($) {
    $.factory('myClass', {
        main: function () {
            $('#output2').append('My App is initializing\n');
        }
    });

    $.factory('secondClass', 'myClass', {
        main: function () {
            this._super();
            $('#output2').append('My Second App is initializing\n');
        },
        talk: function (name) {
            $('#output2').append('Hello ' + name + '\n');
        }
    });

    $.factory('shell', {
        singleton: true,
        main: function () {
            $('#output2').append('Initializing My Class\n');
            $.factory('myClass')
             .always($.proxy(this.appLoaded, this));

            $('#output2').append('\n\n');

            $('#output2').append('Initializing My Second Class\n');
            $.factory('secondClass')
             .always($.proxy(this.appLoaded, this));
        },
        appLoaded: function (scriptName, status, instance) {
            console.log(scriptName, status, instance);
            
            if (status == 'success') {
                $('#output2').append(scriptName + ' is loaded\n');
            }

            if (scriptName == 'secondClass' && status == 'success') {
                this.app2 = instance;
                this.app2.talk('John');
            }
        }
    });
})(jQuery);