define([
	'underscore',
	'backbone'
], function(_, Backbone) {
  var ParrotsModel = Backbone.Model.extend({
    defaults: {
    	twitter_info: {
       screen_name: '',
       profile_image_url: '',
       name: '',
       description: '',
      },
    	id: '',
      payments: []
    },
  });
  return ParrotsModel;

});
