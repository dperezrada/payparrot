// main.js using RequireJS 1.0.7
require.config({
    paths: {
        'jquery': 'libs/jquery/jquery.min',
        'underscore': 'libs/underscore.min', // AMD support
        'bootstrap': 'libs/bootstrap.min',
        'tojson': 'libs/jquery/tojson',
        'async': 'libs/async',
    }
});

require([
    'jquery',
    'bootstrap',
    'async'
], function(domReady, $, app){
		
		function create_message(message, callback){
			$.ajax({
				url: "/accounts/"+window.account_id+"/messages",
				type: "POST",
				dataType: "json",
				data: message,
				success: function(data) {
					callback(null)
				},
				error: function(err) {
					callback(err);
				}
			});	
		}
		function update_account(new_plan, callback){
			$('button[data='+new_plan+']').html('<img src="/img/loading.gif" width=16>');
			$.ajax({
				url: "/accounts/"+window.account_id+"/plan",
				type: "PUT",
				dataType: "json",
				data: {
					"name": new_plan
				},
				success: function(data) {
					callback(null, data);
				},
				error: function(err) {
					callback(err);
				}
			});	
		}

		function render_set_plan(plan) {
			if (!plan) {
				$("#current-plan").html("<strong>You don't have any plan yet</strong>");
			} else {
				$("#current-plan").html("<strong>"+plan.name+"</strong>");
			}
			$('button').attr('disabled',false);
			$('button').addClass('btn-success');
			$('button').html('Buy now');
			$('button[data='+plan.name+']').attr('disabled',true);
			$('button[data='+plan.name+']').removeClass('btn-success');
			$('button[data='+plan.name+']').html('Current');
		}

		function fetch_plan() {
			$.ajax({
				url: "/accounts/"+window.account_id+"/plan",
				type: "GET",
				success: function(data) {
					render_set_plan(data);
				},
				error: function(err) {
					render_set_plan(null);
				}
			});	
		}

		function set_plan(ev) {
			var plan = $(ev.target).attr('data');
			update_account(plan, function(err,data){
				fetch_plan();
			});

		}

		fetch_plan();
		$('.btn-set-plan').click(set_plan);

});