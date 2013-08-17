itbmobile.IndexHeaderView = Backbone.View.extend({
	render: function () {
        this.$el.html(this.template());
        return this;
	}
});

itbmobile.IndexContentView = Backbone.View.extend({
	render: function () {
        this.$el.html(this.template());
        return this;
	}
});