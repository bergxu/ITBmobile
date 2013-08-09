itbmobile.TimerViewData = Backbone.Model.extend({
    initialize:function () {
    	var today = new Date();
    	this.setDateData(today);
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

	       var today = new Date();
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
	}

});

itbmobile.TimeEntryItemViewData = Backbone.Model.extend({
	initialize:function () {
	}
});

itbmobile.TimeEntryListViewData = Backbone.Collection.extend({
	model: itbmobile.TimeEntry,
	initialize:function(){
    },

	loadEntrys:function(options) {
	}
});

itbmobile.EngagementItemViewData = Backbone.Model.extend({
	initialize:function () {
	}
});

itbmobile.EngagementListViewData = Backbone.Collection.extend({
	model:itbmobile.Engagement,
    initialize:function () {
        
    },
    loadData:function(){console.log('load eng');
    	var self = this;
    	client.query('select Resource_Assignment__c from Time_Entry__c '+ 
			' where Timecard__r.Resource__r.OwnerId =\'' + uId + '\' and Timecard__r.Approval_Status__c = \'Rejected\''+
			' and Resource_Assignment__c != null'+
			' and Resource_Assignment__r.Active__c = false'+
			' and Date__c >= '+itbmobile.timerViewData.get('rangeDateBegin')+
			' and Date__c <= '+itbmobile.timerViewData.get('rangeDateEnd'),
			function(res){
				console.log(res);
				var raIds = [];
				if(res.totalSize > 0){
					for(var i=0,j=res.totalSize;i<j;i++){
						raIds.push(res.records[i].Resource_Assignment__c);
					}
				}
				if(raIds.length > 0){
					raIds = raIds.join('\',\'');
					raIds = '\'' + raIds + '\'';
				}else{
					raIds = '\'\'';
				}
				
				client.query(
		        	'Select Id,  Role_Name__c, Sub_Role__c,Engagement__c,Engagement__r.Name, '+
		            'Engagement__r.Project_Code__c,Engagement__r.Project_Location__c,Engagement__r.Country__c,'+
		            'Engagement__r.Country__r.Name,Resource__c,Opportunity_Line_Item_ID__c,Assigned_Budget__c,'+
		            'Overall_Budget__c,Used_Hours__c,Scheduled_Hours__c,Aggregated_Approved_Hours__c,'+
		            'Aggregated_Billing_Hours__c,Aggregated_Invoiced_Hours__c,Start_Date__c,End_Date__c '+                                                                                               
		            'from ITBresourceAssignment__c where Start_Date__c <= '+itbmobile.timerViewData.get('rangeDateEnd') +  
		            ' AND (End_Date__c = null or End_Date__c >= '+itbmobile.timerViewData.get('rangeDateBegin')+
		            ') AND Resource__r.OwnerId = \''+uId+'\' AND Resource__r.Active__c = true'+ 
					' AND Engagement__r.Status__c != \'Completed\''+
					' AND Engagement__r.Status__c != \'Cancelled\''+
					' AND Engagement__c != null' +
					' AND (Active__c = true OR Id in ('+raIds+'))'+
		            ' order by Engagement__r.Name, Name', 
				    function(response){
				    	console.log(response);
				    	var engagement_Map = {};
				    	if(response.totalSize > 0){
				    		var engagementId;
					    	for(var k=0;k<response.totalSize;k++){
						    	engagementId = response.records[k].Engagement__c;
						    	if(!engagement_Map[engagementId]){
							    	engagement_Map[engagementId] = {
							    		engagementObj:response.records[k].Engagement__r,
								    	raList : []
							    	};
						    	}
						    	//delete response.records[k]['Engagement__r'];
							    engagement_Map[engagementId]['raList'].push(response.records[k]);
					    	}
				    	}
				    	var engagement,resourceassignment,ra_List,racollection;
				    	for(var key in engagement_Map){
					    	engagement = new itbmobile.Engagement(engagement_Map[key]['engagementObj']);
					    	ra_List = engagement_Map[key]['raList'];
					    	racollection = new itbmobile.RaCollection();
					    	for(var k=0;k<ra_List.length;k++){
						    	resourceassignment = new itbmobile.ResourceAssignment(ra_List[k]);
						    	racollection.add(resourceassignment);
					    	}
					    	engagement.set('raCollection',racollection);
					    	self.add(engagement);
				    	}
				    },
					function(response){
						console.log('load eng err');
						console.log(response);
					}
				);
			},
			function(response){
				console.log('load eng err');
				console.log(response);
			}
		);
    }

});