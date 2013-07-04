itbmobile.Resource = Backbone.Model.extend({

    fetchByOwner: function(options) {
        options = options ? _.clone(options) : {};
        var self = this;
        var clearCache = options.clearCache ? clearCache : false;
        var data = options.data ? options.data : {};
        if (data.ownerId) {
            console.log("fetch resource (by fetchByOwner)");
            client.query("SELECT Id, First_Name__c, Last_Name__c FROM ITBresource__c where OwnerId = '" + data.ownerId + "' and Active__c = true", function(resources) {
                var resource = self.identifyUserResource(self, resources.records);
                if (resource != null) {
                    self.set(resource);
                }
                if (options.success) {
                    options.success(resources);
                }
            });
        }
    },
    
    identifyUserResource: function(currentUser, currentUserResources) {
        var resource;
        if (currentUserResources == null || currentUserResources.length == 0) {
            // Resource doesn't exist for current user
        } else if (currentUserResources.length > 1) {
            for (var i = 0; i < currentUserResources.length; i++) {
                var r = currentUserResources[i];
                if (r.First_Name__c == currentUser.firstName && r.Last_Name__c == currentUser.lastName) {
                    // Resource record found
                    resource = r;
                    break;
                }
            }
        } else {
            // Resource record found
            resource = currentUserResources[0];
        }
        return resource;
    }

});