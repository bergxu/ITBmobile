itbmobile.Task = Backbone.Model.extend({

    sync: function(method, model, options) {
        if (method === "read") {
            
        }
    }

});


itbmobile.TaskCollection = Backbone.Collection.extend({

    model: itbmobile.Task,

    sync: function(method, collection, options) {
        console.log("fetch tasks");
        if (method === "read") {
            var self = this;
            client.query("SELECT Id, Subject, ActivityDate, Status, Priority, OwnerId, Description FROM Task where OwnerId = '" + options.data.ownerId + "' and IsClosed = false ORDER BY CreatedDate DESC", function(tasks) {
                if (options.reset) {
                    self.reset();
                }
                for (var i = 0; i < tasks.records.length; i++) {
                    self.push(new itbmobile.Task(tasks.records[i]));
                }
            });
        }
    }

});