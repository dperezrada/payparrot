// app.js
define([
    'underscore',
    'backbone',
    'objects/accounts/view',
    'objects/accounts/model',
    'objects/parrots/view',
    'objects/parrots/collection',    
    'tojson',
    'bootstrap'
], function(_, Backbone, AccountView,AccountModel, ParrotsView, ParrotsCollection){
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
                // TODO: Si se abre inicialmente otra ruta, no carga el modelo porlotanto no hay config inicial
                this.showAccount();
              },
              routes: {
                'account': 'showAccount',
                'parrots': 'showParrots'
              },
              showAccount: function(){
                
                $(".pane").hide();
                $("#account-pane").show();

                $("#navbar li").removeClass('active');
                $("#navbar a[href='#/account']").parent().addClass('active');

                // accountView is bind to model:change -> render();
                Models.accountModel.fetch({});
              },
              showParrots: function() {
                $('.pane').hide();
                $('#parrots-pane').show();                

                $("#navbar li").removeClass('active');
                $("#navbar a[href='#/parrots']").parent().addClass('active');

                if (typeof Collections.parrots != "undefined") {
                  Collections.parrots.fetch({});                             
                } else {
                  Collections.parrots = new ParrotsCollection([],Models.accountModel);
                  Views.parrots = new ParrotsView(Collections.parrots);
                }
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