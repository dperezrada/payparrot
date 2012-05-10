// main.js using RequireJS 1.0.7
require.config({
    paths: {
        'jquery': 'libs/jquery/jquery.min',
        'underscore': 'libs/underscore.min', // AMD support
        'backbone': 'libs/backbone.min', // AMD support
        'templates': '../templates',
        'bootstrap': 'libs/bootstrap.min',
        'tojson': 'libs/jquery/tojson',
        'ready': 'libs/ready.min'        
    }
});

require([
    'libs/ready.min', // optional, using RequireJS domReady plugin
    'jquery',
    'app'
], function(domReady, $, app){
    domReady(function () {
        app.initialize();
    });
});