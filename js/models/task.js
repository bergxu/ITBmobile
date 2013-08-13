itbmobile.Task = Backbone.Model.extend({

    sync: function(method, model, options) {
        if (method === "read") {
            
        }
    }

});


itbmobile.TaskCollection = Backbone.Collection.extend({

    model: itbmobile.Task,
    
    fetchByOwner: function(options) {
        options = options ? _.clone(options) : {};
        var self = this;
        var clearCache = options.clearCache ? options.clearCache : false;
        var data = options.data ? options.data : {};
        if (data.ownerId) {
            var soql = "SELECT Id, Subject, ActivityDate, Status, Priority, Description, OwnerId "
                            + "FROM Task where OwnerId = '" + data.ownerId + "' "
                            + "and Status in ('Not Started', 'In Progress') "
                            + "ORDER BY ActivityDate ASC NULLS LAST, CreatedDate ASC";
            if (clearCache || itbmobile.storage == null || itbmobile.storage.get(soql) == null) {
                console.log("fetch tasks (by fetchByOwner)");
                client.query(soql, function(tasks) {
                    self.processTasks(tasks, self, options);
                    if (itbmobile.storage) {
                        itbmobile.storage.put(soql, tasks);
                    }
                });
            } else {
                console.log("get cached tasks (by fetchByOwner)");
                var tasks = itbmobile.storage.get(soql);
                this.processTasks(tasks, self, options);
            }
        }
    },
    
    processTasks: function(tasks, model, options) {
        if (options.reset) {
            model.reset();
        }
        for (var i = 0; i < tasks.records.length; i++) {
            var task = new itbmobile.Task(tasks.records[i]);
            if (task.get("Priority") == "Normal") {
                task.set({priorityLabel: "label-info"});
            } else {
                task.set({priorityLabel: ""});
            }
            model.push(task);
        }
        if (options.success) {
            options.success(tasks);

        }
    },

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
