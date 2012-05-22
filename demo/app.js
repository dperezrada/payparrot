
/**
 * Module dependencies.
 */
var express     = require('express')
var app = module.exports = express.createServer();
//Authentication modules
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

//Defining the local strategy, may use more than one strategy, not sure how to accomplish that yet
passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    // Users.authenticate(email, password, function(err, user) {
    //   console.log(user);
    //   return done(err, user);
    // });
    Users.findOne({email: email}, function(err, user) {
      return done(err, user);
    });
  }
));

//serialize account on login
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
// deserialize account
passport.deserializeUser(function(id, done) {
  Users.findOne({_id: id}, function (err, user) {
    done(err, user);
  });
});


// Models
var mongoose = require('mongoose');
var crypto = require('crypto');
var db = mongoose.connect('mongodb://localhost:27017/demo'),
    Schema = mongoose.Schema,
    _ = require('underscore');
  //returnJSON = require('./utils').returnJSON;

var Users_schema = new Schema({
  name: String,
  email: String,
  password: String,
  paid: Boolean
});

mongoose.model('Users', Users_schema);
var Users = mongoose.model('Users');


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


//Routes
function req_auth(req, res, next) {
  if (req.session.user._id) { 
    req.user = req.session.user;
    console.log("authenticated");
    if(req.params && req.params.account_id){
    if(req.user._id == req.params.account_id || req.params.account_id=='me'){
      return next();
    }else{
      res.redirect('/forbidden');
    }
  }else{
    return next();
  } 
  }else{
    if(req.query.token && req.query.account_id){
      console.log(req.query);
      accounts.token_auth(req, res, next);
    }else{
      res.redirect('/login');
    }
  }
}

app.get('/', req_auth, function(req,res){
  res.render('logged.ejs');
});
app.get('/login', function(req,res){
  res.render('login.ejs');
});

app.post('/login', function(req,res) {
  if (req.body.email && req.body.password) {
    var password = crypto.createHash('sha1').update(req.body.password).digest('hex');
    console.log(password);
    Users.findOne({email: req.body.email, password: password}, function(err, user) {
        //console.log("123");
        if (user) {
          //console.log(user);
          req.session.user = user;  
          console.log(req.session.user);
          res.redirect('/app');
        } else {
          res.redirect('/login');
        }
        
    });    
  } else {
    console.log("nooo");
  }
});

app.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
});

app.get('/loginfake', function(req, res){
    Users.findOne({},function(err,user){
      req.user = user;
      if (req.isAuthenticated()) {
        console.log("authenticated");
        res.send("holi");
      } else {
        console.log("not");
        res.send("noli");
      }
      //res.redirect('/app');
    });
});

app.get('/app', req_auth, function(req,res){
    if(!req.user.paid) {
      res.render('pay.ejs', {
        locals: {
          user: req.user
        }
      });
    } else {
      console.log(req.body);
      res.render("app.ejs");
      // res.render('app.ejs');
    }
});

app.get('/welcome', function(req,res){
    var params = req.body;
    Users.findOne({_id: params.external_id}, function(err,user){
      if (!user) {
        res.send("Error ocurred");
      }
      user.paid = true;
      user.save(function(){

        // Logear al usuario siesque no estuviese logeado
        req.user = user;
        
        // Renderear mensaje de bienvenida
        res.render("welcome.ejs");
      });
    });
});

app.post('/new', function(req,res){
  //var potential_user = new PotentialUsers();
  var new_user = new Users();
  new_user.name = req.body.name;
  new_user.email = req.body.email;
  new_user.password = req.body.password;
  new_user.password = crypto.createHash('sha1').update(req.body.password).digest('hex');
  new_user.paid = false;
  new_user.save(function(){
    res.statusCode = 201;
    res.send({id: new_user._id});
  });
});

app.listen(3001, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
