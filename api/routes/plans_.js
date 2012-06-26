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

var ObjectId = require('mongoose').Types.ObjectId;

exports.update_plan = function(req,res) {

	var get_plan = function(account, callback){
		Plans.findOne({name: req.body.name}, function(err,plan){
			if(err || !plan) callback(err, null);
			else {
				callback(null, account, plan);
			}
		});	
	};

	var verify_payment_method = function(account,plan,callback) {

		if (plan.price=="tweet") {
			// PayParrot magic
			callback(null,account,plan);
		} else {
			SaasySubscriptions.findOne({account_id: account._id},function(err, saasy_subscription){
				if (err) callback(err);
				else {
					if (saasy_subscription) {

						// API Saasy change plan
						callback(null, account, plan);

					} else {
						
						// Redirect to saasy: first payment
						callback({redirect_url: plan.product_url});

					}
				}
			});			
		}
	}

	async.waterfall(
		[
			async.apply(get_plan, req.user),
			verify_payment_method
		],
		function(err, account_plan){
			if(err) {
				if (err.redirect_url) {
					res.send({redirect_url: err.redirect_url+'?referrer='+req.user._id});
				} else {
					res.throw_error(err, 503);	
				}
			}
			else { 
				change_plan(plan,req.user,function(err,data){
					if (!err) {
						res.send(data);
					}
				});
			}
		}
	);	
}

var change_plan = function(new_plan,account,cb) {

	var get_current_plan = function(account, callback){
		AccountsPlans.findOne({account_id: account._id, active:1}, callback);
	}

	var create_account_plan = function(account, new_plan, current_account_plan, callback){
		console.log("1");
		var plan_data = new_plan.toJSON();
		delete plan_data._id;
		plan_data['active'] = true;
		plan_data['account_id'] = account._id;
		var new_account_plan = new AccountsPlans(plan_data);
		new_account_plan.save(function(err){
			if(err) callback(err);
			else {
				callback(null, current_account_plan, new_account_plan);
			}
		});
	};
	var update_account_plan = function(current_account_plan, new_account_plan, callback){
		if (current_account_plan) {
			current_account_plan.active = false;
			current_account_plan.save(function(err){
				if (err) calback(err);
				else callback(null, new_account_plan);
			});
		} else {
			callback(null, new_account_plan);
		}						
	};
	async.waterfall(
		[
			async.apply(get_current_plan, account),
			async.apply(create_account_plan, account, new_plan),
			update_account_plan
		],
		function(err, account_plan){
			if(err) {
				res.throw_error(err, 503);
			}
			else { 
				cb(null,{"id": account_plan._id});
			}
		}
	);
}
exports.get_plan = function(req,res) {
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
exports.notifications = function(req,res) {

	// TO DO:
	// Validate security hash


	var new_subscription = function(plan,callback) {
		console.log("asd");
		var new_subscription = new SaasySubscriptions({
			saasy_subscription_id: req.body.SubscriptionReference,
			product_path: req.body.ProductPath.substring(1),
			account_id: req.body.ReferenceId,
		});
		new_subscription.save(function(err){
			if (!err) {
				Accounts.findOne({_id: req.body.ReferenceId},function(err,account){
					change_plan(plan,account,function(err,data){
						console.log("a");
						callback(err,data);
					});
				});
			}
		});		
	}

	var notification = new SaasyNotifications({
		account_id: req.body.ReferenceId, 
		saasy_subscription_id: req.body.SubscriptionReference, 
		data: req.body, 
		type: req.params.notification_type
	});

	notification.save(function(err){
		if (!err) {

			if (req.params.notification_type == "subscription_activated") {
				// TO DO:
				// If PayParrot, deactivate;

				Plans.findOne({product_path: req.body.ProductPath.substring(1)}, function(err,plan){
					if (plan) {
						SaasySubscriptions.findOne({account_id: req.body.ReferenceId, active:true},function(err,saasy_subscription){
							if (!err) {
								if (saasy_subscription) {
									saasy_subscription.active = false;
									saasy_subscription.save(function(err){
										if (!err) {
											new_subscription(plan,function(err,data){
												if (!err) {
													res.send(data);
												}
											});												
										}
									});
								} else {
									new_subscription(plan,function(err,data){
										if (!err) {
											res.send(data);
										}
									});	
								}
							} else {
								res.throw_error(err, 503);
							}
						});
					}
				});
			}
		}
	});
}
