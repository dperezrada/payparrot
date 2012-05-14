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
      this.collection = collection;
      this.collection._fetch();
      this.collection.bind('reset', this.render, this);
      this.collection.bind('add', this.render, this);
      this.render();
    },
    events: {
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
      $('.pane-content',this.el).html(this.template());
      this.collection.each(this.addOne);
    }
  });
  return ParrotsView;
});
