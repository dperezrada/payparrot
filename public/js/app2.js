// app.js
define([
    'jQuery', 
    'underscore',
    'backbone',
	'libs/jquery/tojson'
], function($, _, Backbone){
    return {
        initialize: function(){
			$('body').append('chao');
			console.log($('#hola').toJSON());
            // you can use $, _ or Backbone here
        }
    };
});