define([
	'underscore',
	'backbone',
  './model'
], function(_, Backbone, Model) {
  var ParrotsCollection = Backbone.Collection.extend({
    initialize: function(models,options){
    	this.url = '/accounts/'+options.id+'/parrots';
    },
    query_params: {},
    fetch_options: {
      add: false
    },
    model: Model,
    setParams: function(params) {
      _.extend(this.query_params, params);
    },
    _fetch: function(options) {
      var option = options || {};
      var fetch_options = _.clone(this.fetch_options);
      _.extend(fetch_options,options);
      this.fetch({'async': true, 'data': $.param(this.query_params), add: fetch_options.add});    
    }
  });
  return ParrotsCollection;

});
