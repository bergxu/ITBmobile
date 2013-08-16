itbmobile.TimerViewData = Backbone.Model.extend({
    initialize:function () {
    	var today = new Date();
    	this.setDateData(today);

		this.timecardListViewData = new itbmobile.TimeCardListViewData();
	},
	
	getTimecardListViewData: function(){
		return this.timecardListViewData;
	},
	
	dateToString:function(d,t){
    	d = new Date(d);
    	var dm = 1 + d.getMonth();
    	if(dm < 10) dm = '0'+dm;
    	else dm = ''+dm;
    	var dd = d.getDate();
    	if(dd < 10) dd = '0'+dd;
    	else dd = ''+dd;
    	var result;
    	if(t ==1)
    	result = d.toDateString();
		else if(t == 2)
	    result = d.getFullYear()+'-'+dm+'-'+dd;
	    return result;
    },
	createTimecard: function(e, ra){
		this.timecardListViewData.createNewTimeCard(e, ra);
	},
	goPrev:function(){
		console.log("TimeDate goPrev");
	    var cd = this.get('currentDay');
	    var d = cd.getDate();
	    var cdCopy = new Date(cd);
	    cdCopy.setDate(d-7);
	    this.setDateData(cdCopy);
	},
	goNext:function(){
		console.log("TimeDate goNext");
	    var cd = this.get('currentDay');
	    var d = cd.getDate();
	    var cdCopy = new Date(cd);
	    cdCopy.setDate(d+7);
	    this.setDateData(cdCopy);
	},
	goSpecificWeekDay: function (){
		var todayDayStr = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
		var selectDay = $("#week_Day").val();
	
		if(selectDay == 'All') {
	       this.set('weekDay','All');
	    	this.set('selectedDate', ' ');
		} else {
	    	var index = todayDayStr.indexOf(selectDay);
	       this.set('weekDay',todayDayStr[index]);
	
	       var today = new Date(this.get('currentDay'));
	       var todayDate = today.getDate();
	       var todayIndex = today.getDay();
	
	       var selectedDate = new Date(today);
	       selectedDate.setDate(todayDate - todayIndex + index);
	    	this.set('selectedDate', this.dateToString(selectedDate,2));
		}
		console.log("TimeDate goSpecificWeekDay = " + selectDay);
	},
	setDateData:function(today){
		console.log("TimeDate setDateData");
		var todayDay = today.getDay();
		this.set('weekDay','All');
	    
		var todayDate = today.getDate();
		var rangeDateBegin = new Date(today);
		rangeDateBegin.setDate(todayDate - todayDay);
		var rangeDateEnd = new Date(today);
		rangeDateEnd.setDate(todayDate + 6 - todayDay);
	
		this.set('currentDay',today);
		this.set('rangeDateBegin',this.dateToString(rangeDateBegin,2));
		this.set('rangeDateEnd',this.dateToString(rangeDateEnd,2));
		this.set('selectedDate', ' ');
	}
});

itbmobile.TimeCardItemViewData = Backbone.Model.extend({
    calculateWeekTotal:function(){
	    var timeentrys = this.get('timeEntryListData').models;
	    var total = 0;
	    _.each(timeentrys,function(te){
		    total += te.get('Total_Hours__c');
	    });
	    this.set({'weekTotal':total,silent:true});
    }
});

itbmobile.TimeCardListViewData = Backbone.Collection.extend({

    model: itbmobile.TimeCardItemViewData,

	loadCards: function() {
		console.log('loadCards');
		var self = this;
		var dateCondition;
		if(itbmobile.timerViewData.get('selectedDate') == ' '){
			dateCondition = ' ';
		} else {
			dateCondition = 'where Date__c = ' + itbmobile.timerViewData.get('selectedDate') + ' '
		}
		var soql = 'select Id, End_Date__c, Start_Date__c,Engagement__c,Engagement__r.Name,Engagement__r.Project_Code__c,'
								+ 'Resource_Assignment__c, RecordType.DeveloperName, Status__c,Approval_Status__c,logYourTime__c,'
									+ '(select Id,Active__c,Name,Resource_Assignment__c,Resource_Assignment__r.Name,'
									+ 'Resource_Assignment__r.Active__c,Engagement__c,Engagement__r.Name,Date__c,'
									+ 'Internal_Type__c,Status__c,Location_Type__c,Start_Time__c,End_Time__c,Location__c,'
									+ 'Country__c,Notes__c,Non_billable_Hours__c,Goodwill__c,Total_Hours__c,Bonus_Hours__c,'
									+ 'Billable_Hours__c,Arrival_Start__c,Arrival_End__c,Departure_Start__c,Departure_End__c,'
									+ 'Timecard__c,Timecard__r.Approval_Status__c,Timecard__r.RecordType.DeveloperName,'
									+ 'Breaks__c,Plan_Status__c,Travel_Time__c '
									+ 'from Time_Entries__r '
									+ dateCondition
									+ 'order by Resource_Assignment__r.Name, Date__c, Start_Time__c)'
								+ 'from Timecard__c '
								+ 'where Start_Date__c >= '
								+ itbmobile.timerViewData.get('rangeDateBegin')
								+ 'and End_Date__c <= '
								+ itbmobile.timerViewData.get('rangeDateEnd')
								+ 'AND Resource__r.Active__c = true and Resource__r.OwnerId = \''
								+ uId
								+ '\' and ownerId = \''
								+ uId
								+ '\' order by Approval_Status__c, Engagement__r.Name';

		client.query(soql, function(response){
			console.log(response);
			self.reset();
			if(response.totalSize > 0){
				console.log('response size = ' + response.totalSize);
				/**
				 * in this soql will query timeEntry  and timeCard
				 * so save the data
				 */
				var timecard, timecardData, timeEntry, timeEntryData;
				for (var i = 0, j = response.totalSize; i < j; i++) {
					timecardData = response.records[i];
					var timeentrys = new itbmobile.TimeEntryListViewData();
					timeentrys.tcId = timecardData.Id;
					timeentrys.tcEng = timecardData.Engagement__c;
					if (timecardData.Time_Entries__r != null)
					if (timecardData.Time_Entries__r.totalSize > 0) {
						timeEntryData = timecardData.Time_Entries__r.records;
						for (var k = 0, t = timeEntryData.length; k < t; k++) {
							timeEntry = new itbmobile.TimeEntryItemViewData(timeEntryData[k]);
							timeentrys.add(timeEntry);
						}
					}

					timecard = new itbmobile.TimeCardItemViewData(timecardData);
					timecard.set('timeEntryListData', timeentrys);

					self.add(timecard);
	            }
	        }
	        
	        
		},function(response){
            console.log(response);
        });
	},
	
	createNewTimeCard: function(engagement, resourceAssigment){
		console.log("create new timecard engagement = " + engagement);
		var self = this;
		if(engagement == 'none' || engagement == 'internal'){
			engagement = null;
		}
		if(resourceAssigment == 'none'){
			resourceAssigment = null;
		}
		
		//ajax one
		client.create("Timecard__c",
			{	Engagement__c: engagement,
				//RecordType.DeveloperName: 'Internal',
				Resource_Assignment__c: resourceAssigment,
				Start_Date__c: itbmobile.timerViewData.get('rangeDateBegin'),
				End_Date__c: itbmobile.timerViewData.get('rangeDateEnd')},
			function(response){
				//call back success
				console.log(response);
				console.log("call back success");
				var soql = 'select Id, End_Date__c, Start_Date__c,Engagement__c,Engagement__r.Name,Engagement__r.Project_Code__c, '
								+ 'Resource_Assignment__c, RecordType.DeveloperName, Status__c,Approval_Status__c,logYourTime__c '
								+ 'from Timecard__c '
								+ 'where id = '
								+ '\'' + response.id + '\'';
				//ajax two
				client.query(soql, function(response){
					var timecard, timecardData, timeEntry, timeEntryData;
					for (var i = 0, j = response.totalSize; i < j; i++) {
						timecardData = response.records[i];
						var timeentrys = new itbmobile.TimeEntryListViewData();
						if (timecardData.Time_Entries__r != null)
						if (timecardData.Time_Entries__r.totalSize > 0) {
							timeEntryData = timecardData.Time_Entries__r.records;
							for (var k = 0, t = timeEntryData.length; k < t; k++) {
								timeEntry = new itbmobile.TimeEntryItemViewData(timeEntryData[k]);
								timeentrys.add(timeEntry);
							}
						}
	
						timecard = new itbmobile.TimeCardItemViewData(timecardData);
						timecard.set('timeEntryListData', timeentrys);
						self.add(timecard);
					}
				},function(response){
					console.log(response);
					console.log("call back error");
				});
			},function(response){
				//call back error
				console.log(response);
				console.log("call back error");
	        });
	}

});

itbmobile.TimeEntryItemViewData = Backbone.Model.extend({
	initialize:function () {
	}
});

itbmobile.TimeEntryListViewData = Backbone.Collection.extend({
	model: itbmobile.TimeEntry,
	tcId: null,
	tcEng: null,
	initialize:function(){
    },

	loadEntrys:function(options) {
	},
	
	createNewTimeEntry:function() {
		console.log("create new time entry ; tcId = " + this.tcId);
		var self = this;
		client.create("Time_Entry__c",
			{	Timecard__c: self.tcId,
				Engagement__c: self.tcEng,
				//Internal_Type__c: 'ITB301',
				Status__c: 'Actual',
				Date__c:itbmobile.timerViewData.get('selectedDate') == ' ' ? itbmobile.timerViewData.get('currentDay') : itbmobile.timerViewData.get('selectedDate'),
				Start_Time__c: '11:00', 
				Breaks__c:'1',
				End_Time__c: '19:00',
				Notes__c: 'two'},
			function(response){
				console.log("call back success");
				console.log(response);
				var dateCondition;
				var soql = 'select Id,Active__c,Name,Resource_Assignment__c,Resource_Assignment__r.Name,'
								+ 'Resource_Assignment__r.Active__c,Engagement__c,Engagement__r.Name,Date__c,'
								+ 'Internal_Type__c,Status__c,Location_Type__c,Start_Time__c,End_Time__c,Location__c,'
								+ 'Country__c,Notes__c,Non_billable_Hours__c,Goodwill__c,Total_Hours__c,Bonus_Hours__c,'
								+ 'Billable_Hours__c,Arrival_Start__c,Arrival_End__c,Departure_Start__c,Departure_End__c,'
								+ 'Timecard__c,Timecard__r.Approval_Status__c,Timecard__r.RecordType.DeveloperName,'
								+ 'Breaks__c,Plan_Status__c,Travel_Time__c '
								+ 'from Time_Entry__c '
								+ 'where id = '
								+ '\'' + response.id + '\'';

				client.query(soql, function(response) {
						console.log(response);
						var timeEntry, timeEntryData;
						for (var i = 0, j = response.totalSize; i < j; i++) {
							timeEntryData = response.records[i];
							timeEntry = new itbmobile.TimeEntryItemViewData(timeEntryData);
							self.add(timeEntry);
			            }
					}, function(response) {
						console.log(response);
					});
			},function(response){
				console.log("call back error");
				console.log(response);
	        });
	}
});

itbmobile.EngagementItemViewData = Backbone.Model.extend({

});

itbmobile.EngagementListViewData = Backbone.Collection.extend({

	model:itbmobile.EngagementItemViewData,
	initialize:function () {
    },

	loadData:function(){
		console.log('load engagement data');
    	var self = this;
    	var soql = 'SELECT Engagement__c, Engagement_Name__c, OwnerId, Role_Name__c,Id FROM ITBresourceAssignment__c'
    		+ ' where OwnerId =\'' + uId + '\'';

    	client.query(soql,
			function(res){
				console.log('load eng success');
				if(res.totalSize > 0){
					for(var i = 0; i < res.totalSize; i++){
						var engagementItemViewData = new itbmobile.EngagementItemViewData(res.records[i]);
						self.add(engagementItemViewData);
					}
				}
			},
			function(response){
				console.log('load eng err');
				console.log(response);
			}
		);
    }

});