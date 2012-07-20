// main.js using RequireJS 1.0.7
require.config({
    paths: {
        'jquery': 'libs/jquery/jquery.min',
        'underscore': 'libs/underscore.min', // AMD support
        'bootstrap': 'libs/bootstrap.min',
        'tojson': 'libs/jquery/tojson',
    }
});

require([
    'jquery',
    'bootstrap',
    'signup'
], function(domReady, $, app){
    $(document).ready(
      function(){
        $("#join").click(
          function(event){
            event.preventDefault();
            if($('#email').val() && $('#name').val()){
              $.ajax({
                url: 'http://ripley.apidone.com/miembros',
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: "{'email': "+$('#email').val()+", 'name': "+$('#name').val()+"}",
                success: function(data, textStatus, xhr) {
                  document.location.href = "https://payparrot.com/parrots/start?token=6c65cf25a3487a5f80e218f5cb91fdc395ee971906043a469d4326b13224bdc7";
                }
              });
            }
            return false;
          }
        );
      }
    );
});