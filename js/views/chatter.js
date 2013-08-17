approvalApp.ChatterMeView = approvalApp.BaseView.extend({
    
});

approvalApp.ChatterNewPostView = approvalApp.BaseView.extend({

	events: {
		"click #saveBtn": "save"
    },
    
    save: function() {
    	var self = this;
    	if(this.model.get("type") == "record") {
	    	this.model.saveRecord({
	    		fields: {
	    			body: $("#newPostBody").val()
	    		}, 
	    		success: function(feedItem) {
		    		approvalApp.router.navigate(self.model.get("retUrl"), {trigger: true});
		    	}
	    	});
    	}
    	else {
	    	this.model.save({
	    		fields: {
	    			body: $("#newPostBody").val()
	    		}, 
	    		success: function(feedItem) {
		    		approvalApp.router.navigate("chatterHome", {trigger: true});
		    	}
	    	});
    	}
    }
    
});

approvalApp.ChatterHomeView = approvalApp.ScorllableListView.extend({

	wrapperId: "feedItemListWrapper",

    events:{
         "click tr": "showDetail"
    },
    
    initialize: function() {
    	var self = this;
        this.model.on("change", this.render, this);
        this.items = new approvalApp.ChatterFeedItemCollection();
        this.items.on("reset", this.reset, this);
        this.items.on("add", function(item) {
            $(self.getItemListWrapperBodySelector(item), self.el).append(new approvalApp.ChatterFeedItemView({model: item}).render().el);
        });
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        _.each(this.items.models, function(item) {
            $(this.getItemListWrapperBodySelector(item), this.el).append(new approvalApp.ChatterFeedItemView({model: item}).render().el);
        }, this);
        return this;
    },
    
    loadData: function() {
    	var self = this;
    	this.togglePageLoading();
        this.items.myNewsFeedItems({reset: true, success: function() {
        	self.togglePageLoading();
	        self.loadScroll(self.wrapperId);
        }});
    },
    
    refresh: function() {
    	var self = this;
        this.items.myNewsFeedItems({reset: true, success: function() {
	        self.loadScroll(self.wrapperId);
        }});
    },
	
	pullDownAction: function() {
		this.refresh();
	}
	
/*
	pullUpAction: function() {
	},
*/
	
/*
	showDetail: function(e) {
		approvalApp.router.navigate("news/detail/" + $(e.currentTarget).data("approvalItemid"), {trigger: true});
	}
*/
    
});

approvalApp.ChatterAtMeView = approvalApp.ScorllableListView.extend({

	wrapperId: "feedItemListWrapper",

    events:{
         "click tr": "showDetail"
    },
    
    initialize: function() {
    	var self = this;
        this.model.on("change", this.render, this);
        this.items = new approvalApp.ChatterFeedItemCollection();
        this.items.on("reset", this.reset, this);
        this.items.on("add", function(item) {
            $(self.getItemListWrapperBodySelector(item), self.el).append(new approvalApp.ChatterFeedItemView({model: item}).render().el);
        });
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        _.each(this.items.models, function(item) {
            $(this.getItemListWrapperBodySelector(item), this.el).append(new approvalApp.ChatterFeedItemView({model: item}).render().el);
        }, this);
        return this;
    },
    
    loadData: function() {
    	var self = this;
    	this.togglePageLoading();
        this.items.atMeFeedItems({reset: true, success: function() {
        	self.togglePageLoading();
	        self.loadScroll(self.wrapperId);
        }});
    },
    
    refresh: function() {
    	var self = this;
        this.items.atMeFeedItems({reset: true, success: function() {
	        self.loadScroll(self.wrapperId);
        }});
    },
	
	pullDownAction: function() {
		this.refresh();
	}
	
/*
	pullUpAction: function() {
	},
*/
	
/*
	showDetail: function(e) {
		approvalApp.router.navigate("news/detail/" + $(e.currentTarget).data("approvalItemid"), {trigger: true});
	}
*/
    
});

approvalApp.ChatterBookmarkView = approvalApp.ScorllableListView.extend({

	wrapperId: "feedItemListWrapper",

    events:{
         "click tr": "showDetail"
    },
    
    initialize: function() {
    	var self = this;
        this.model.on("change", this.render, this);
        this.items = new approvalApp.ChatterFeedItemCollection();
        this.items.on("reset", this.reset, this);
        this.items.on("add", function(item) {
            $(self.getItemListWrapperBodySelector(item), self.el).append(new approvalApp.ChatterFeedItemView({model: item}).render().el);
        });
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        _.each(this.items.models, function(item) {
            $(this.getItemListWrapperBodySelector(item), this.el).append(new approvalApp.ChatterFeedItemView({model: item}).render().el);
        }, this);
        return this;
    },
    
    loadData: function() {
    	var self = this;
    	this.togglePageLoading();
        this.items.bookmarkFeedItems({reset: true, success: function() {
        	self.togglePageLoading();
	        self.loadScroll(self.wrapperId);
        }});
    },
    
    refresh: function() {
    	var self = this;
        this.items.bookmarkFeedItems({reset: true, success: function() {
	        self.loadScroll(self.wrapperId);
        }});
    },
	
	pullDownAction: function() {
		this.refresh();
	}
	
/*
	pullUpAction: function() {
	},
*/
	
/*
	showDetail: function(e) {
		approvalApp.router.navigate("news/detail/" + $(e.currentTarget).data("approvalItemid"), {trigger: true});
	}
*/
    
});

//Chatter Groups
approvalApp.ChatterGroupView = approvalApp.ScorllableListView.extend({

	wrapperId: "groupItemListWrapper",

    events:{
         "click tr": "showFeeds"
    },
    
    initialize: function() {
    	var self = this;
        this.model.on("change", this.render, this);
        this.items = new approvalApp.ChatterGroupItemCollection();
        this.items.on("reset", this.reset, this);
        this.items.on("add", function(item) {
            $(self.getItemListWrapperBodySelector(item), self.el).append(new approvalApp.ChatterGroupItemView({model: item}).render().el);
        });
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        _.each(this.items.models, function(item) {
            $(this.getItemListWrapperBodySelector(item), this.el).append(new approvalApp.ChatterGroupItemView({model: item}).render().el);
        }, this);
        return this;
    },
    
    loadData: function() {
    	var self = this;
    	this.togglePageLoading();
        this.items.allGroupItems({reset: true, success: function() {
        	self.togglePageLoading();
	        self.loadScroll(self.wrapperId);
        }});
    },
    
    refresh: function() {
    	var self = this;
        this.items.allGroupItems({reset: true, success: function() {
	        self.loadScroll(self.wrapperId);
        }});
    },
	
	pullDownAction: function() {
		this.refresh();
	},
	
/*
	pullUpAction: function() {
	},
*/
	
	showFeeds: function(e) {
		approvalApp.router.navigate("chatterGroup/" + $(e.currentTarget).data("approvalItemid") +"/feeds", {trigger: true});
	}
    
});

approvalApp.ChatterGroupItemView = approvalApp.ItemView.extend({

	el: function() {
		return "<tr data-approval-itemid='" + this.model.get("id") + "'></tr>";
	}
});

approvalApp.ChatterGroupFeedsView = approvalApp.ScorllableListView.extend({

	wrapperId: "feedItemListWrapper",

    events:{
         "click tr": "showDetail"
    },
    
    initialize: function() {
    	var self = this;
        this.model.on("change", this.render, this);
        this.items = new approvalApp.ChatterFeedItemCollection();
        this.items.on("reset", this.reset, this);
        this.items.on("add", function(item) {
            $(self.getItemListWrapperBodySelector(item), self.el).append(new approvalApp.ChatterFeedItemView({model: item}).render().el);
        });
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        _.each(this.items.models, function(item) {
            $(this.getItemListWrapperBodySelector(item), this.el).append(new approvalApp.ChatterFeedItemView({model: item}).render().el);
        }, this);
        return this;
    },
    
    loadData: function() {
    	var self = this;
    	this.togglePageLoading();
        this.items.groupFeedItems({reset: true, data: {id:this.model.get('id')}, success: function() {
        	self.togglePageLoading();
	        self.loadScroll(self.wrapperId);
        }});
    },
    
    refresh: function() {
    	var self = this;
        this.items.groupFeedItems({reset: true, data: {id:this.model.get('id')}, success: function() {
	        self.loadScroll(self.wrapperId);
        }});
    },
	
	pullDownAction: function() {
		this.refresh();
	}
	
/*
	pullUpAction: function() {
	},
*/
	
/*
	showDetail: function(e) {
		approvalApp.router.navigate("news/detail/" + $(e.currentTarget).data("approvalItemid"), {trigger: true});
	}
*/
    
});

approvalApp.ChatterFeedItemView = approvalApp.ItemView.extend({

	el: function() {
		return "<tr data-approval-itemid='" + this.model.get("id") + "'></tr>";
	}

});

//Chatter Users
approvalApp.ChatterUserView = approvalApp.ScorllableListView.extend({

	wrapperId: "userItemListWrapper",

    events:{
         "click tr": "showDetail"
    },
    
    initialize: function() {
    	var self = this;
        this.model.on("change", this.render, this);
        this.items = new approvalApp.UserCollection();
        this.items.on("reset", this.reset, this);
        this.items.on("add", function(item) {
            $(self.getItemListWrapperBodySelector(item), self.el).append(new approvalApp.ChatterUserItemView({model: item}).render().el);
        });
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        _.each(this.items.models, function(item) {
            $(this.getItemListWrapperBodySelector(item), this.el).append(new approvalApp.ChatterUserItemView({model: item}).render().el);
        }, this);
        return this;
    },
    
    loadData: function() {
    	var self = this;
    	this.togglePageLoading();
        this.items.users({reset: true, success: function() {
        	self.togglePageLoading();
	        self.loadScroll(self.wrapperId);
        }});
    },
    
    refresh: function() {
    	var self = this;
        this.items.users({reset: true, success: function() {
	        self.loadScroll(self.wrapperId);
        }});
    },
	
	pullDownAction: function() {
		this.refresh();
	}
	
/*
	pullUpAction: function() {
	},
*/
	
/*
	showDetail: function(e) {
		approvalApp.router.navigate("news/detail/" + $(e.currentTarget).data("approvalItemid"), {trigger: true});
	}
*/
    
});

approvalApp.ChatterUserItemView = approvalApp.ItemView.extend({

	el: function() {
		return "<tr data-approval-itemid='" + this.model.get("id") + "'></tr>";
	}
});