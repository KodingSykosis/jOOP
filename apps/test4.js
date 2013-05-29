(function($) {
    $(function() {
        var output = $('#output');
        function nativeJS() {
            output.append('I run native constructors\n');

            this.loud = function () {
                output.append('I CAN BE LOUD TOO!!!\n');
            };

            return {
                talk: function () {
                    output.append('I can speak.\n');
                }
            };
        }

        var myClass = $.cls({
            main: function () {
                this._super();
                output.append('My App is loaded\n');
            }
        }, nativeJS);

        var mySecondClass = $.cls({
            main: function () {
                this._super();
                output.append('My Second App is loaded\n');
            }
        }, myClass);

        output.append('Initializing My Class\n');
        var app1 = new myClass();

        output.append('\n\n');

        output.append('Initializing My Second Class\n');
        var app2 = new mySecondClass();

        output.append('\n\n');

        app2.talk();
        app2.loud();
    });
})(jQuery);