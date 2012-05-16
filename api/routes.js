
var passport 	= require('passport');

var messages    = require('./routes/messages')
  , accounts    = require('./routes/accounts')
  , parrots     = require('./routes/parrots');



function req_auth(req, res, next) {
  if ( req.isAuthenticated() ) { 
  	if(req.params.length > 0){
		if(req.user._id == req.params.account_id){
			return next();
		}else{
			res.redirect('/forbidden');
		}
	}else{
		return next();
	} 
  }else{
  	console.log(req.query);
  	if(req.query.token && req.query.account_id){
  		console.log(req.query);
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
	
	app.put('/accounts/:account_id/password', accounts.update_password);
	app.get('/accounts/:account_id/credentials', req_auth, accounts.get_credentials);
	
	//app.get('/accounts/:account_id/parrots', req_auth, parrots.get_parrots);
	app.get('/accounts/:account_id/parrots', parrots.get_parrots);
	
	app.post('/accounts/:account_id/messages', messages.create);
	app.get('/accounts/:account_id/messages', messages.list);
	app.get('/accounts/:account_id/messages/:message_id', messages.get);
	app.put('/accounts/:account_id/messages/:message_id', messages.update);
	
	app.post('/accounts', accounts.create);
	app.get('/accounts/:account_id', req_auth, accounts.get);
	app.put('/accounts/:account_id', req_auth, accounts.update);
	
	app.get('/parrots/start', parrots.start);
	app.get('/parrots/finish', parrots.finish);
}