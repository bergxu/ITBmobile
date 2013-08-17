approvalApp.BaseView = Backbone.View.extend({
	
	togglePageLoading: function() {
	    if ($(".pageLoading").length > 0) {
		    // Remove loading
		    $(".pageLoading").remove();
		    $(".content").removeClass("hide");
	    } else {
		    // Show loading
		    $("body").append('<div class="pageLoading"><div class="loadingDiv"><span class="loadingIcon"></span><span class="loadingLabel"></span></div></div>');
		    $(".content").addClass("hide");
	    }
    },

    initialize: function() {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render: function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
	
});

approvalApp.ListView = approvalApp.BaseView.extend({
	
});

approvalApp.ScorllableListView = approvalApp.ListView.extend({

	loadScroll: function(wrapperId) {
		this.pullDownEl = $('.pullDown', this.el).get(0);
		this.pullDownOffset = this.pullDownEl.offsetHeight;
		this.pullUpEl = $('.pullUp', this.el).get(0);
		this.pullUpOffset = this.pullUpEl.offsetHeight;
		
		var self = this;
		var loadingClass = 'loading';
		var flipClass = 'flip';
		var scrollY = 5;
		var pullDownMsg = ''; //'Pull down to refresh...';
		var pullUpMsg = ''; //Pull up to load more...';
		var releaseMsg = ''; //'Release to refresh...';
		var loadingMsg = ''; //'Loading...';
		this.listScroll = new iScroll(wrapperId, {
			useTransition: true,
			topOffset: self.pullDownOffset,
			onRefresh: function () {
				if ($(self.pullDownEl).hasClass(loadingClass)) {
					$(self.pullDownEl).removeClass(loadingClass).removeClass(flipClass);
					$(self.pullDownEl).find('.pullDownLabel').html(pullDownMsg);
				} else if ($(self.pullUpEl).hasClass(loadingClass)) {
					$(self.pullUpEl).removeClass(loadingClass).removeClass(flipClass);
					$(self.pullUpEl).find('.pullUpLabel').html(pullUpMsg);
				}
			},
			onScrollMove: function () {
				if (this.y > scrollY && !$(self.pullDownEl).hasClass(flipClass)) {
					$(self.pullDownEl).removeClass(loadingClass).addClass(flipClass);
					$(self.pullDownEl).find('.pullDownLabel').html(releaseMsg);
					this.minScrollY = 0;
				} else if (this.y < scrollY && $(self.pullDownEl).hasClass(flipClass)) {
					$(self.pullDownEl).removeClass(loadingClass).removeClass(flipClass);
					$(self.pullDownEl).find('.pullDownLabel').html(pullDownMsg);
					this.minScrollY = -self.pullDownOffset;
				} else if (this.y < (this.maxScrollY - scrollY) && !$(self.pullUpEl).hasClass(flipClass)) {
					//console.log($(".pullUp").outerHeight());
					//console.log("pull up 1 this.y=" + this.y + ", this.maxScrollY=" + this.maxScrollY + ", scrollY=" + scrollY);
					if (this.y > -$(".pullUp").outerHeight()) return;
					$(self.pullUpEl).removeClass(loadingClass).addClass(flipClass);
					$(self.pullUpEl).find('.pullUpLabel').html(releaseMsg);
					this.maxScrollY = this.maxScrollY;
				} else if (this.y > (this.maxScrollY + scrollY) && $(self.pullUpEl).hasClass(flipClass)) {
					$(self.pullUpEl).removeClass(loadingClass).removeClass(flipClass);
					$(self.pullUpEl).find('.pullUpLabel').html(pullUpMsg);
					this.maxScrollY = self.pullUpOffset;
				}
			},
			onScrollEnd: function () {
				if ($(self.pullDownEl).hasClass(flipClass)) {
					$(self.pullDownEl).removeClass(flipClass).addClass(loadingClass);
					$(self.pullDownEl).find('.pullDownLabel').html(loadingMsg);
					self.pullDownAction();	// Execute custom function (ajax call?)
				} else if ($(self.pullUpEl).hasClass(flipClass)) {
					$(self.pullUpEl).removeClass(flipClass).addClass(loadingClass);
					$(self.pullUpEl).find('.pullUpLabel').html(loadingMsg);
					self.pullUpAction();	// Execute custom function (ajax call?)
				}
			}
		});
	},
	
	pullDownAction: function() {
		var self = this;
		setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
			//alert("pulled down");
			
			self.listScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
		}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
	},
	
	pullUpAction: function() {
		var self = this;
		setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
			//alert("pulled up");
			
			self.listScroll.refresh();		// Remember to refresh when contents are loaded (ie: on ajax completion)
		}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
	},
    
    reset: function () {
        this.$el.html(this.template(this.model.attributes));
        $(".content").removeClass("hide");
        return this;
    },
    
    getItemListWrapperBodySelector: function(item) {
        return "#" + this.wrapperId + " tbody";
    }	
	
});

approvalApp.ItemView = approvalApp.BaseView.extend({
});