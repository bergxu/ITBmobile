itbmobile.TimerHeaderView = Backbone.View.extend({

	render: function () {
		this.$el.html(this.template());
		return this;
	}
});

itbmobile.TimerView = Backbone.View.extend({

	events:{
		"click #goLastWeek":"goLastWeek",
		"click #goNextWeek":"goNextWeek",
		"change #week_Day":"goSpecificWeekDay",
		"click #newTimeCard":"showNewTCDialog",
		"click #tcModalComfirm": "createTimecard"
	},

	initialize:function() {
		this.timecardListViewData = this.model.getTimecardListViewData();
		this.timecardListView = new itbmobile.TimecardListView({model:this.timecardListViewData});
		
		this.engagementListViewData = new itbmobile.EngagementListViewData();
		this.engagementListView = new itbmobile.EngagementListView({
			model:this.engagementListViewData});

		this.model.on('change:rangeDateEnd', this.render, this);
    	this.model.on('change:selectedDate', this.renderChildren, this);
		//this.model.on('reset', this.remove, this);
	},
	
	render:function () {
		console.log("timer view rander");

		this.$el.html(this.template(this.model.attributes));

		//render engagement
       $('.engagementContent', this.el).html(this.engagementListView.render().el);
		this.engagementListViewData.loadData();

		this.renderChildren();

		//reset select:week_day
		$("#week_Day").val(this.model.get('weekDay'));
		return this;
	},
    
	renderChildren: function(){
       $('#timerContainer', this.el).html(this.timecardListView.render().el);
    	return this;
    },

	remove : function() {
		this.$el.remove();
	},
	
	showNewTCDialog: function(){
		$('#timecardModal').modal('toggle');
	},

	createTimecard: function(){
    	console.log("timeview create Time card");
    	var checkValueE=$("#engagementList").val();
    	var checkValueRA=$("#resourceAssignmentList").val();

    	this.model.createTimecard(checkValueE, checkValueRA);
	},

	goLastWeek : function() {
		this.model.goPrev();
	},

	goNextWeek : function() {
		this.model.goNext();
	},

	goSpecificWeekDay: function (){
		this.model.goSpecificWeekDay();
    }
});

itbmobile.TimecardListView = Backbone.View.extend({
	initialize:function() {
		//this.model.on('reset', this.remove, this);
		this.model.on('add', this.addTimecard, this);
	},
    
    //TODO ??? about create new timecard

	render:function () {
		console.log("TimecardListView  render");
		this.model.loadCards();
		this.$el.html(this.template(this.model.attributes));
	   	
		return this;
	},
	remove:function() {
	    this.$el.remove();
	},
	addTimecard:function (tcItemData) {
    	console.log("on add Timecard");

		tcItemData.calculateWeekTotal();
		var timecardItemView = new itbmobile.TimecardItemView({
			model: tcItemData
		});
       $('#timeCardListViewContent', this.el).append(timecardItemView.render().el);
       this.addTimeentrListView(timecardItemView);
    },
	addTimeentrListView: function (tcView){
		var timeEntryListView = new itbmobile.TimeEntryListView({model:tcView.model.get('timeEntryListData')});
		$('#timeCardListViewContent', this.el).append(timeEntryListView.render().el);
	}
});

itbmobile.TimecardItemView = Backbone.View.extend({ 
	tagName: 'tr',
	initialize: function() {
	  this.listenTo(this.model, 'change', this.render);
	  this.listenTo(this.model, 'destroy', this.remove);
	},
	render: function() {
		console.log('TimecardItemView render');
	
		this.model.calculateWeekTotal();
		this.$el.html(this.template(this.model.attributes));
		
		return this;
	},
	remove: function() {
	  this.model.destroy();
	}
});

itbmobile.TimeEntryListView = Backbone.View.extend({
	tagName: 'tr',
	initialize:function() {
    	this.model.on('add', this.addTimeentry, this);
	},
	events:{
		"click #newTimeEntry":"createTimeEntry"
	},
	createTimeEntry: function(){
		console.log("click new time entry");
		this.model.createNewTimeEntry();
	},
	render : function(){
		console.log('TimeEntryListView render');
		this.$el.html(this.template(this.model.attributes));
		this.addAllTimeentry();
		return this;
	},
	remove:function() {
	    this.$el.remove();
	},
	addTimeentry:function (te) {
	    var teView = new itbmobile.TimeEntryItemView({model:te});
	    $("#timeEntryListViewContent", this.el).append(teView.render().el);
	},
	addAllTimeentry: function() {
	    this.model.each(this.addTimeentry, this);
	}
});

itbmobile.TimeEntryItemView = Backbone.View.extend({
	tagName: 'tr',
	initialize: function() {
	  this.listenTo(this.model, 'change', this.render);
	  this.listenTo(this.model, 'destroy', this.remove);
	},
	render: function() {
		console.log('TimeEntryItemView render');
		this.$el.html(this.template(this.model.attributes));
		if(this.model.get('Date__c')){ //judge whether it is selected day
			this.$el.removeClass('hideEntry');
		}else{
			this.$el.addClass('hideEntry');
		}
		return this;
	},
	clear: function() {
	  this.model.destroy();
	}
});

itbmobile.EngagementItemView = Backbone.View.extend({ 
	el_e: function(){
		return "<option value='" + this.model.get("Engagement__c") + "'>" + this.model.get("Engagement_Name__c")+"</option>";
	},
	el_ra: function(){
		return "<option value='" + this.model.get("Id") + "'>" + this.model.get("Role_Name__c")+"</option>";
	}
});

itbmobile.EngagementListView = Backbone.View.extend({ 
	initialize: function() {
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
		this.model.on('add', this.addItem, this);
	},
	render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	},
	addItem: function(itemData){
		var item = new itbmobile.EngagementItemView({model: itemData});
		$('#engagementList', this.el).append(item.el_e());
		$('#resourceAssignmentList', this.el).append(item.el_ra());
	},
	remove: function() {
		this.model.destroy();
    }
});