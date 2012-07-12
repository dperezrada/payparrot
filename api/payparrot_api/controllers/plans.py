# -*- coding: utf-8 -*-
import os, sys
from bottle import route, request, response, static_file, SimpleTemplate, template, view, redirect
from bson.objectid import ObjectId

from payparrot_api.libs.exceptions import UnauthorizeException
from payparrot_dal import Accounts, AccountsSessions, Plans, AccountsPlans

# db.plans.insert({'name':'social','price':'tweet','parrots':'25','product_path':'','product_url':''})
# db.plans.insert({'name':'standard','price':'25','parrots':'300','product_path':'pp-standard','product_url':'https://sites.fastspring.com/payparrot/instant/pp-standard'})
# db.plans.insert({'name':'pro','price':'25','parrots':'500','product_path':'pp-pro','product_url':'https://sites.fastspring.com/payparrot/instant/pp-pro'})
# db.plans.insert({'name':'premium','price':'25','parrots':'1000','product_path':'pp-premium','product_url':'https://sites.fastspring.com/payparrot/instant/pp-premium'})

@route('/accounts/:account_id/plan', method="GET")
def callback(account_id, db, secure=True):
	account_plan = AccountsPlans.findOne(db, {'account_id': ObjectId(account_id), 'active': True})
	if account_plan:
		return account_plan.JSON()

@route('/accounts/:account_id/plan', method="DELETE")
def callback():
    return static_file('login.html', os.path.join(os.path.abspath(os.path.dirname(__file__)), '../../../public/'))

@route('/accounts/:account_id/plan', method="PUT")
def callback(account_id, db, secure=True):
    new_plan = Plans.findOne(db, {'name':request.json.get("name")})
    if new_plan:
    	#Verify payment method
    	account = Accounts.findOne(db, account_id)
    	new_account_plan = change_plan(db,new_plan,account)
    	if new_account_plan:
    		return {"id":str(new_account_plan.id)}

def change_plan(db,new_plan,account):
	current_account_plan = AccountsPlans.findOne(db, {'account_id': account.id, 'active': True})
	if current_account_plan:
		current_account_plan.disable()
	new_account_plan = AccountsPlans.create_from_plan(db,account.JSON(),new_plan.JSON())
	return new_account_plan


# app.delete('/accounts/:account_id/plan', req_auth, plans.delete_plan);
# 	app.get('/accounts/:account_id/plan', req_auth, plans.get_account_plan);
# 	app.put('/accounts/:account_id/plan', req_auth, plans.update_plan);

# exports.update_plan = function(req,res) {

# 	var verify_payment_method = function(account,new_plan,callback) {
# 		if (new_plan.price=="tweet") {
# 			SaasySubscriptions.findOne({account_id: account._id, active:true},function(err, saasy_subscription){
# 				if (err) callback(err);
# 				else {
# 					if (saasy_subscription) {
# 						// API Saasy change plan
# 						saasy_subscription.cancel_remote_subscription(function(err,data){
# 							if (err) callback(err);
# 							else {
# 								deactivate_local_saasy_subscription(saasy_subscription,function(err){
# 									callback(err,new_plan);	
# 								})
# 							}
# 						})
# 					} else {
# 						// Redirect to saasy: first payment
# 						callback(null,new_plan);

# 					}
# 				}

# 				// PayParrot magic
# 			});
# 		} else {
# 			SaasySubscriptions.findOne({account_id: account._id, active:true},function(err, saasy_subscription){
# 				if (err) callback(err);
# 				else {
# 					if (saasy_subscription) {
# 						// API Saasy change plan
# 						saasy_subscription.change_remote_subscription(new_plan,function(err,data){
# 							if (err) callback(err);
# 							else {
# 								callback(null, new_plan);	
# 							}
# 						})
# 					} else {
# 						// Redirect to saasy: first payment
# 						callback({redirect_url: new_plan.product_url});

# 					}
# 				}
# 			});			
# 		}
# 	}

# 	async.waterfall(
# 		[
# 			function(callback){Plans.findOne({name: req.body.name}, callback);},
# 			async.apply(verify_payment_method, req.user)
# 		],
# 		function(err, new_plan){
# 			if(err) {
# 				if (err.redirect_url) {
# 					res.send({redirect_url: err.redirect_url+'?referrer='+req.user._id});
# 				} else {
# 					res.throw_error(err, 503);	
# 				}
# 			}
# 			else { 
# 				change_plan(new_plan,req.user,function(err,data){
# 					if (!err) {
# 						res.send(data);
# 					}
# 				});
# 			}
# 		}
# 	);	
# }

# var change_plan = function(new_plan,account,callback) {
# 	async.parallel(
# 		{
# 			current_account_plan: function(callback){AccountsPlans.findOne({account_id: account._id, active:true}, callback);}
# 		},
# 		function(err, r){
# 			console.log("change_plan");
# 			async.waterfall(
# 				[
# 					async.apply(disable_account_plan, r.current_account_plan),
# 					async.apply(AccountsPlans.create_from_plan, account, new_plan)
# 				],
# 				function(err, account_plan){
# 					if(err) res.throw_error(err, 503);
# 					else callback(null,{"id": account_plan._id});
# 				}
# 			);
# 		}
# 	);
# }
# exports.get_account_plan = function(req,res) {
# 	AccountsPlans.findOne({account_id: req.params.account_id, active: true}, function (err, account_plan){
# 		if(err) res.throw_error(err, 503);
# 		else if(!account_plan) res.throw_error(null, 404);
# 		else {
# 			res.send(account_plan.returnJSON());
# 		}
# 	});
# };
# exports.delete_plan = function(req,res) {
# 	// TO DO:
# 	// If PayParrot, cancel account
# 	// If Saasy, cancel account
# 	async.parallel([
# 			function(callback){AccountsPlans.findOne({account_id: req.user._id, active:true},callback);},
# 			function(callback){SaasySubscriptions.findOne({account_id: req.user._id, active:true},callback);}
# 		],
# 		function(err,r){
# 			account_plan = r[0];
# 			local_saasy_subscription = r[1];
# 			if (err) res.throw_error(err, 503);
# 			else {
# 				if (local_saasy_subscription) {
# 					async.waterfall(
# 						[
# 							//async.apply(local_saasy_subscription.cancel_remote_subscription),
# 							async.apply(cancel_remote_saasy_subscription,local_saasy_subscription.saasy_subscription_id),
# 							async.apply(deactivate_local_saasy_subscription,local_saasy_subscription),
# 							async.apply(disable_account_plan, account_plan)
# 						],
# 						function(err,data) {
# 							if (err) res.throw_error(err, 503);
# 							else {
# 								res.statusCode = 204;
# 								res.send();
# 							}
# 						}
# 					);					
# 				}
# 				else {
# 					async.waterfall(
# 						[
# 							async.apply(disable_account_plan, account_plan)

# 						],
# 						function(err,data) {
# 							if (err) res.throw_error(err, 503);
# 							else {
# 								res.statusCode = 204;
# 								res.send();
# 							}
# 						}
# 					);					
# 				}	
# 			}		
# 		}
# 	);
# };

# // Route: /saasy/:notification_type
# exports.receive_saasy_notifications = function(req,res) {

# 	var notification = new SaasyNotifications({
# 		account_id: req.body.ReferenceId, 
# 		saasy_subscription_id: req.body.SubscriptionReference, 
# 		data: req.body, 
# 		type: req.params.notification_type
# 	});

# 	notification.save(function(err){
# 		if (err) res.throw_error(err, 503);
# 		else {
# 			if (req.params.notification_type == "subscription_activated") {
# 				// TO DO:
# 				// If PayParrot, deactivate;
# 				check_local_subscription_and_change_plan(req.body,function(err,data){
# 					if (err) res.throw_error(err,503);
# 					else {
# 						res.send(data);			
# 					}
# 				});
# 			}
# 			if (req.params.notification_type == "subscription_changed" && req.body.SubscriptionEndDate != "") {
# 				check_local_subscription_and_deactivate_plan(req.body,function(err,data){
# 					if (err) res.throw_error(err,503);
# 					else {
# 						res.send(data);			
# 					}
# 				});
# 			}			
# 		}
# 	});
	
# }

# var check_local_subscription_and_change_plan = function(notification_data,callback) {
# 	async.parallel(
# 		[
# 			function(callback){Plans.findOne({product_path: notification_data.ProductPath.substring(1)},callback);},
# 			function(callback){SaasySubscriptions.findOne({account_id: notification_data.ReferenceId, active:true},callback);},
# 			function(callback){Accounts.findOne({_id: notification_data.ReferenceId},callback);},
# 		],
# 		function(err, args) {
# 			var plan = args[0];
# 			var local_saasy_subscription = args[1];
# 			var account = args[2];
# 			if (plan && account && !err) {
# 				async.waterfall(
# 					[
# 						async.apply(new_local_saasy_subscription, notification_data),
# 						async.apply(deactivate_local_saasy_subscription, local_saasy_subscription),
# 						async.apply(change_plan, plan, account)
# 					],
# 					function(err,data){
# 						if (err) callback(err);
# 						else {
# 							change_plan(plan,account,function(err,data){
# 								callback(err,data);
# 							});
# 						}
# 					}
# 				);
# 			} else if(err) {
# 				callback(err);
# 			} else {
# 				callback('Missing data');
# 			}
# 		}
# 	);
# }

# var check_local_subscription_and_deactivate_plan = function(notification_data,callback) {
# 	async.parallel(
# 		[
# 			function(callback){SaasySubscriptions.findOne({account_id: notification_data.ReferenceId, active:true},callback);},
# 			function(callback){Accounts.findOne({_id: notification_data.ReferenceId},callback);},
# 			function(callback){AccountsPlans.findOne({account_id: notification_data.ReferenceId, active:true},callback);}
# 		],
# 		function(err, args) {
# 			var local_saasy_subscription = args[0];
# 			var account = args[1];
# 			var account_plan = args[2];
# 			if (local_saasy_subscription && account && account_plan && !err) {
# 				console.log("Vamos a cancelar");
# 				async.waterfall(
# 					[	
# 						async.apply(deactivate_local_saasy_subscription, local_saasy_subscription),
# 						async.apply(disable_account_plan, null, account_plan)
# 					],
# 					function(err,data){
# 						if (err) callback(err);
# 						else {
# 							callback(err,data);
# 						}
# 					}
# 				);
# 			} else if(err) {
# 				callback(err);
# 			} else {
# 				callback('Missing data');
# 			}
# 		}
# 	);
# }

# var change_saasy_subscription = function(saasy_subscription,new_plan,callback) {
# 	var request_url = 'https://Administrator:headjocari@api.fastspring.com/company/payparrot/subscription/'+saasy_subscription.saasy_subscription_id;
# 	var body = '<subscription><no-end-date/><productPath>/'+new_plan.product_path+'</productPath><quantity>1</quantity><proration>true</proration></subscription>';
# 	request.put(
# 		{
# 			url: request_url,
# 			body: body,
# 			'Content-type': 'application/xml'
# 		},
# 		function (err, response_put, body) {
# 			if (err) callback(err);
# 			else callback(null,body);
# 		});
# }

# var deactivate_local_saasy_subscription = function(saasy_subscription,callback) {
# 	console.log("deact local");
# 	console.log(saasy_subscription);
# 	if (saasy_subscription) {
# 		saasy_subscription.active = false;
# 		saasy_subscription.save(function(err){
# 			if (err) callback(err);
# 			else {
# 				callback(null);	
# 			}
# 		});
# 	} else {
# 		callback(null);
# 	}
# }

# var new_local_saasy_subscription = function(notification_data,callback) {
# 	var new_saasy_subscription = new SaasySubscriptions({
# 		saasy_subscription_id: notification_data.SubscriptionReference,
# 		account_id: notification_data.ReferenceId,
# 		customer_url: notification_data.SubscriptionCustomerUrl,
# 	});
# 	new_saasy_subscription.save(function(err){
# 		if (err) callback(err);
# 		else {
# 			callback(null);
# 		} 
# 	});		
# }

# var disable_account_plan = function(current_account_plan, callback){
# 	console.log("disable_account_plan");
# 	console.log(current_account_plan);
# 	if (current_account_plan) {
# 		current_account_plan.disable(function(err){callback(null)});
# 	} else {
# 		callback(null);
# 	}
# }

# var cancel_remote_saasy_subscription = function(saasy_subscription_id, callback) {
# 	console.log("cancelling remote");
# 	var request_url = 'https://Administrator:headjocari@api.fastspring.com/company/payparrot/subscription/'+saasy_subscription_id;
# 	request(
# 		{
# 			url: request_url,
# 			method: 'delete'
# 		},
# 		function (err, response_put, body) {
# 			if (err) callback(err);
# 			else callback(null);
# 		});	
# }

