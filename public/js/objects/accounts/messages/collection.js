define([
	'underscore',
	'backbone',
  './model'
], function(_, Backbone, messageModel) {
  var messagesCollection = Backbone.Collection.extend({
    initialize: function(models,options){
    	this.url = '/accounts/'+options.account_id+'/messages';
    },
    defaults: {
      text: '',
      url: ''
    },    
    
  });
  return messagesCollection;

});
