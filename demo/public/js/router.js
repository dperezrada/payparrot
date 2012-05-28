// Filename: router.js
// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    loader: 'libs/backbone/loader',
    jQuery: 'libs/jquery/jquery',
    Underscore: 'libs/underscore/underscore',
    Backbone: 'libs/backbone/backbone',
    templates: '../templates',
    bootstrap: 'bootstrap',
    tojson: 'libs/jquery/tojson_loader'
  }
});


define([
  'jQuery',
  'Underscore',
  'Backbone',
  'objects/accounts/view',
  'bootstrap',
  'tojson',
], function($, _, Backbone, accountView, bootstrap, tojson ){
  var AppRouter = Backbone.Router.extend({
    routes: {
      '/projects': 'showProjects',
    },
    showProjects: function(){
      // Call render on the module we loaded in via the dependency array
      // 'views/projects/list'
      accountView.render();
    },
    defaultAction: function(actions){
      // We have no matching route, lets display the home page 
      accountView.render(); 
    }
  });

	var app_router = new AppRouter;
	Backbone.history.start();
	//accountView.render();
});
