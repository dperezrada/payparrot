define([
  'Underscore',
  'Backbone'
], function(_, Backbone) {
  var accountModel = Backbone.Model.extend({
    initialize: function(){

    },
    url: '/accounts/me'
    
  });
  return accountModel;

});
