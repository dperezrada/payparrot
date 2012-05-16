// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above
  'libs/text!./template.html',
  './view_single',

], function($, _, Backbone, Template, ViewSingle){
  var ParrotsView = Backbone.View.extend({
    el: $("#parrots-pane"),
    template: _.template(Template),
    initialize: function(collection){
      // Infinite scroll
      var self = this;
      $(window).scroll(function(){  
        if ($(window).scrollTop() == $(document).height() - $(window).height()){
              var length = $('.parrot').length;
              self.collection.setParams({from: length});
              self.collection._fetch({add: true});
        }
      }); 
      this.render();      
      this.collection = collection;
      this.collection._fetch();
      this.collection.bind('reset', this.render_columns, this);
      this.collection.bind('add', this.render_columns, this);
    },
    events: {
      "keyup .search": "search",
      "click .filter-all": "filter_all",
      "click .filter-today": "filter_today",
      "click .filter-thisweek": "filter_thisweek",
    },
    addOne: function(model) {
      var view = new ViewSingle({model: model});
      if (typeof this.i == "undefined") {this.i = 0;}
      // [$('.parrots-column:eq(0)').height(),$('.parrots-column:eq(1)').height(),$('.parrots-column:eq(2)').height()],
      //var column = [$('.parrots-column:eq(0)').height(),$('.parrots-column:eq(1)').height(),$('.parrots-column:eq(2)').height()];
      // var column = _.indexOf([$('.parrots-column:eq(0) .parrot').length,$('.parrots-column:eq(1) .parrot').length,$('.parrots-column:eq(2) .parrot').length],_.min([$('.parrots-column:eq(0) .parrot').length,$('.parrots-column:eq(1) .parrot').length,$('.parrots-column:eq(2) .parrot').length]));
      // var tmp = $("#parrots-pane").clone();
      // console.log($('.parrots-column:eq(0)', this.el).height());
      // var column = _.indexOf([$('.parrots-column:eq(0)', tmp).height(),$('.parrots-column:eq(1)', tmp).height(),$('.parrots-column:eq(2)', tmp).height()],_.min([$('.parrots-column:eq(0)', tmp).height(),$('.parrots-column:eq(1)', tmp).height(),$('.parrots-column:eq(2)', tmp).height()]));
      $('.parrots-column:eq('+this.i+')',this.el).append(view.render().el);
      this.i++;
      if (this.i>=3) {this.i=0;}
    },
    render: function(){
      var self = this;
      this.i = 0;
      // this.reset_columns();
      $('.pane-content',this.el).html(this.template());
      // this.collection.each(this.addOne);
    },
    render_columns: function() {
      this.reset_columns();
      // $('.pane-content',this.el).html(this.template());
      this.collection.each(this.addOne);
    },
    reset_columns: function() {
      $('.parrots-column:eq(0)',this.el).html("");
      $('.parrots-column:eq(1)',this.el).html("");
      $('.parrots-column:eq(2)',this.el).html("");
    },
    filter_all: function(event) {
      $('ul li.active',this.el).removeClass("active");
      $('ul li.filter-all').addClass("active");
      this.collection.query_params = {};
      this.collection._fetch({});
    },
    filter_today: function(event) {
      $('ul li.active',this.el).removeClass("active");
      $('ul li.filter-today').addClass("active");
      var today_ = new Date();
      var today = today_.getFullYear()+"-"+today_.getMonth()+"-"+today_.getDate();
      var tomorrow_ = new Date(today_.getFullYear(),today_.getMonth(),today_.getDate()+1);
      var tomorrow = tomorrow_.getFullYear()+"-"+tomorrow_.getMonth()+"-"+tomorrow_.getDate();
      this.collection.query_params = {};
      this.collection.setParams({
        suscription_start: today,
        suscription_end: tomorrow,
      });
      this.collection._fetch({});      
    },
    filter_thisweek: function(event) {
      $('ul li.active',this.el).removeClass("active");
      $('ul li.filter-thisweek').addClass("active");
      var today_ = new Date();
      var start_ = new Date(today_.getFullYear(),today_.getMonth(),today_.getDate()-(today_.getDay()-1));
      var start = start_.getFullYear()+"-"+start_.getMonth()+"-"+start_.getDate();
      var end_ = new Date(start_.getFullYear(),start_.getMonth(),start_.getDate()+7);
      var end = end_.getFullYear()+"-"+end_.getMonth()+"-"+end_.getDate();
      this.collection.query_params = {};
      this.collection.setParams({
        suscription_start: start,
        suscription_end: end,
      });
      this.collection._fetch({});       
    },
    search: function(event) {
      var input_ = $(".search", this.el)
      var text = input_.val();
      if (!text || (event.keyCode != 13 && event.keyCode != 27)) return;
      if (event.keyCode == 13) {
        console.log(text);
        $('ul li.active',this.el).removeClass("active");
        this.collection.query_params = {};
        this.collection.setParams({screen_name: text});
        this.collection._fetch({});
      }
      if (event.keyCode == 27) {
        this.filter_all();
        input_.val("");
      }
    }    
  });
  return ParrotsView;
});
