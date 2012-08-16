// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'libs/text!./template.html',
  'libs/text!./templateEdit.html',
  './messages/view',
  './notifications/view',
  './credentialsModel',
  './paybutton/view'

], function($, _, Backbone, accountTemplate, accountTemplateEdit,messagesView, NotificationsView, CredentialsModel,PaybuttonView){
  var accountListView = Backbone.View.extend({
    el: $("#account-pane"),
    template: _.template(accountTemplate),
    templateEdit: _.template(accountTemplateEdit),
    initialize: function(model){
      this.model = model;
      this.model.bind('change', this.render, this);
    },
    events: {
      "click .edit":"renderEdit",
      "click .save":"saveAccount",
      "click #account-tabs a[href='#profile']":"render",
      "click #account-tabs a[href='#messages']":"messages",
      "click #account-tabs a[href='#pay-button']":"pay_button",
      "click #account-tabs a[href='#notifications']":"notifications",
      "click .btn_toggle_private":"toggle_private_token"
    },
    exampleBind: function( model ){
      //console.log(model);
    },
    render: function(){
      window.me = this.model.toJSON();
      this.credentials_model = new CredentialsModel({id: this.model.get("id")});
      this.credentials_model.fetch({success: function(model){
          $('.credentials .public-token', this.el).html(model.get("public_token"));
          $('.credentials .private-token', this.el).html(model.get("private_token"));
        }
      });
      $('.pane-content',this.el).html(this.template(this.model.toJSON()));  
      $('#account-tabs a[href="#profile"]').tab('show'); // Select tab by name
    },
    renderEdit: function() {
      $('.sub-pane',this.el).html(this.templateEdit(this.model.toJSON()));
      var a = $('#account-data').toJSON();
    },
    render_stats: function() {

    },
    saveAccount: function(event) {
      event.preventDefault();
      var data = $('#account-form-data').toJSON();
      this.model.save(data);
    },
    messages: function() {
      new messagesView();
    },
    pay_button: function() {
      new PaybuttonView(this.credentials_model);
    },
    notifications: function() {
      new NotificationsView(this.model);
    },
    toggle_private_token: function(){
      var btn = $('.btn_toggle_private', this.el);
      var button_text = btn.text();
      if(button_text=="Show"){
        btn.text("Hide");
        $('.private-token', this.el).show();
      }else{
        btn.text("Show");
        $('.private-token', this.el).hide();
      }
    }
  });
  return accountListView;
});
