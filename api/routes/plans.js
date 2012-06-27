var Accounts = require('payparrot_models/objects/accounts.js');
var Suscriptions = require('payparrot_models/objects/suscriptions.js');
var Plans = require('payparrot_models/objects/plans.js');
var AccountsPlans = require('payparrot_models/objects/accounts_plans.js');
var Plans = require('payparrot_models/objects/plans.js');
var SaasySubscriptions = require('payparrot_models/objects/saasy_subscriptions.js');
var SaasyNotifications = require('payparrot_models/objects/saasy_notifications.js');
var _ = require('underscore');
var crypto = require('crypto');
var async = require('async');
var request = require('request');
var ObjectId = require('mongoose').Types.ObjectId;

exports.update_plan = function(req,res) {

	var verify_payment_method = function(account,new_plan,callback) {
		if (new_plan.price=="tweet") {
			callback(null,account,new_plan);
		} else {
			SaasySubscriptions.findOne({account_id: account._id},function(err, saasy_subscription){
				if (err) callback(err);
				else {
					if (saasy_subscription) {
						// API Saasy change plan
						saasy_subscription.change_remote_subscription(new_plan,function(err,data){
							if (err) callback(err);
							else {
								callback(null, new_plan);	
							}
						})
					} else {
						// Redirect to saasy: first payment
						callback({redirect_url: new_plan.product_url});

					}
				}
			});			
		}
	}

	async.waterfall(
		[
			function(callback){Plans.findOne({name: req.body.name}, callback);},
			async.apply(verify_payment_method, req.user)
		],
		function(err, new_plan){
			if(err) {
				if (err.redirect_url) {
					res.send({redirect_url: err.redirect_url+'?referrer='+req.user._id});
				} else {
					res.throw_error(err, 503);	
				}
			}
			else { 
				change_plan(new_plan,req.user,function(err,data){
					if (!err) {
						res.send(data);
					}
				});
			}
		}
	);	
}

var change_plan = function(new_plan,account,callback) {
	var disable_account_plan = function(current_account_plan, new_account_plan, callback){
		if (current_account_plan) {
			current_account_plan.disable(function(err){callback(null, new_account_plan)});
		} else {
			callback(null, new_account_plan);
		}
	};
	async.parallel(
		{
			current_account_plan: function(callback){AccountsPlans.findOne({account_id: account._id, active:1}, callback);}
		},
		function(err, r){
			async.waterfall(
				[
					async.apply(AccountsPlans.create_from_plan, account, new_plan),
					async.apply(disable_account_plan, r.current_account_plan)
				],
				function(err, account_plan){
					console.log(account_plan);
					if(err) res.throw_error(err, 503);
					else callback(null,{"id": account_plan._id});
				}
			);
		}
	);
}
exports.get_account_plan = function(req,res) {
	AccountsPlans.findOne({account_id: req.params.account_id, active: true}, function (err, account_plan){
		if(err) res.throw_error(err, 503);
		else if(!account_plan) res.throw_error(null, 404);
		else {
			res.send(account_plan.returnJSON());
		}
	});
};
exports.delete_plan = function(req,res) {
	// TO DO:
	// If PayParrot, cancel account
	// If Saasy, cancel account

	AccountsPlans.findOne({account_id: req.params.account_id, active: true}, function (err, account_plan){
		if(err) res.throw_error(err, 503);
		else if(!account_plan) res.throw_error(null, 404);
		else {
			// res.send(account_plan.returnJSON());
			console.log(account_plan);
			account_plan.active = false;
			account_plan.save(function(err){
				if (err) res.throw_error(err, 503);
				else {
					res.statusCode = 204;
					res.send();
				}
			});
		}
	});
};

// Route: /saasy/:notification_type
exports.receive_saasy_notifications = function(req,res) {

	var notification = new SaasyNotifications({
		account_id: req.body.ReferenceId, 
		saasy_subscription_id: req.body.SubscriptionReference, 
		data: req.body, 
		type: req.params.notification_type
	});

	notification.save(function(err){
		if (err) res.throw_error(err, 503);
		else {
			if (req.params.notification_type == "subscription_activated") {
				// TO DO:
				// If PayParrot, deactivate;
				check_local_subscription_and_change_plan(req.body,function(err,data){
					if (err) res.throw_error(err,503);
					else {
						res.send(data);			
					}
				});
			}
		}
	});
	
}

var check_local_subscription_and_change_plan = function(notification_data,callback) {
	async.parallel(
		[
			function(callback){Plans.findOne({product_path: notification_data.ProductPath.substring(1)},callback);},
			function(callback){SaasySubscriptions.findOne({account_id: notification_data.ReferenceId, active:true},callback);},
			function(callback){Accounts.findOne({_id: notification_data.ReferenceId},callback);},
		],
		function(err, args) {
			var plan = args[0];
			var local_saasy_subscription = args[1];
			var account = args[2];
			if (plan && account && !err) {
				async.waterfall(
					[
						async.apply(new_local_saasy_subscription, notification_data),
						async.apply(deactivate_local_saasy_subscription, local_saasy_subscription),
						async.apply(change_plan, plan, account)
					],
					function(err,data){
						if (err) callback(err);
						else {
							change_plan(plan,account,function(err,data){
								callback(err,data);
							});
						}
					}
				);
			} else if(err) {
				callback(err);
			} else {
				callback('Missing data');
			}
		}
	);
}

var change_saasy_subscription = function(saasy_subscription,new_plan,callback) {
	var request_url = 'https://Administrator:headjocari@api.fastspring.com/company/payparrot/subscription/'+saasy_subscription.saasy_subscription_id;
	var body = '<subscription><no-end-date/><productPath>/'+new_plan.product_path+'</productPath><quantity>1</quantity><proration>true</proration></subscription>';
	request.put(
		{
			url: request_url,
			body: body,
			'Content-type': 'application/xml'
		},
		function (err, response_put, body) {
			if (err) callback(err);
			else callback(null,body);
		});
}

var deactivate_local_saasy_subscription = function(saasy_subscription,callback) {
		if (saasy_subscription) {
			saasy_subscription.active = false;
			saasy_subscription.save(function(err){
				if (err) callback(err);
				else {
					callback(null);	
				}
			});
		} else {
			callback(null);
		}
}

var new_local_saasy_subscription = function(notification_data,callback) {
	var new_saasy_subscription = new SaasySubscriptions({
		saasy_subscription_id: notification_data.SubscriptionReference,
		account_id: notification_data.ReferenceId,
		customer_url: notification_data.SusbcriptionCustomerUrl,
	});
	new_saasy_subscription.save(function(err){
		if (err) callback(err);
		else {
			callback(null);
		} 
	});		
}

