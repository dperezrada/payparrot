define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var accountModel = Backbone.Model.extend({
    initialize: function(){

    },
    url: '/accounts/me'
    
  });
  return accountModel;

});
