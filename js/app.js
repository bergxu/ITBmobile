var itbmobile = {

    views: {},

    models: {},

    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (itbmobile[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    itbmobile[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

};

itbmobile.Router = Backbone.Router.extend({

    routes: {
        "":                 "home",
		"home":             "home",
		"chatter":          "chatter",
		"timer":            "timer",
		"setup":            "setup"
    },

    initialize: function () {
        itbmobile.shellView = new itbmobile.ShellView();
        $('body').html(itbmobile.shellView.render().el);
        this.$content = $("#content");
    },

    home: function () {
        if (!itbmobile.homelView) {
            itbmobile.homelView = new itbmobile.HomeView();
            itbmobile.homelView.render();
        } else {
            console.log('reusing home view');
            itbmobile.homelView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$content.html(itbmobile.homelView.el);
    },
    
    chatter: function() {      
        if (!itbmobile.chatterView) {
            itbmobile.chatterView = new itbmobile.ChatterView();
            itbmobile.chatterView.render();
        } else {
            console.log('reusing home view');
            itbmobile.chatterView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$content.html(itbmobile.chatterView.el);
    },
    
    timer: function() {
		if (!itbmobile.timerView) {
            itbmobile.timerView = new itbmobile.TimerView();
            itbmobile.timerView.render();
        } else {
            console.log('reusing home view');
            itbmobile.timerView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$content.html(itbmobile.timerView.el);
    },
    
    setup: function() {
	    if (!itbmobile.setupView) {
            itbmobile.setupView = new itbmobile.SetupView();
            itbmobile.setupView.render();
        } else {
            console.log('reusing home view');
            itbmobile.setupView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$content.html(itbmobile.setupView.el);
    }
    
});

/*
 * This code allows you to use the Force.com REST API sample from your own
 * server, using OAuth to obtain a session id.
 * Note that you will need to run proxy.php, since Javascript loaded from your
 * own server cannot directly call the REST API.
 */

// OAuth Configuration
var loginUrl    = 'https://test.salesforce.com/';
var clientId    = '3MVG9Gmy2zmPB01qZQFJGoQ27ehyJINwpFO.n6ff0bwbCXNe_vzwY_oyCGhsyigLmjtY6tG6GAP4XGIj3vWsI';
var redirectUri = 'http://localhost:8888/force/oauthcallback.html';
var proxyUrl    = 'http://localhost:8888/force/proxy.php?mode=native';

var client = new forcetk.Client(clientId, loginUrl, proxyUrl);

function getAuthorizeUrl(loginUrl, clientId, redirectUri){
    return loginUrl+'services/oauth2/authorize?display=popup'
        +'&response_type=token&client_id='+escape(clientId)
        +'&redirect_uri='+escape(redirectUri);
}

function sessionCallback(oauthResponse) {
    if (typeof oauthResponse === 'undefined'
        || typeof oauthResponse['access_token'] === 'undefined') {
        alert(('Error - unauthorized!'));
    } else {
        client.setSessionToken(oauthResponse.access_token, null,
            oauthResponse.instance_url);

        // Get current user and travel to the home page
        itbmobile.currentUser = new itbmobile.User();
        itbmobile.currentUser.fetch({
            success: function() {
                if (itbmobile.currentUser != null && itbmobile.currentUser.id != null) {
                    window.location.href = "#home";
                } else {
                    alert("Can't get current user!");
                }
            }
        });
        
        // TODO: this should use backbone model facility
        /*
        client.getCurrentUser(function(user) {
            itbmobile.currentUser = user;
            
            client.query("SELECT Id, First_Name__c, Last_Name__c FROM ITBresource__c where OwnerId = '" + itbmobile.currentUser.id + "' and Active__c = true", function(resources) {
                itbmobile.currentUserResource = identifyUserResource(itbmobile.currentUser, resources.records);
                
                if (itbmobile.currentUserResource != null) {
                    client.query("SELECT Id, Year__c, Yearly_Days__c, Available_Days__c, Used_Days__c, Requested_Days__c FROM Vacation_Plan__c WHERE Resource__c = '" + itbmobile.currentUserResource.Id + "' and Year__c = '2013'", function(vacationPlans) {
                        itbmobile.currentUserVacationPlan = getSingleRecord(vacationPlans.records);
                        $("#myVacations").append(itbmobile.currentUserVacationPlan.Available_Days__c);
                        $("#myVacations").append(itbmobile.currentUserVacationPlan.Used_Days__c);
                        $("#myVacations").append(itbmobile.currentUserVacationPlan.Requested_Days__c);
                        
                        var pieData = new Array();
                        pieData.push(["Available", itbmobile.currentUserVacationPlan.Available_Days__c]);
                        pieData.push(["Used", itbmobile.currentUserVacationPlan.Used_Days__c]);
                        pieData.push(["Requested", itbmobile.currentUserVacationPlan.Requested_Days__c]);
                        
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
                    });
                }
            });
            
            client.query("SELECT Id, Subject, ActivityDate, Status, Priority, OwnerId, Description FROM Task where OwnerId = '" + itbmobile.currentUser.id + "' and IsClosed = false ORDER BY CreatedDate DESC", function(tasks) {
                itbmobile.currentUserTasks = tasks.records;
                for (var i = 0; i < itbmobile.currentUserTasks.length; i++) {
                    var task = itbmobile.currentUserTasks[i];
                    $("#myTasks").append("<li>" + task.Subject + "</li>");;
                }
            });
        });
        */
    }
}

function identifyUserResource(currentUser, currentUserResources) {
    var resource;
    if (currentUserResources == null || currentUserResources.length == 0) {
        // Resource doesn't exist for current user
    } else if (currentUserResources.length > 1) {
        for (var i = 0; i < currentUserResources.length; i++) {
            var r = currentUserResources[i];
            if (r.First_Name__c == currentUser.firstName && r.Last_Name__c == currentUser.lastName) {
                // Resource record found
                resource = r;
                break;
            }
        }
    } else {
        // Resource record found
        resource = currentUserResources[0];
    }
    return resource;
}

function getSingleRecord(arr) {
    if (arr == null || arr.length == 0) return null;
    return arr[0];
}

$(document).on("ready", function () {
    itbmobile.loadTemplates(["ShellView", "HomeView", "ChatterView", "TimerView", "SetupView"], function () {
        itbmobile.router = new itbmobile.Router();
        Backbone.history.start();

        $(".icon-home").popupWindow({ 
            windowURL: getAuthorizeUrl(loginUrl, clientId, redirectUri),
            windowName: 'Connect',
            centerBrowser: 1,
            height:524, 
            width:675
        });
    });
});
