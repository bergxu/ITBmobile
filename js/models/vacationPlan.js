itbmobile.VacationPlan = Backbone.Model.extend({
    
    fetchByOwnerAndYear: function(options) {
        options = options ? _.clone(options) : {};
        var self = this;
        var clearCache = options.clearCache ? options.clearCache : false;
        var data = options.data ? options.data : {};
        if (data.ownerId && data.year) {
            var soql = "SELECT Id, Year__c, Yearly_Days__c, Available_Days__c, Used_Days__c, Requested_Days__c FROM Vacation_Plan__c WHERE Resource__c = '" + data.ownerId + "' and Year__c = '" + data.year + "'";
            if (clearCache || itbmobile.storage == null || itbmobile.storage.get(soql) == null) {
                console.log("fetch vacation plan (by fetchByOwnerAndYear)");
                client.query(soql, function(vacationPlans) {
                    self.processVacation(vacationPlans, self, options);
                    if (itbmobile.storage) {
                        itbmobile.storage.put(soql, vacationPlans);
                    }
                });
            } else {
                console.log("get cached vacation plan (by fetchByOwnerAndYear)");
                var vacationPlans = itbmobile.storage.get(soql);
                this.processVacation(vacationPlans, self, options);
                if (options.success) {
                    options.success(vacationPlans);
                }
            }
        }
    },

    sync: function(method, model, options) {
        if (method === "read") {
            var self = this;
            console.log("fetch vacation plan");
            client.query("SELECT Id, Year__c, Yearly_Days__c, Available_Days__c, Used_Days__c, Requested_Days__c FROM Vacation_Plan__c WHERE Resource__c = '" + options.data.ownerId + "' and Year__c = '" + options.data.year + "'", function(vacationPlans) {
                self.set(self.getSingleRecord(vacationPlans.records));
            });
        }
    },
    
    getSingleRecord: function(arr) {
        if (arr == null || arr.length == 0) return null;
        return arr[0];
    },
    
    processVacation: function(vacationPlans, model, options) {
        model.set(model.getSingleRecord(vacationPlans.records));
        if (options.success) {
            options.success(vacationPlans);
        }
    }

});
