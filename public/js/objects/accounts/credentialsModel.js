define([
	'underscore',
	'backbone'
], function(_, Backbone) {
  var accountModel = Backbone.Model.extend({
    initialize: function(){
	    this.url = '/accounts/'+this.get("id")+'/credentials';
    },
    defaults: {
    	email: '',
    	startup: '',
    	name: '',
    	url: '',
    	id: ''
    }
    
  });
  return accountModel;

});
