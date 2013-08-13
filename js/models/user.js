itbmobile.User = Backbone.Model.extend({

    sync: function(method, model, options) {
        if (method === "read") {
            var self = this;
            client.getCurrentUser(function(user) {
                self.set(user);
                console.log("fetch user");
                client.query("SELECT Id, First_Name__c, Last_Name__c FROM ITBresource__c where OwnerId = '" + self.get("id") + "' and Active__c = true", function(resources) {
                    var resource = self.identifyUserResource(self, resources.records);
                    if (resource != null) {
                        self.set({resourceId: resource.Id});
                    }
                    options.success();
                });
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
