
/**
 * Module dependencies.
 */

var express = require('express')
  , accounts = require('./routes/accounts')
  , messages = require('./routes/messages')
  , parrots = require('./routes/parrots');

var app = module.exports = express.createServer();

//Conexion Mongoose
var mongoose = require('mongoose');
var mongo_url = require('./libs/mongodb').mongo_url({});
var db = mongoose.connect(mongo_url);

// Configuration
var config_middleware = function(req, res, next){
	req.twitter_config = {
		'request_token_url': 'https://api.twitter.com/oauth/request_token',
		'authorize_url': 'https://api.twitter.com/oauth/authorize',
		'access_token_url': 'https://api.twitter.com/oauth/access_token',
		'callback_url': 'http://test.payparrot.com/parrots/finish',
		'consumer_key': 'lFkPrTmvjcSUD5JtrOvg',
		'consumer_secret': 'sCxLuVAd1HnGIjdolKUqAjZaSOO7BGhViD1a7w',
		'version': '1.0',
		'signature': 'HMAC-SHA1'
	};
	next();
};

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.use(express.bodyParser());
	app.use(config_middleware);
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/accounts/:account_id/credentials', accounts.get_credentials);
app.post('/accounts/:account_id/messages', messages.create);
app.get('/accounts/:account_id/messages/:message_id', messages.get);
app.post('/accounts', accounts.create);
app.get('/accounts/:account_id', accounts.get);
app.put('/accounts/:account_id', accounts.update);
app.get('/parrots/start', parrots.start);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
