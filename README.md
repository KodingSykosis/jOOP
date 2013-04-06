jOOP
==========

jQuery Object Oriented Programming

Examples
--

	var myClass = $.cls({
		main: function() {
			$('body').append('My App is loaded <br/>');
		}
	});

	var mySecondClass = $.cls({
		main: function() {
			this._super();
			$('body').append('My Second App is loaded <br/>');
		}
	}, myClass);

	var app = new mySecondClass();

---

	$.factory('myClass', {
        main: function () {
            $('body').append('My App is initializing\n');
        }
    });

    $.factory('secondClass', 'myClass', {
        main: function () {
            this._super();
            $('body').append('My Second App is initializing\n');
        },
        talk: function (name) {
            $('body').append('Hello ' + name + '\n');
        }
    });

    $.factory('shell', {
        singleton: true,
        main: function () {
            $('body').append('Initializing My Class\n');
            $.factory('myClass')
             .always($.proxy(this.appLoaded, this));

            $('body').append('\n\n');

            $('body').append('Initializing My Second Class\n');
            $.factory('secondClass')
             .always($.proxy(this.appLoaded, this));
        },
        appLoaded: function (scriptName, status, instance) {
            console.log(scriptName, status, instance);
            
            if (status == 'success') {
                $('body').append(scriptName + ' is loaded\n');
            }

            if (scriptName == 'secondClass' && status == 'success') {
                this.app2 = instance;
                this.app2.talk('John');
            }
        }
    });

Demo
--
$.cls&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<http://jsfiddle.net/kodingsykosis/PrQWu/><br/>
$.factory&nbsp;
<http://jsfiddle.net/kodingsykosis/PzHtw/>