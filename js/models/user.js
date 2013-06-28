itbmobile.User = Backbone.Model.extend({

    sync: function(method, model, options) {
        if (method === "read") {
            var self = this;
            client.getCurrentUser(function(user) {
                self.set(user);
                options.success();
            });
        }
    }

});