define(['libs/require/order!libs/jquery/jquery.orig', 'libs/require/order!libs/underscore/underscore-min', 'libs/require/order!libs/backbone/backbone-min','libs/require/order!libs/jquery/tojson'],
function(){
  return {
    Backbone: Backbone.noConflict(),
    _: _.noConflict(),
    $: jQuery.noConflict()
  };
});
