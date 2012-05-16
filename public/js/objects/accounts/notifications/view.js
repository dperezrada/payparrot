// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'libs/text!./template.html',
  'libs/text!./template_edit.html',

], function($, _, Backbone, NotificationTemplate, NotificationEditTemplate){
  var NotificationsView = Backbone.View.extend({
    tagName: 'div',
    template: _.template(NotificationTemplate),
    template_edit: _.template(NotificationEditTemplate),
    initialize: function(model){
      this.model = model;
      this.model.bind('change', this.render, this);
      $('#account-pane .sub-pane').html(this.el);
      this.render();
    },
    events: {
       "click .edit-url":"edit_url",
       "click .save-url":"save_url",
    },
    render: function(){
      $(this.el).html(this.template(this.model.toJSON()));
    },
    edit_url: function() {
      $(this.el).html(this.template_edit(this.model.toJSON()));
      //$('#account-pane .pane-content> div').html(this.el);
    },
    save_url: function(event) {
      event.preventDefault();
      var data = $('#notification-url-data').toJSON();
      var filled = true;
      for (var param in data) {
        if (data[param]=="") {
          filled = false;
        }
      }
      if (!filled) {
        $('.alert', this.el).show();
      } else {
        this.model.save(data,{silent:true});
        this.render();
      }
    }
  });
  return NotificationsView;
});
