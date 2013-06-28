itbmobile.Task = Backbone.Model.extend({

    sync: function(method, model, options) {
        if (method === "read") {
            
        }
    }

});


itbmobile.TaskCollection = Backbone.Collection.extend({

    model: itbmobile.Task,

    sync: function(method, model, options) {
        if (method === "read") {
            
        }
    }

});