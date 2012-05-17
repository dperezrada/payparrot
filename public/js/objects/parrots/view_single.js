// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'libs/text!./template_single.html',

], function($, _, Backbone, Template){
  var SingleView = Backbone.View.extend({
    tagName: 'div',
    className: 'parrot',
    template: _.template(Template),
    initialize: function(){
      // TODO: Filtrar la modificacion de status=1 en la API
    },
    events: {
      "click .show_all": "expand",
      "click .not-twitted": "not_twitted_message"
    },
    render: function(){
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    expand: function(){
      $('.hidden', this.el).show();
      $('.show_all', this.el).hide();
    },
    not_twitted_message: function() {
      $('#not-twitted').modal();
    }
  });
  return SingleView;
});
