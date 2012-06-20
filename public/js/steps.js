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
    'bootstrap'
], function(domReady, $, app){
		current_step = 0;
		function next_step() {
			var id = current_step+1;
			var steps = {
				0: $('#setup-messages'),
				1: $('#setup-logo'),
				2: $('#setup-notifications')
			}
			$('.pane').hide();
			steps[id].show();
			$('.subnav ul.nav li').removeClass('active');
			$('.subnav ul.nav li:eq('+id+')').addClass('active');
			$('.progress .bar').css('width', (id+1)*25+'%');
			current_step++;
		}

		function back_step(){
			current_step--;
			current_step--;
			next_step();
		}

		function create_account() {
		    var data = {
		    	messages: [
		    		{
		    			text: $('#form-data-messages input[name=message1]').val(),
		    			url: $('#form-data-messages input[name=url1]').val()
		    		},
		    		{
		    			text: $('#form-data-messages input[name=message2]').val(),
		    			url: $('#form-data-messages input[name=url2]').val()
		    		},
		    		{
		    			text: $('#form-data-messages input[name=message3]').val(),
		    			url: $('#form-data-messages input[name=url3]').val()
		    		}		    				    		
		    	],
		    	logo: $('#form-data-logo input[name=url]').val(),
		    	notifications: {
		    		redirect: $('#form-data-notifications input[name=url1]').val(),
		    		notifications: $('#form-data-notifications input[name=url2]').val()
		    	}
		    }
		    console.log(data);
		  }



	  $('.btn-next').click(next_step);
	  $('.btn-back').click(back_step);
	  $('.btn-finish').click(create_account);

});