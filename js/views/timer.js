itbmobile.TimerHeaderView = Backbone.View.extend({

	/*events: {
		"click #newTimeCard": "showDialog"
	},
	
	showDialog: function(){
		$('#myModal').modal('toggle');
	},*/

	render: function () {
		this.$el.html(this.template());
		return this;
	}
});

itbmobile.TimerView = Backbone.View.extend({

	events:{
		"click #goLastWeek":"goLastWeek",
		"click #goNextWeek":"goNextWeek",
		"click #newTimeCard":"showNewTCDialog",
		"click #tcModalComfirm": "createTimecard"
	},

	initialize:function() {
		this.timecardListViewData = this.model.getTimecardListViewData();
		this.timecardListView = new itbmobile.TimecardListView({model:this.timecardListViewData});

		// init engagementListView
		var engagementListViewData = new itbmobile.EngagementListViewData();
		engagementListViewData.loadData();
		var engagementListView = new itbmobile.EngagementListView({
			model:engagementListViewData});

		this.model.on('change:rangeDateEnd', this.render, this);
    	this.model.on('change:selectedDate', this.renderChildren, this);
		//this.model.on('reset', this.remove, this);
	},
	
	//maybe we need invoke ???
	bindEvent: function(){
		var that = this;
		$("#week_Day").change(function(){
			that.goSpecificWeekDay();
		});

		$("#goLastWeek").click(function(){
			that.goLastWeek();
		});

		$("#goNextWeek").click(function(){
			that.goNextWeek();
		});

		$("#newTimeCard").click(function(){
			that.showNewTCDialog();
		});

		$("#newTimeEntry").click(function(){
			that.showNewTEDialog();
		});
	},

	render:function () {
		console.log("timer view rander");
	
	   this.$el.html(this.template(this.model.attributes));
	
		this.renderChildren();
	
		var that = this;
		$("#week_Day").val(this.model.get('weekDay'));
		$("#week_Day").change(function(){
			that.goSpecificWeekDay();
		});
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
    	var checkValue=$("#engagement").val();
    	this.model.createTimecard(checkValue);
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
    
    //TODO ???
	/*events:{
		"click #newTimeCard":"showNewTCDialog",
		"click #tcModalComfirm": "createTimecard"
	},
    
	showNewTCDialog: function(){
		$('#timecardModal').modal('toggle');
	},

	createTimecard: function(){
    	console.log("TimecardListView  create Time card");
    	var checkValue=$("#engagement").val();
    	this.model.createNewTimeCard(checkValue);
	},*/

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
    }
});

itbmobile.TimecardItemView = Backbone.View.extend({ 

    events: {
      "click .toggle"   : "toggleDone"
    },
    
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
		console.log('TimecardItemView render');
		this.model.calculateWeekTotal();
		this.$el.html(this.template(this.model.attributes));
		
		this.addEngagementPickList();
		this.addTimeentrListView();
		
		return this;
    },

    remove: function() {
      this.model.destroy();
    },
    
    addEngagementPickList:function(){
    	//TODO
		/*var engagementListViewData = new itbmobile.EngagementListViewData();
		engagementListViewData.loadData();
		var engagementListView = new itbmobile.EngagementListView({
			model:engagementListViewData});

       $('#engagementEdit', this.el).html(engagementListView.render().el);*/
    },
    
    addTimeentrListView: function (){
		var timeEntryListView = new itbmobile.TimeEntryListView({model:this.model.get('timeEntryListData')});
		$('#timeCardItemViewContent', this.el).html(timeEntryListView.render().el);
    }
});

itbmobile.TimeEntryListView = Backbone.View.extend({
	events:{
		"click #newTimeEntry":"showNewTEDialog"
	},
	showNewTEDialog: function(){
		console.log("click new time entry");
		console.log(this);
		this.model.createNewTimeEntry();
	},
	initialize:function() {
    	this.model.on('add', this.addTimeentry, this);
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

itbmobile.EngagementListView = Backbone.View.extend({ 
    initialize: function() {
      //this.listenTo(this.model, 'change', this.render);
      //this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },

	remove: function() {
      this.model.destroy();
    }
});