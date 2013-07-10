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
            client.query("SELECT Id, Subject, ActivityDate, Status, Priority, Description, OwnerId "
                            + "FROM Task where OwnerId = '" + options.data.ownerId + "' "
                            + "and Status in ('Not Started', 'In Progress') "
                            + "ORDER BY ActivityDate ASC NULLS LAST, CreatedDate ASC", function(tasks) {
                if (options.reset) {
                    self.reset();
                }
                for (var i = 0; i < tasks.records.length; i++) {
                    var task = new itbmobile.Task(tasks.records[i]);
                    if (task.get("Priority") == "Normal") {
                        task.set({priorityLabel: "label-info"});
                    }
                    self.push(task);
                }
            });
        }
    }

});