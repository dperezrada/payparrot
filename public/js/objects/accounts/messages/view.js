// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'libs/text!./template.html',
  'libs/text!./template_new.html',
  './view_single',
  './collection',
  './model',

], function($, _, Backbone, messagesTemplate, messagesTemplateNew, messageView, messagesCollection, messageModel){
  var accountListView = Backbone.View.extend({
    tagName: 'div',
    template: _.template(messagesTemplate),
    templateNew: _.template(messagesTemplateNew),
    initialize: function(model){
      // this.model = model;
      // this.model.bind('change', this.render, this);
      this.collection = new messagesCollection([],{account_id: window.me.id});
      this.collection.bind('reset', this.render, this);
      this.collection.bind('add', this.render, this);
      this.collection.fetch();
      $('#account-pane .sub-pane').html(this.el);
      // this.render();
    },
    events: {
       "click .messages-new":"newMessage",
       "click .message-save":"saveMessage",
    },
    addOne: function(message) {
      // console.log(message.toJSON());
      var view = new messageView({model: message});
      $('.messages-list',this.el).append(view.render().el);
    },
    render: function(){
      $(this.el).html(this.template());
      this.collection.each(this.addOne);
    },
    newMessage: function() {
      $(this.el).html(this.templateNew());
      //$('#account-pane .pane-content> div').html(this.el);
    },
    saveMessage: function(event) {
      event.preventDefault();
      var data = $('#message-form-data').toJSON();
      var filled = true;
      for (var param in data) {
        if (data[param]=="") {
          filled = false;
        }
      }
      if (!filled) {
        $('.alert', this.el).show();
      } else {
        this.collection.create(data,{wait:true});
      }
    }
  });
  return accountListView;
});
