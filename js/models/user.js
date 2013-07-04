itbmobile.User = Backbone.Model.extend({

    sync: function(method, model, options) {
        if (method === "read") {
            var self = this;
            client.getCurrentUser(function(user) {
                self.set(user);
                console.log("fetch user (by sync)");
                options.success();
            });
        }
    }

});