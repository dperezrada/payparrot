define([
	'underscore',
	'backbone',
  './model'
], function(_, Backbone, messageModel) {
  var accountModel = Backbone.Collection.extend({
    initialize: function(models,options){
    	this.url = '/accounts/'+options.account_id+'/messages';
    },
    defaults: {
    	text: '',
      url: '',
      id: ''
    },
    
  });
  return accountModel;

});
