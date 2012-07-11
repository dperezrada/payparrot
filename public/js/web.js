// main.js using RequireJS 1.0.7
require.config({
    paths: {
        'jquery': 'libs/jquery/jquery.min',
        'underscore': 'libs/underscore.min', // AMD support
        'bootstrap': 'libs/bootstrap.min',
        'tojson': 'libs/jquery/tojson',
    }
});

require([
    'jquery',
    'bootstrap',
    'signup'
], function(domReady, $, app){
    $('#apply_btn').click(function(e){
		e.preventDefault();
		var name = $('#apply_form input[name="name"]').val();
		var email = $('#apply_form input[name="email"]').val();
		if(name.length && email.length){
			$.ajax({
				url: "/apply",
				type: "POST",
				contentType: "application/json",
				data: {
					'name': name,
					'email': email
				},
				data: JSON.stringify({
					'name': name,
					'email': email
				}),
				success: function() {
					console.log('ok');
					window.location = '/applied.html';
				},
				error: function() {
					alert('Error. Try later');
				    //called when there is an error
				}
			});
		}
		return false;
	});


	
});