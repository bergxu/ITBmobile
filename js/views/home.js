itbmobile.HomeHeaderView = Backbone.View.extend({

    events: {
        "click .icon-download": "download"
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },
    
    download: function() {
        if (itbmobile.homeView != null)
            itbmobile.homeView.refresh();
    }
    
});

itbmobile.HomeView = Backbone.View.extend({
    
    initialize: function() {
        // on current user change
        this.model.on("change", this.render, this);
        
        // init sub view for vacation plan
        this.vacationPlan = new itbmobile.VacationPlan();
        this.vacationView = new itbmobile.HomeVacationView({model: this.vacationPlan});
        
        // init sub view for task collection
        this.tasks = new itbmobile.TaskCollection();
        this.tasksView = new itbmobile.HomeTaskListView({model: this.tasks});
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        
        // render vacation plan
        $('#myVacationSection', this.el).append(this.vacationView.render().el);
        
        // render task list
        $('#myTaskSection', this.el).append(this.tasksView.render().el);
        
        return this;
    },
    
    loadData: function() {
        this.vacationPlan.fetchByOwnerAndYear({data: {ownerId: this.model.get("resourceId"), year: new Date().getFullYear()}});
        this.tasks.fetchByOwner({reset: true, data: {ownerId: this.model.get("id")}});
    },

    refresh:function () {
        console.log("refresh");
        this.vacationPlan.fetchByOwnerAndYear({data: {ownerId: this.model.get("resourceId"), year: new Date().getFullYear()}, clearCache: true});
        this.tasks.fetchByOwner({reset: true, data: {ownerId: this.model.get("id")}, clearCache: true});
    }

});

itbmobile.HomeVacationView = Backbone.View.extend({

    initialize:function () {
        this.model.on("change", this.render, this);
    },

    render:function () {
        if (this.model.get("Id") != null) {
            this.$el.html(this.template(this.model.attributes));
            
            var pieData = new Array();
            pieData.push(["Available", this.model.get("Available_Days__c")]);
            pieData.push(["Used", this.model.get("Used_Days__c")]);
            pieData.push(["Requested", this.model.get("Requested_Days__c")]);
            var pieDataLabels = new Array();
            pieDataLabels.push(this.model.get("Available_Days__c") + " days");
            pieDataLabels.push(this.model.get("Used_Days__c") + " days");
            pieDataLabels.push(this.model.get("Requested_Days__c") + " days");
            var options = {
                seriesColors: [ "#69D2E7", "#E0E4CC", "#F38630"],
                grid: {
                    drawBorder: true, 
                    borderColor: '#C1C1C1',
                    borderWidth: 1,
                    drawGridlines: false,
                    background: '#F5F5F5',

                    shadow:false
                }, 
                axesDefaults: {
                    
                },
                seriesDefaults: {
                    renderer: $.jqplot.PieRenderer,
                    rendererOptions: {
                        //diameter: 200,
                        padding: 10,
                        sliceMargin: 4,
                        showDataLabels: true,
                        dataLabels: pieDataLabels //percent, label, value
                    }
                },
                legend: {
                    show: true,
                    rendererOptions: {
                        numberRows: 3
                    },
                    location: 'e',
                }                     
            }
            var myVacationPieChart = $.jqplot("myVacationPieChart", [pieData], options);
        }
        
        return this;
    }
});

itbmobile.HomeTaskListView = Backbone.View.extend({

    initialize:function () {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.on("add", function (task) {
            if (self.isOverdue(task)) {
                $('#overdue', self.el).append(new itbmobile.HomeTaskListItemView({model:task}).render().el);
            } else {
                $('#processing', self.el).append(new itbmobile.HomeTaskListItemView({model:task}).render().el);
            }
        });
    },

    render:function () {
        this.$el.html(this.template(this.model.attributes));
        _.each(this.model.models, function (task) {
            if (this.isOverdue(task)) {
                // overdue
                $('#overdue', this.el).append(new itbmobile.HomeTaskListItemView({model:task}).render().el);
            } else {
                $('#processing', this.el).append(new itbmobile.HomeTaskListItemView({model:task}).render().el);
            }
        }, this);
        return this;
    },
    
    isOverdue: function(task) {
        if (task.get("ActivityDate") == null || task.get("ActivityDate") == "") {
            return false;
        } else {
            return new Date(task.get("ActivityDate")) < new Date();
        }
    }
});

itbmobile.HomeTaskListItemView = Backbone.View.extend({

    tagName: "tr",

    initialize:function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});