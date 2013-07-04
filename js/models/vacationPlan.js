itbmobile.VacationPlan = Backbone.Model.extend({
    
    fetchByOwnerAndYear: function(options) {
        options = options ? _.clone(options) : {};
        var self = this;
        var clearCache = options.clearCache ? clearCache : false;
        var data = options.data ? options.data : {};
        if (data.ownerId && data.year) {
            console.log("fetch vacation plan (by fetchByOwnerAndYear)");
            client.query("SELECT Id, Year__c, Yearly_Days__c, Available_Days__c, Used_Days__c, Requested_Days__c FROM Vacation_Plan__c WHERE Resource__c = '" + data.ownerId + "' and Year__c = '" + data.year + "'", function(vacationPlans) {
                self.set(self.getSingleRecord(vacationPlans.records));
                if (options.success) {
                    options.success(vacationPlans);
                }
            });
        }
    },
    
    getSingleRecord: function(arr) {
        if (arr == null || arr.length == 0) return null;
        return arr[0];
    },

});