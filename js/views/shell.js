itbmobile.ShellView = Backbone.View.extend({

    initialize: function () {
        // this.searchResults = new itbmobile.EmployeeCollection();
        // this.searchresultsView = new itbmobile.EmployeeListView({model: this.searchResults, className: 'dropdown-menu'});
    },

    render: function () {
        this.$el.html(this.template());
        this.init();
        // $('.navbar-search', this.el).append(this.searchresultsView.render().el);
        return this;
    },

    events: {
        "click #navmenu li a": "openPage",
        "click #logo": "openwinlogo",
        "click #logomenu": "hidewinlogo"
    },

    // search: function (event) {
    //     var key = $('#searchText').val();
    //     this.searchResults.fetch({reset: true, data: {name: key}});
    //     var self = this;
    //     setTimeout(function () {
    //         $('.dropdown').addClass('open');
    //     });
    // },

    openPage: function(e) 
    {
        var navmenu =  $('#navmenu', this.el);
        window.location.href = $(e.currentTarget).attr('href');
        this.hidewin(navmenu);
    },

    openwin: function (n)
    {
		n.css("left", 0+"px");
    	/*$(".navanimtor").css("transition", "transform 1s").css("transform", "translateX(" + sw +"px"+ ")");
    	$(".navanimtor").css("-webkit-transition", "-webkit-transform 1s").css("-webkit-transform", "translateX(" + sw +"px"+ ")");
    	$(".navanimtor").css("-moz-transition", "-moz-transform 1s").css("-moz-transform", "translateX(" + sw +"px"+ ")");*/
		/*$('#navmenu').tween({
		   left:{
              start: 0-sw,
              stop: 0,
              time: 0,
              units: 'px',
              duration: 1
           }
        });
       $.play();*/
    },

    openwinlogo: function ()
    {
        var navmenu =  $('#navmenu', this.el);
        this.openwin(navmenu);
    },

    hidewin: function (n)
    {
    	n.css("left", "-"+sw+"px");
    	/*$(".navanimtor").css("transition", "transform 1s").css("transform", "translateX("+ "-" + sw +"px"+ ")");
    	$(".navanimtor").css("-webkit-transition", "-webkit-transform 1s").css("-webkit-transform", "translateX("+ "-" + sw +"px"+ ")");
    	$(".navanimtor").css("-moz-transition", "-moz-transform 1s").css("-moz-transform", "translateX("+ "-" + sw +"px"+ ")");*/
       /*$('#navmenu').clear();
       $('#navmenu').tween({
          left:{
             start: 0,
             stop: "-"+sw,
             time: 0,
             units: 'px',
             duration: 1
          }
        });
       $.play();*/
    },

    hidewinlogo: function ()
    {
        var navmenu =  $('#navmenu', this.el);
        this.hidewin(navmenu);
    },

    init: function ()
    {
        sw=parseInt( $(window).width()*2/3);
        var navmenu =  $('#navmenu', this.el);
        navmenu.css("width", sw+"px");
        navmenu.css("left", "-"+sw+"px");
    	 //navmenu.addClass("navanimtor");
    	 navmenu.addClass("navmenuanimation");
                
        var that = this;
        $("#mainpage").bind("swiperight",function()
        {
            that.openwin(navmenu);
        });

        $("#mainpage").bind("swipeleft",function()
        {
            that.hidewin(navmenu);
        });
    }

});
