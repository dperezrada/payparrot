// main.js using RequireJS 1.0.7
require.config({
    paths: {
        'jQuery': 'libs/jquery/jquery.min',
        'underscore': 'libs/underscore.min', // AMD support
        'backbone': 'libs/backbone.min', // AMD support
    }
});

require([
    'libs/ready.min', // optional, using RequireJS domReady plugin
    'app2'
], function(domReady, app){
    domReady(function () {
        console.log("hola");
    });
});