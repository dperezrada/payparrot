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
    	id: ''
    },
    url: '/accounts/me'
    
  });
  return accountModel;

});
