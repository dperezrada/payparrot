
var passport 	= require('passport');

var messages    = require('./routes/messages')
  , accounts    = require('./routes/accounts')
  , parrots     = require('./routes/parrots');

function reqAuth(req, res, next) {
  if ( req.isAuthenticated() ) { 
  	return next(); 
  }else{
  	res.redirect('/login');
  }
}

module.exports = function(app) {
	app.get('/', reqAuth, accounts.login);
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
  app.get('/logged', reqAuth, accounts.logged);
  app.put('/accounts/:account_id/password', accounts.update_password);
	app.get('/accounts/:account_id/credentials', accounts.get_credentials);
	app.post('/accounts/:account_id/messages', messages.create);
	app.get('/accounts/:account_id/messages/:message_id', messages.get);
	app.post('/accounts', accounts.create);
	app.get('/accounts/:account_id', accounts.get);
	app.put('/accounts/:account_id', accounts.update);
  app.get('/parrots/start', parrots.start);
  app.get('/parrots/finish', parrots.finish);
}