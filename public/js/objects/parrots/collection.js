define([
	'underscore',
	'backbone',
  './model'
], function(_, Backbone, Model) {
  var ParrotsCollection = Backbone.Collection.extend({
    initialize: function(models,options){
    	this.url = '/accounts/'+options.id+'/parrots';
    },
    model: Model,
    _fetch: function() {
      this.add([
        {
          twitter_info: {
           screen_name: '@danielguajardok',
           name: 'Daniel Guajardo Kushner',
           picture_url: 'http://dcp.sovserv.ru/media/images/8/a/e/309051.jpg',
           avatar_url: 'http://dcp.sovserv.ru/media/images/8/a/e/309051.jpg',
          },
          id: Math.floor(Math.random()*10000),
          subscription_date: '2012-05-09 16:40',
          payments: [
            'Has probado @Qubity? Es una excelente aplicación para la gestión de tareas',
            'Has probado @Qubity? Es una excelente aplicación para la gestión de tareas',
            'Has probado @Qubity? Es una excelente aplicación para la gestión de tareas'
          ]
        },
        {
          twitter_info: {
           screen_name: '@rleonv',
           name: 'Roberto León Velasco',
           picture_url: 'http://1.bp.blogspot.com/_Kd6Zp_4e1e0/S2GBW44SSZI/AAAAAAAAAIQ/YMo07jUUksg/s320/toyota_mark_ii_a1115807596b681741_3.jpg',
           avatar_url: 'http://1.bp.blogspot.com/_Kd6Zp_4e1e0/S2GBW44SSZI/AAAAAAAAAIQ/YMo07jUUksg/s320/toyota_mark_ii_a1115807596b681741_3.jpg',
          },
          id: Math.floor(Math.random()*10000),
          subscription_date: '2012-05-09 16:40',
          payments: [
            'Has probado @Qubity? Es una excelente aplicación para la gestión de tareas'
          ]          
        },
        {
          twitter_info: {
           screen_name: '@elfrios',
           name: 'Felipe Ríos Barraza',
           picture_url: 'http://www.hidrotecnicacr.com/images_plantas/sigmainvest_1.jpg',
           avatar_url: 'http://www.hidrotecnicacr.com/images_plantas/sigmainvest_1.jpg',
          },
          id: Math.floor(Math.random()*10000),
          subscription_date: '2012-05-09 16:40',
          payments: [
            'Has probado @Qubity? Es una excelente aplicación para la gestión de tareas',
            'Has probado @Qubity? Es una excelente aplicación para la gestión de tareas'
          ]          
        },
        {
          twitter_info: {
           screen_name: '@guillermomedel',
           name: 'Guillermo Medel Lucas',
           picture_url: 'http://i235.photobucket.com/albums/ee153/Arcangel_Oscuro/Manga%20y%20anime/ngeldelaOscuridad.jpg',
           avatar_url: 'http://i235.photobucket.com/albums/ee153/Arcangel_Oscuro/Manga%20y%20anime/ngeldelaOscuridad.jpg',
          },
          id: Math.floor(Math.random()*10000),
          subscription_date: '2012-05-09 16:40',
          payments: [
            'Has probado @Qubity? Es una excelente aplicación para la gestión de tareas'
          ]          
        },
        {
          twitter_info: {
           screen_name: '@dperezrada',
           name: 'Daniel Pérez Rada',
           picture_url: 'http://29.media.tumblr.com/tumblr_liwwanixz51qi1aq9o1_500.jpg',
           avatar_url: 'http://29.media.tumblr.com/tumblr_liwwanixz51qi1aq9o1_500.jpg',
          },
          id: Math.floor(Math.random()*10000),
          subscription_date: '2012-05-09 16:40',
          payments: [
            'Has probado @Qubity? Es una excelente aplicación para la gestión de tareas',
            'Has probado @Qubity? Es una excelente aplicación para la gestión de tareas'
          ]          
        },
        {
          twitter_info: {
           screen_name: '@sblank',
           name: 'Steve Blank',
           picture_url: 'hhttp://a4.ec-images.myspacecdn.com/profile01/131/df10eef230074134b6bd0015db686190/p.jpg',
           avatar_url: 'http://a4.ec-images.myspacecdn.com/profile01/131/df10eef230074134b6bd0015db686190/p.jpg',
          },
          id: Math.floor(Math.random()*10000),
          subscription_date: '2012-05-09 16:40',
        },
        {
          twitter_info: {
           screen_name: '@rise',
           name: 'Eric Rise',
           picture_url: 'http://www.veilshop.com/assets/images/edges/fine_emb.jpg',
           avatar_url: 'http://www.veilshop.com/assets/images/edges/fine_emb.jpg',
          },
          id: Math.floor(Math.random()*10000),
          subscription_date: '2012-05-09 16:40',
          payments: [
            'Has probado @Qubity? Es una excelente aplicación para la gestión de tareas'
          ]          
        },
        {
          twitter_info: {
           screen_name: '@mark',
           name: 'Mark Zuckerberg',
           picture_url: 'http://tualatinvfw.com/new/wp-content/gallery/memorial-day-2010/112019.jpg',
           avatar_url: 'http://tualatinvfw.com/new/wp-content/gallery/memorial-day-2010/112019.jpg',
          },
          id: Math.floor(Math.random()*10000),
          subscription_date: '2012-05-09 16:40',
          payments: [
            'Has probado @Qubity? Es una excelente aplicación para la gestión de tareas',
            'Has probado @Qubity? Es una excelente aplicación para la gestión de tareas'
          ]          
        },
        {
          twitter_info: {
           screen_name: '@qubity',
           name: 'Qubity Chan!',
           picture_url: 'http://nathistoc.bio.uci.edu/Plants%20of%20Upper%20Newport%20Bay%20(Robert%20De%20Ruff)/Convolvulaceae/Dichondra_repens_June.jpg',
           avatar_url: 'http://nathistoc.bio.uci.edu/Plants%20of%20Upper%20Newport%20Bay%20(Robert%20De%20Ruff)/Convolvulaceae/Dichondra_repens_June.jpg',
          },
          id: Math.floor(Math.random()*10000),
          subscription_date: '2012-05-09 16:40',
          payments: [
            'Has probado @Qubity? Es una excelente aplicación para la gestión de tareas'
          ]          
        }                                                       
      ]);    
    }
  });
  return ParrotsCollection;

});
