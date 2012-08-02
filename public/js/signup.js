// main.js using RequireJS 1.0.7
// require.config({
// 	paths: {
// 		'jquery': 'libs/jquery/jquery.min',
// 		'underscore': 'libs/underscore.min', // AMD support
// 		'bootstrap': 'libs/bootstrap.min',
// 		'tojson': 'libs/jquery/tojson',
// 	}
// });

require([
	'jquery',
	'bootstrap',
], function(domReady, $, app){
		var is_mail = /^[a-z][a-z-_0-9\.]+@[a-z-_=>0-9\.]+\.[a-z]{2,3}$/i;
		function create_account(a,b,c) {
			//a.preventDefault();
			var passed = true
			$.each($('#signup-form').serializeArray(),function(e,field){
				if (field.value=="") {
					alert("There are empty fields in the form");
					passed = false;
				}
				if (field.name=="email" && !is_mail.test(field.value)) {
					alert("Selected e-mail is not valid. Please try again");
					passed = false;
				}
			});
			// if (!passed) {
			// 	a.preventDefault();
			// }
			return passed;
		}
		$('#signup-form').submit(create_account);

});