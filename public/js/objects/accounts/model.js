define([
	'underscore',
	'backbone'
], function(_, Backbone) {
  var accountModel = Backbone.Model.extend({
    initialize: function(){
    	this.bind('change',function(){
	    	this.url = '/accounts/'+this.get("id");
	    },this);
    },
    defaults: {
    	email: '',
    	startup: '',
    	name: '',
    	url: '',
    	id: '',
      callback_url: '',
      notification_url: ''
    },
    url: '/accounts/me'
    
  });
  return accountModel;

});
