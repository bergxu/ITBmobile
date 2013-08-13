itbmobile.TimerHeaderView = Backbone.View.extend({

	events: {
		"click #newCard": "showDialog"
	},
	
	showDialog: function(){
		$('#myModal').modal('toggle');
	},

	render: function () {
		this.$el.html(this.template());
		return this;
	}
});

itbmobile.TimerView = Backbone.View.extend({

    events:{
		"click #goLastWeek":"goLastWeek",
		"click #goNextWeek":"goNextWeek",
		"click #comfirmCreate": "createTimecard"
    },

	initialize:function() {
		this.timecardListViewData = this.model.getTimecardListViewData();
		this.timecardListView = new itbmobile.TimecardListView({model:this.timecardListViewData});

		this.model.on('change:rangeDateEnd', this.render, this);
    	this.model.on('change:selectedDate', this.renderChildren, this);
		//this.model.on('reset', this.remove, this);
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
	
	createTimecard: function(){
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
    initialize:function() {
    	//this.listenTo(this.model,'add',this.addTimeentry);
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