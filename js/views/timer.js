itbmobile.TimerHeaderView = Backbone.View.extend({

    render:function () {
        this.$el.html('<ul class="nav"><li><a href="#"><i class="icon-time icon-2x"></i></a></li></ul>');
        return this;
    }
});

itbmobile.TimerView = Backbone.View.extend({

    events:{
        "click #goLastWeek":"goLastWeek",
        "click #goNextWeek":"goNextWeek"
    },

	initialize:function() {
		itbmobile.timedata.loadData();
		itbmobile.timecardcollectionview = new itbmobile.TimecardCollectionView({model:itbmobile.timecardCollection});

		//this.listenTo(this.model, 'change:rangeDateEnd', this.render);
    	this.model.on('change:selectedDate', this.render, this);
		this.model.on('reset', this.remove, this);
	},

    render:function () {
    	console.log("timer view rander");
    	this.$el.html(this.template(this.model.attributes));

    	//load timecard item
		itbmobile.timecardCollection.loadCards();

		var that = this;
    	$("#week_Day").val(itbmobile.timedata.get('weekDay'));
		$("#week_Day").change(function(){
			that.goSpecificWeekDay();
		});

		return this;
    },

    remove : function() {
		this.$el.remove();
	},

	goLastWeek : function() {
		timerDateChanged = true;
		this.model.goPrev();
	},

	goNextWeek : function() {
		timerDateChanged = true;
		this.model.goNext();
	},

	goSpecificWeekDay: function (){
		this.model.goSpecificWeekDay();
    }
});

itbmobile.TimecardCollectionView = Backbone.View.extend({
    el:$('#tcContainer'),
    initialize:function() {
    	this.$container = $('#tcContainer');
    	this.model.on('reset', this.remove, this);
    	this.model.on('add', this.addTimecard, this);
    },
    
    remove:function() {
        this.$el.remove();
    },

    addTimecard:function (tc) {
    	console.log("on add Timecard");
		tc.calculateWeekTotal();
		var tcView = new itbmobile.TimecardView({
			model: tc
		});

		tcView.render();
		$('#tcContainer').append(tcView.el);
    },

    addTimeentry:function (te) {
        var teView = new itbmobile.timeentryView({model:te});
        this.$('#tcContainer').append(tcView.el);
    },

    addAllTimeentry: function() {
        itbmobile.timeentryCollection.each(this.addTimeentry, this);
    }
});

itbmobile.TimecardView = Backbone.View.extend({ 
    tagName :  "div",
    className : "row-fluid",
    template: _.template($('#tcitem-template').html()),
    events: {
      "click .toggle"   : "toggleDone"
    },
    
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      this.model.calculateWeekTotal();
      this.$el.html(this.template(this.model.attributes));
      this.addEngagementPickList();
      //this.model.calculateWeekTotal();
      this.addTimeentryCollectionView();
      return this;
    },

    remove: function() {
      this.model.destroy();
    },
    
    addEngagementPickList:function(){
	    var engagementCollectionView = new itbmobile.EngagementCollectionView({
	    	collection:itbmobile.engagementCollection});
	    $(this.el).find('.engagementEdit').html(engagementCollectionView.render().el);
    },
    
    addTimeentryCollectionView: function (){
		var timeentrycollectionview = new itbmobile.timeentryCollectionView({collection:this.model.get('teList')});
		$(this.el).append(timeentrycollectionview.render().el);
    }
});

itbmobile.timeentryCollectionView = Backbone.View.extend({
    tagName : "div",
    initialize:function() {
    	this.listenTo(this.collection,'add',this.addTimeentry);
    },
    render : function(){
	    this.addAllTimeentry();
	    return this;
    },
    remove:function() {
        this.$el.remove();
    },
    addTimeentry:function (te) {
        var teView = new itbmobile.timeentryView({model:te});
        $(this.el).append(teView.render().el);
    },
    addAllTimeentry: function() {
        this.collection.each(this.addTimeentry, this);
    }
});

itbmobile.timeentryView = Backbone.View.extend({
    tagName:  "div",
    className: "row-fluid",
    template: _.template($('#teitem-template').html()),
    // The DOM events specific to an item.
    events: {
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    // Re-render the titles of the todo item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      if(this.model.get('Date__c')){ //judge whether it is selected day
	      this.$el.removeClass('hideEntry');
      }else{
	      this.$el.addClass('hideEntry');
      }
      return this;
    },
    
    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }
});

itbmobile.EngagementCollectionView = Backbone.View.extend({ 
    tagName :  "div",
    template: _.template($('#tcEng-template').html()),
    events:{
	    'change .engagementPicklist':'findRolePicklist'
    },
    initialize: function() {
      this.listenTo(this.collection, 'change', this.render);
      this.listenTo(this.collection, 'destroy', this.remove);
      //this.resourceAssignmentsview = new itbmobile.raCollectionView({collection:this.model.get('raList')});
    },
    // Re-render the titles of the todo item.
    render: function() {
      this.$el.html(this.template(this.collection));
      return this;
    },
    // Remove the item, destroy the model.
    remove: function() {
      this.model.destroy();
    },
    findRolePicklist:function(evt){
	    var engId = $(evt.target).val();
	    if(engId){
		    var engagement = itbmobile.engagementCollection.get(engId);
		    if(engagement){
			    var racollection = engagement.get('raCollection');
			    var racollectionview = new itbmobile.RaCollectionView({collection:racollection});
		    }
	    }
    }
});

itbmobile.RaCollectionView = Backbone.View.extend({
    tagName : "div",
    initialize:function() {
    	//this.listenTo(this.collection,'add',this.addRA);
    },
    render : function(){
	    this.addAllRA();
	    return this;
    },
    remove:function() {
        this.$el.remove();
    },
    addRA:function (ra) {
        var raView = new itbmobile.resourceAssignmentView({model:ra});
        $(this.el).append(raView.render().el);
    },
    addAllRA: function() {
        this.collection.each(this.addRA, this);
    }
});

itbmobile.ResourceAssignmentView = Backbone.View.extend({/*
    tagName:  "div",*/
    template: _.template($('#teRa-template').html()),
    
    events: {
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    
    remove: function() {
      this.model.destroy();
    }
});