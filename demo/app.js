
/**
 * Module dependencies.
 */
var express     = require('express')
var app = module.exports = express.createServer();
var request = require('request');

process.on('uncaughtException', function(err) {
  console.log(err);
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

  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
});


//Routes
function req_auth(req, res, next) {
  if (req.session.user && req.session.user._id) { 
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
    Users.findOne({email: req.body.email, password: password}, function(err, user) {
        if (user) {
          req.session.user = user;  
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
	res.send('hola');
    // Users.findOne({},function(err,user){
    //   req.user = user;
    //   if (req.isAuthenticated()) {
    //     console.log("authenticated");
    //     res.send("holi");
    //   } else {
    //     console.log("not");
    //     res.send("noli");
    //   }
    //   //res.redirect('/app');
    // });
});

app.get('/app', req_auth, function(req,res){
    if(!req.user.paid) {
      res.render('pay.ejs', {
        locals: {
          user: req.user
        }
      });
    } else {
      res.render("app.ejs");
      // res.render('app.ejs');
    }
});

app.get('/welcome', req_auth,function(req,res){
    var params = req.query;
    Users.findOne({_id: params.external_id}, function(err,user){
      if (user && req.session.user._id == params.external_id) {
        user.paid = true;
        user.external_id = params.external_id;
        user.subscription_id = params.subscription_id;
        user.save(function(){

          // Logear al usuario siesque no estuviese logeado
          req.user = user;
          
          // Renderear mensaje de bienvenida
          res.render("app.ejs");
        });
      } else {
        res.send("Error ocurred");
      }
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

        req.session.user = new_user; 
        res.redirect('/app');
	});
});

app.all('/notifications', function(req,res){
	console.log(req.body);
	res.send('OK');
});

app.listen(3001, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
