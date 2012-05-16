// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'libs/text!./template.html',

], function($, _, Backbone, Template){
  var NotificationsView = Backbone.View.extend({
    tagName: 'div',
    template: _.template(Template),
    initialize: function(model){
      this.model = model;
      this.model.bind('change', this.render, this);
      $('#account-pane .sub-pane').html(this.el);
      this.render();
    },
    events: {
    },
    render: function(){
      $(this.el).html(this.template(this.model.toJSON()));
    },
  });
  return NotificationsView;
});
