
var passport 	= require('passport');

var messages    = require('./routes/messages')
  , accounts    = require('./routes/accounts')
  , parrots     = require('./routes/parrots')
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
	app.get('/logout', function(req, res){
	    req.logOut();
		res.redirect('/');
	});
	app.get('/logged', req_auth, accounts.logged);
	
	app.put('/accounts/:account_id/password', req_auth, accounts.update_password);
	app.get('/accounts/:account_id/credentials', req_auth, accounts.get_credentials);
	
	//app.get('/accounts/:account_id/parrots', req_auth, parrots.get_parrots);
	app.get('/accounts/:account_id/parrots', parrots.get_parrots);
	
	app.post('/accounts/:account_id/messages', req_auth, messages.create);
	app.get('/accounts/:account_id/messages', req_auth, messages.list);
	app.get('/accounts/:account_id/messages/:message_id', req_auth, messages.get);
	app.put('/accounts/:account_id/messages/:message_id', req_auth, messages.update);
	
	app.post('/accounts', accounts.create);
	app.get('/accounts/:account_id', req_auth, accounts.get);
	app.put('/accounts/:account_id', req_auth, accounts.update);
	
	app.get('/parrots/start', parrots.start);
	app.get('/parrots/finish', parrots.finish);

	app.get('/r/:message_id_sqs', messages.route);
	
	app.post('/apply', potential_users.create);


	app.get('/accounts/:account_id/notifications/:notification_id', req_auth, notifications.get);
}