// app.js
define([
    'underscore',
    'backbone',
    'objects/accounts/view',
    'objects/accounts/model',
    'tojson',
    'bootstrap'
], function(_, Backbone, AccountView,AccountModel){
    return {
        initialize: function(){
          // var account = {
          //   model: new AccountModel(),
          //   collection: new AccountCollection()
          // };
          // account.views = new AccountView(account.collection);

          var Collections = {hola: 'chao'};
          var Views = {};
          var Models = {};

          // Account
          Models.accountModel = new AccountModel();
          Views.accountView = new AccountView(Models.accountModel);  

          //Parrots


          var AppRouter = Backbone.Router.extend({
              initialize: function() {
                this.showAccount();
              },
              routes: {
                'account': 'showAccount',
                'parrots': 'showParrots'
              },
              showAccount: function(){
                // accountView is bind to model:change -> render();
                Models.accountModel.fetch({});
              },
              defaultAction: function(actions){
                // We have no matching route, lets display the home page 
                // console.log("holi");
                // this.showAccount();
              }
            });

            var app_router = new AppRouter();
            Backbone.history.start();
            //accountView.render();
        }
    };
});