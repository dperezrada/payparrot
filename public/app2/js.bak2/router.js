// Filename: router.js
// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  paths: {
    jQuery: 'libs/jquery.min',
    Underscore: 'libs/underscore.min',
    Backbone: 'libs/backbone.min',
    templates: '../templates',
    bootstrap: 'libs/bootstrap.min',
    tojson: 'libs/tojson',
    ready: 'libs/ready.min'
  }
});


define([
  'ready',
  'jQuery',
  'Underscore',
  'Backbone',
  'objects/accounts/view',
  'bootstrap',
  'tojson'
], function(domReady,$, _, Backbone, accountView, bootstrap){
  domReady(function(){
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
});
