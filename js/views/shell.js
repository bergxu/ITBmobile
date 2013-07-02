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
        n.addClass("navmenuanimation");
        n.css("left", 0+"px");
    },

    openwinlogo: function ()
    {
        var navmenu =  $('#navmenu', this.el);
        this.openwin(navmenu);
    },

    hidewin: function (n)
    {
        var sw = n.outerWidth(true);
        n.css("left", "-"+sw+"px");
    },

    hidewinlogo: function ()
    {
        var navmenu =  $('#navmenu', this.el);
        this.hidewin(navmenu);
    },

    init: function ()
    {
        var sw=parseInt( $(window).width()*2/3);
        var navmenu =  $('#navmenu', this.el);
        navmenu.css("width", sw+"px");
        navmenu.css("left", "-"+sw+"px");
                
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