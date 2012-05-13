define([
	'underscore',
	'backbone'
], function(_, Backbone) {
  var ParrotsModel = Backbone.Model.extend({
    defaults: {
    	twitter_info: {
       screen_name: '',
       picture_url: '',
       avatar_url: '',
      },
    	id: '',
      subscription_date: '',
      payments: []
    },
  });
  return ParrotsModel;

});
