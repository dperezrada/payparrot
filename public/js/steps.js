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
		current_step = 0;
		simple_url_validator = /(ftp|http|https):\/\/([_a-z\d\-]+(\.[_a-z\d\-]+)+)(([_a-z\d\-\\\.\/]+[_a-z\d\-\\\/])+)*/;
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
			$('.alert-error').hide();
			current_step--;
			current_step--;
			next_step();
		}

		function create_message(message, callback){
			$.ajax({
				url: "/accounts/"+window.account_id+"/messages",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify(message),
				success: function(data) {
					callback(null)
				},
				error: function(err) {
					callback(err);
				}
			});	
		}
		function update_account(account, callback){
			$.ajax({
				url: "/accounts/"+window.account_id,
				type: "PUT",
				contentType: "application/json",
				data: JSON.stringify(account),
				success: function(data) {
					callback(null)
				},
				error: function(err) {
					callback(err);
				}
			});	
		}		
		function create_messages(messages, callback){
			async.forEach(messages, create_message, callback);
		};

		function setup_account() {
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
		    	account: {
			    	logo_url: $('#form-data-logo input[name=url]').val(),
			    	callback_url: $('#form-data-notifications input[name=url1]').val()
		    	}
		    }
		    if($('#form-data-notifications input[name=url2]').length > 0){
		    	data['account']['notification_url'] = $('#form-data-notifications input[name=url2]').val();
		    }
		    

		    var errors = {
		    	0: {
		    		name: 'Messages',
		    		faults: [],
		    	},
		    	1: {
		    		name: 'Company Logo',
		    		faults: [],
		    	},
		    	2: {
		    		name: 'Notifications and redirect URLs',
		    		faults: [],
		    	},
		    };

		    // Test data
		    if (!simple_url_validator.test(data.messages[0].url) || !simple_url_validator.test(data.messages[1].url) || !simple_url_validator.test(data.messages[2].url)) {
		    	errors[0].faults.push('One of the urls that you specified is not a valid url');
		    }
		    if (data.messages[0].text.length > 120 || data.messages[1].text.length > 120 || data.messages[2].text.length > 120 || data.messages[0].text.length < 5 || data.messages[1].text.length < 5 || data.messages[2].text.length < 5) {
		    	errors[0].faults.push('The messages have more than 120 characters or less than 5 characters');
		    }		    
		    if (!simple_url_validator.test(data.account.logo_url)) {
		    	errors[1].faults.push('URL specified for your company logo is not a valid url');
		    }

		    var error_notifications = false;
			if (!simple_url_validator.test(data.account.callback_url)) {
				error_notifications = true;
		    }
		    if(data['account']['notification_url'] != undefined && !simple_url_validator.test(data.account.notification_url)){
		    	error_notifications = true;
		    }
		    if(error_notifications){
				errors[2].faults.push('One of the specified URLs for notiications is not valid');
		    }
		    if ((errors[0].faults.length+errors[1].faults.length+errors[2].faults.length)==0) {
		    	$('.btn-finish').attr('disabled',true);
		    	$('.btn-finish').html("<img src='/img/loading.gif' width=16>");
				$('.btn-back').attr('disabled',true);
				async.parallel([
						async.apply(create_messages, data.messages),
						async.apply(update_account, data.account),
					],
					function(err){
						if(err){
							alert('Something went wrong, please try again later.')
						}else{
							update_account({setup: true},function(err){
								console.log("holi");
								if (!err) {
									console.log("holi sin error");
									window.location = '/logged';
								} else {
									console.log(err);
									alert('Something went wrong, please try again later.')		
								}
							});
						}
					}
				);
				console.log(async);
		    } else {
		    	render_errors(errors);
		    }
		    
		}

		function render_errors(errors) {
			$('.alert-error').html("");
			for (i=0;i<3;i++) {
				if (errors[i].faults.length>0) {
					$('.alert-error').append("<h4>"+errors[i].name+"</h4>");
					$.each(errors[i].faults,function(k,v){
						$('.alert-error').append("<li>"+v+"</li>");
					});
				}
			}
			$('.alert-error').show();
		}

		$('.btn-next').click(next_step);
		$('.btn-back').click(back_step);
		$('.btn-finish').click(setup_account);

});