
var passport 	= require('passport');

var messages    = require('./routes/messages')
  , accounts    = require('./routes/accounts')
  , parrots     = require('./routes/parrots')
  , plans     = require('./routes/plans')
  , potential_users     = require('./routes/potential_users')
  , notifications     = require('./routes/notifications')
  , suscriptions     = require('./routes/suscriptions');



function req_auth(req, res, next) {
	var account_id = req.query.account_id;
	if(req.params && req.params.account_id){
		account_id = req.params.account_id;
	}

	if ( req.isAuthenticated() ) { 
		if(account_id){
			if(req.user._id == account_id || req.params.account_id=='me'){
				return next();
			}else{
				res.redirect('/forbidden');
			}
		}else{
			return next();
		} 
	}else{
		if(req.query.token && account_id){
			accounts.token_auth(req, res, next);
		}else{
			res.redirect('/login');
		}
	}
}

module.exports = function(app) {
	app.get('/', req_auth, accounts.login);
	app.get('/login', accounts.login);
	app.post('/login', passport.authenticate('local', 
    	{ 
      		successRedirect: '/logged', 
      		failureRedirect: '/login'
    	})
	);
	app.post('/signup', accounts.signup);

	app.get('/logout', function(req, res){
	    req.logOut();
		res.redirect('/');
	});
	app.get('/logged', req_auth, accounts.logged);
	
	app.put('/accounts/:account_id/password', req_auth, accounts.update_password);
	app.get('/accounts/:account_id/credentials', req_auth, accounts.get_credentials);
	
	//app.get('/accounts/:account_id/parrots', req_auth, parrots.get_parrots);
	app.get('/accounts/:account_id/parrots', req_auth, parrots.get_parrots);
	app.get('/accounts/:account_id/parrots/:parrot_id', req_auth, parrots.get_one);	
	app.delete('/accounts/:account_id/parrots/:parrot_id', req_auth, parrots.remove);	
	
	app.post('/accounts/:account_id/messages', req_auth, messages.create);
	app.get('/accounts/:account_id/messages', req_auth, messages.list);
	app.get('/accounts/:account_id/messages/:message_id', req_auth, messages.get);
	app.put('/accounts/:account_id/messages/:message_id', req_auth, messages.update);
	
	app.delete('/accounts/:account_id/plan', req_auth, plans.delete_plan);
	app.get('/accounts/:account_id/plan', req_auth, plans.get_account_plan);
	app.put('/accounts/:account_id/plan', req_auth, plans.update_plan);

	app.post('/saasy/:notification_type', plans.receive_saasy_notifications);


	app.get('/accounts/setup', req_auth, accounts.setup);
	app.post('/accounts/setup', req_auth, accounts.save_setup);

	app.get('/accounts/subscriptions', req_auth, accounts.subscriptions);

	app.post('/accounts', accounts.create);
	app.get('/accounts/:account_id', req_auth, accounts.get);
	app.put('/accounts/:account_id', req_auth, accounts.update);
	
	

	app.get('/parrots/start', parrots.start);
	app.get('/parrots/finish', parrots.finish);

	app.get('/r/:message_id_sqs', messages.route);
	
	app.post('/apply', potential_users.create);
	
	app.get('/accounts/:account_id/notifications/:notification_id', req_auth, notifications.get);
	
	app.get('/notifications/echo', notifications.echo);
	app.post('/notifications/echo', notifications.echo);

	// Errors

	app.get('/errors/:error_id', function(req,res){
		var available_errors = [404,504,503,500];
		var error_id = parseInt(req.params.error_id);
		if (available_errors.indexOf(error_id)==-1) {
			error_id = 500;
		}
		res.render(error_id+'.ejs', {layout: true});
	});
}