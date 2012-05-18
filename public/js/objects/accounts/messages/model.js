define([
	'underscore',
	'backbone'
], function(_, Backbone) {
  var messageModel = Backbone.Model.extend({
    initialize: function(){
    },
    defaults: {
    	text: '',
    	url: '',
    	active: 1,
    	status: 0,
    },    
    
  });
  return messageModel;

});
