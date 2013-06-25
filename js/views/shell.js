itbmobile.ShellView = Backbone.View.extend({

    initialize: function () {
        // this.searchResults = new itbmobile.EmployeeCollection();
        // this.searchresultsView = new itbmobile.EmployeeListView({model: this.searchResults, className: 'dropdown-menu'});
    },

    render: function () {
        this.$el.html(this.template());
        // $('.navbar-search', this.el).append(this.searchresultsView.render().el);
        return this;
    }

    // events: {
    //     "keyup .search-query": "search",
    //     "keypress .search-query": "onkeypress"
    // },

    // search: function (event) {
    //     var key = $('#searchText').val();
    //     this.searchResults.fetch({reset: true, data: {name: key}});
    //     var self = this;
    //     setTimeout(function () {
    //         $('.dropdown').addClass('open');
    //     });
    // },

});