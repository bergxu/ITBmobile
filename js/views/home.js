itbmobile.HomeView = Backbone.View.extend({

    events: {
        "click .icon-home":"refresh"
    },
    
    initialize: function() {
        // on current user change
        this.model.on("change", this.render, this);
        
        // init sub view for vacation plan
        this.vacationPlan = new itbmobile.VacationPlan();
        this.vacationView = new itbmobile.HomeVacationView({model: this.vacationPlan});
        
        // init sub view for task collection
        this.tasks = new itbmobile.TaskCollection();
        this.tasksView = new itbmobile.HomeTaskListView({model: this.tasks});
        
        // load data
        this.loadData();
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        
        // render vacation plan
        $('#myVacationSection', this.el).html(this.vacationView.render().el);
        
        // render task list
        $('#myTaskSection', this.el).html(this.tasksView.render().el);
        
        return this;
    },
    
    loadData: function() {
        this.vacationPlan.fetch({data: {ownerId: this.model.get("resourceId"), year: 2013}});
        this.tasks.fetch({reset: true, data: {ownerId: this.model.get("id")}});
    },

    refresh:function () {
        console.log("refresh");
        this.loadData();
    }

});

itbmobile.HomeVacationView = Backbone.View.extend({

    initialize:function () {
        this.model.on("change", this.render, this);
    },

    render:function () {
        this.$el.html(this.template(this.model.attributes));
        
        if (this.model.get("Id") != null) {
            var pieData = new Array();
            pieData.push(["Available", this.model.get("Available_Days__c")]);
            pieData.push(["Used", this.model.get("Used_Days__c")]);
            pieData.push(["Requested", this.model.get("Requested_Days__c")]);
            var options = {
                seriesColors: [ "#69D2E7", "#E0E4CC", "#F38630"],
                grid: {
                    drawBorder: false, 
                    drawGridlines: false,
                    background: '#ffffff',
                    shadow:false
                }, 
                axesDefaults: {
                    
                },
                seriesDefaults: {
                    renderer: $.jqplot.PieRenderer,
                    rendererOptions: {
                        showDataLabels: true,
                        sliceMargin: 4
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

    tagName:'ul',

    className:'nav nav-list',

    initialize:function () {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.on("add", function (task) {
            self.$el.append(new itbmobile.HomeTaskListItemView({model:task}).render().el);
        });
    },

    render:function () {
        this.$el.empty();
        _.each(this.model.models, function (task) {
            this.$el.append(new itbmobile.HomeTaskListItemView({model:task}).render().el);
        }, this);
        return this;
    }
});

itbmobile.HomeTaskListItemView = Backbone.View.extend({

    tagName:"li",

    initialize:function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});