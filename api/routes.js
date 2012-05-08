
var passport 	= require('passport');

var messages    = require('./routes/messages')
  , accounts    = require('./routes/accounts')
  , parrots     = require('./routes/parrots');

function req_auth(req, res, next) {
  if ( req.isAuthenticated() ) { 
  	return next(); 
  }else{
  	res.redirect('/login');
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
	app.get('/accounts/:account_id/credentials', req_auth, accounts.get_credentials);
	app.post('/accounts/:account_id/messages', req_auth, messages.create);
	app.get('/accounts/:account_id/messages/:message_id', req_auth, messages.get);
	app.post('/accounts', accounts.create);
	app.get('/accounts/:account_id', req_auth, accounts.get);
	app.put('/accounts/:account_id', req_auth, accounts.update);
	app.get('/parrots/start', parrots.start);
	app.get('/parrots/finish', parrots.finish);
}