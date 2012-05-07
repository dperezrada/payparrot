// Filename: views/projects/list
define([
  'jQuery',
  'Underscore',
  'Backbone',
  // Pull in the Collection module from above
  './model',
  'libs/require/text!./template.html'

], function($, _, Backbone, accountModel, accountTemplate){
  var projectListView = Backbone.View.extend({
    el: $("#page"),
    template: _.template(accountTemplate),
    initialize: function(){
      this.model = new accountModel;
      this.model.fetch();
      this.model.bind('change', this.render, this);
    },
    exampleBind: function( model ){
      //console.log(model);
    },
    render: function(){
      $("#page").html(this.template(this.model.toJSON())); 
    }
  });
  return new projectListView;
});
