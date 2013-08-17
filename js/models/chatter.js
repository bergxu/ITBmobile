//Chatter New Post
itbmobile.ChatterNewPost = Backbone.Model.extend({

	save: function(options) {
		var self = this;
		options = options ? _.clone(options) : {};
		var fields = options.fields ? options.fields : {};
		
		var requestBody = { "body" : 
							   { 
							      "messageSegments" : [ 
							         { 
							           "type": "Text", 
							           "text" : "" 
							         }
							      ]
							    }
							};	
        
        requestBody.body.messageSegments[0].text = fields.body;
        
        
        client.ajax('/' + apiVersion + '/chatter/feeds/news/me/feed-items', 
	        function(feedItem) {
		        if (options.success) {
		            options.success(feedItem);
		        }
	        },
	        function(e){console.log(e)},
	        'POST',
	        JSON.stringify(requestBody)
        );
	},
	
	saveRecord: function(options) {
		var self = this;
		options = options ? _.clone(options) : {};
		var fields = options.fields ? options.fields : {};
		
		var requestBody = { "body" : 
							   { 
							      "messageSegments" : [ 
							         { 
							           "type": "Text", 
							           "text" : "" 
							         }
							      ]
							    }
							};	
        
        requestBody.body.messageSegments[0].text = fields.body;
        
        
        client.ajax('/' + apiVersion + '/chatter/feeds/record/' + self.get("id") + '/feed-items', 
	        function(feedItem) {
		        if (options.success) {
		            options.success(feedItem);
		        }
	        },
	        function(e){console.log(e)},
	        'POST',
	        JSON.stringify(requestBody)
        );
	}
});

//Chatter Feed Items
itbmobile.ChatterFeedItem = Backbone.Model.extend({

});

itbmobile.ChatterFeedItemCollection = Backbone.Collection.extend({

    model: itbmobile.ChatterFeedItem,
    
    myNewsFeedItems: function(options) {
        options = options ? _.clone(options) : {};
        var self = this;
        var data = options.data ? options.data : {};
        
        client.ajax('/' + apiVersion + '/chatter/feeds/news/me/feed-items', function(items) {
	        if (options.reset) {
	            self.reset();
	        }
	        for (var i = 0; i < items.items.length; i++) {
	            var item = new itbmobile.ChatterFeedItem(items.items[i]);
	            self.push(item);
	        }
	        if (options.success) {
	            options.success(items);
	        }
        });
    },
    
    atMeFeedItems: function(options) {
        options = options ? _.clone(options) : {};
        var self = this;
        var data = options.data ? options.data : {};
        
        client.ajax('/' + apiVersion + '/chatter/feeds/to/me/feed-items', function(items) {
	        //console.log(feedItems);
	        if (options.reset) {
	            self.reset();
	        }
	        for (var i = 0; i < items.items.length; i++) {
	            var item = new itbmobile.ChatterFeedItem(items.items[i]);
	            self.push(item);
	        }
	        if (options.success) {
	            options.success(items);
	        }
        });
    },
    
    bookmarkFeedItems: function(options) {
        options = options ? _.clone(options) : {};
        var self = this;
        var data = options.data ? options.data : {};
        
        client.ajax('/' + apiVersion + '/chatter/feeds/bookmarks/me/feed-items', function(items) {
	        //console.log(feedItems);
	        if (options.reset) {
	            self.reset();
	        }
	        for (var i = 0; i < items.items.length; i++) {
	            var item = new itbmobile.ChatterFeedItem(items.items[i]);
	            self.push(item);
	        }
	        if (options.success) {
	            options.success(items);
	        }
        });
    },
    
    groupFeedItems: function(options) {
        options = options ? _.clone(options) : {};
        var self = this;
        var data = options.data ? options.data : {};
        
        client.ajax('/' + apiVersion + '/chatter/feeds/record/' + data.id + '/feed-items', function(items) {
	        //console.log(feedItems);
	        if (options.reset) {
	            self.reset();
	        }
	        for (var i = 0; i < items.items.length; i++) {
	            var item = new itbmobile.ChatterFeedItem(items.items[i]);
	            self.push(item);
	        }
	        if (options.success) {
	            options.success(items);
	        }
        });
    }

});

//Chatter Group Items
itbmobile.ChatterGroupItem = Backbone.Model.extend({

});

itbmobile.ChatterGroupItemCollection = Backbone.Collection.extend({

    model: itbmobile.ChatterGroupItem,
    
    allGroupItems: function(options) {
        options = options ? _.clone(options) : {};
        var self = this;
        var data = options.data ? options.data : {};
        
        client.ajax('/' + apiVersion + '/chatter/groups', function(items) {
	        //console.log(feedItems);
	        if (options.reset) {
	            self.reset();
	        }
	        for (var i = 0; i < items.groups.length; i++) {
	            var item = new itbmobile.ChatterGroupItem(items.groups[i]);
	            self.push(item);
	        }
	        if (options.success) {
	            options.success(items);
	        }
        });
    }

});