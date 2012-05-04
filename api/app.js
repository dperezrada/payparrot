
/**
 * Module dependencies.
 */

var express = require('express')
  , accounts = require('./routes/accounts')
  , messages = require('./routes/messages');

var app = module.exports = express.createServer();

// Middlewares
function mongo_middleware(req, res, next){
	var create_mongo_url = require('./libs/mongodb');
	req.mongo_url = create_mongo_url({});
	next();
}
//Conexion Mongoose
var mongoose = require('mongoose');
var generate_mongo_url = require('./libs/mongodb');
var mongo_url = generate_mongo_url({});
db = mongoose.connect(mongo_url),

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.use(mongo_middleware);
  app.use(express.bodyParser());

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

app.post('/accounts', accounts.create);
app.get('/accounts/:id', accounts.get);
app.post('/accounts/:id/messages', messages.create);
app.get('/accounts/:id/messages/:message_id', messages.get);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
