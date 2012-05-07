// Filename: views/projects/list
define([
  'jQuery',
  'Underscore',
  'Backbone',
  // Pull in the Collection module from above
  './model',
  'libs/require/text!./template.html',
  'libs/require/text!./templateEdit.html'

], function($, _, Backbone, accountModel, accountTemplate, accountTemplateEdit){
  var projectListView = Backbone.View.extend({
    el: $("#page"),
    template: _.template(accountTemplate),
    templateEdit: _.template(accountTemplateEdit),
    initialize: function(){
      this.model = new accountModel;
      this.model.fetch();
      this.model.bind('change', this.render, this);;
    },
    events: {
      "click .edit":"renderEdit",
    },
    exampleBind: function( model ){
      //console.log(model);
    },
    render: function(){
      window.me = this.model.toJSON()
      $("#page").html(this.template(this.model.toJSON())); 
    },
    renderEdit: function() {
      $("#page").html(this.templateEdit(this.model.toJSON()));
      var a = $('#account-data').toJSON();
    }
  });
  return new projectListView;
});
