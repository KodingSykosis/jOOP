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

Demo
--
$.cls&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<http://jsfiddle.net/kodingsykosis/PrQWu/><br/>
$.factory&nbsp;
<http://jsfiddle.net/kodingsykosis/PzHtw/>