// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'libs/text!./template_single.html',

], function($, _, Backbone, messageTemplate){
  var accountListView = Backbone.View.extend({
    tagName: 'li',
    template: _.template(messageTemplate),
    initialize: function(){
      // TODO: Filtrar la modificacion de status=1 en la API
    },
    events: {
      'click .deactivate': 'deactivate',
      'click .activate': 'activate'
    },
    render: function(){
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    deactivate: function() {
      var confirmed = confirm("Are you sure that you want to deactivate this message?");
      if (!confirmed) {return false;}
      this.model.save({active: 0});
      this.render();
    },
    activate: function() {
      var confirmed = confirm("Are you sure that you want to activate this message?");
      if (!confirmed) {return false;}
      this.model.save({active: 1});
      this.render();
    }    
  });
  return accountListView;
});
