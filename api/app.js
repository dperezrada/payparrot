
/**
 * Module dependencies.
 */

var express = require('express')
  , accounts = require('./routes/accounts')
  , messages = require('./routes/messages');

var app = module.exports = express.createServer();

//Conexion Mongoose
var mongoose = require('mongoose');
var mongo_url = require('./libs/mongodb').mongo_url({});
var db = mongoose.connect(mongo_url);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
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


app.get('/accounts/:account_id/credentials', accounts.get_credentials);
app.post('/accounts/:account_id/messages', messages.create);
app.get('/accounts/:account_id/messages/:message_id', messages.get);
app.post('/accounts', accounts.create);
app.get('/accounts/:account_id', accounts.get);
app.put('/accounts/:account_id', accounts.update);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
