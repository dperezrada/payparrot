// main.js using RequireJS 1.0.7
require.config({
    paths: {
        'jquery': 'libs/jquery/jquery.min',
        'underscore': 'libs/underscore.min', // AMD support
        'backbone': 'libs/backbone.min', // AMD support
        'templates': '../templates'
    }
});

require([
    'libs/ready.min', // optional, using RequireJS domReady plugin
    'app'
], function(domReady, app){
    domReady(function () {
        app.initialize();
    });
});