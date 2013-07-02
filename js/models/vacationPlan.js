itbmobile.VacationPlan = Backbone.Model.extend({

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
    }

});