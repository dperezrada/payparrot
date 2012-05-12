
/**
 * Module dependencies.
 */
var express     = require('express')
  , routes      = require('./routes')
  , accounts    = require('./routes/accounts');

var app = module.exports = express.createServer();
var Accounts = require('payparrot_models/objects/accounts.js');
//Authentication modules
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

//Defining the local strategy, may use more than one strategy, not sure how to accomplish that yet
passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    Accounts.authenticate(email, password, function(err, user) {
      return done(err, user);
    });
  }
));

//serialize account on login
passport.serializeUser(function(account, done) {
  done(null, account._id);
});


// deserialize account
passport.deserializeUser(function(id, done) {
  Accounts.findOne({_id: id}, function (err, account) {
    done(err, account);
  });
});

var mongoose = require('mongoose');
var mongo_url = require('payparrot_models/libs/mongodb').mongo_url({});
var db = mongoose.connect(mongo_url);

// Configuration
app.configure(function(){
  app.set("view options", { layout: false });
  app.set('views', __dirname + '/views');
  app.use(express.cookieParser());
  app.use(express.bodyParser());

  app.use(express.session({secret: 'payparrot FTW'}, function() {
    app.use(app.router);
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//Routes
require('./routes')(app);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
