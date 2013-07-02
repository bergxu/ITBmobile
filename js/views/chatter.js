itbmobile.ChatterView = Backbone.View.extend({

    // events:{
    //     "click #showMeBtn":"showMeBtnClick"
    // },

    render:function () {
        this.$el.html(this.template());
        return this;
    }

    // showMeBtnClick:function () {
    //     console.log("showme");
    //     directory.shellView.search();
    // }

});

itbmobile.ChatterHeaderView = Backbone.View.extend({

    render:function () {
        this.$el.html('<ul class="nav"><li><a href="#"><i class="icon-comments icon-2x"></i></a></li></ul>');
        return this;
    }
});