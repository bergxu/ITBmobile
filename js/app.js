function showpage(sid) {
	hidewin();
	window.location.href="#"+sid;
}

function openwin() {
    document.getElementById("navmenu").className="mytest";
    document.getElementById("navmenu").style.left=0+"px";
}

function hidewin() {
    var sw=parseInt( $(window).width()*2/3);
    document.getElementById("navmenu").style.left="-"+sw+"px";
}

function init() {
    var sw=parseInt( $(window).width()*2/3);
    document.getElementById("navmenu").style.width=sw+"px";
    document.getElementById("navmenu").style.left="-"+sw+"px";
    $("#page2").hide();
    $("#page3").hide();
    $("#page4").hide();
}

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
		"timer":            "timer",
		"chatter":          "chatter",
		"setup":            "setup"
    },

    initialize: function () {
        itbmobile.shellView = new itbmobile.ShellView();
        $('body').html(itbmobile.shellView.render().el);
        this.$content = $("#content");
        
        $("#mainpage").bind("swiperight",function() {
            openwin();
        });
        
        $("#mainpage").bind("swipeleft",function() {
            hidewin();
        });
        
        init();
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
	
        if (!itbmobile.homelView) {
            itbmobile.homelView = new itbmobile.HomeView();
            itbmobile.homelView.render();
        } else {
            console.log('reusing home view');
            itbmobile.homelView.delegateEvents(); // delegate events when the view is recycled
        }
        
        $("body").append(itbmobile.homelView.el);
        $(".ipage").hide();
        $("#page1").show();
    },

    chatter: function() {
        if (!itbmobile.Chatter1View) {
            itbmobile.Chatter1View = new itbmobile.ChatterView();
            itbmobile.Chatter1View.render();
        } else {
            console.log('reusing home view');
            itbmobile.Chatter1View.delegateEvents(); // delegate events when the view is recycled
        }
        $("body").append(itbmobile.Chatter1View.el);
        $(".ipage").hide();
        $("#page2").show();
    },

    timer: function() {
        if (!itbmobile.Timer1View) {
            itbmobile.Timer1View = new itbmobile.TimerView();
            itbmobile.Timer1View.render();
        } else {
            console.log('reusing home view');
            itbmobile.Timer1View.delegateEvents(); // delegate events when the view is recycled
        }
        
        $("body").append(itbmobile.Timer1View.el);
        $(".ipage").hide();
        $("#page3").show();
    },

    setup: function() {
        if (!itbmobile.Setup1View) {
            itbmobile.Setup1View = new itbmobile.SetupView();
            itbmobile.Setup1View.render();
        } else {
            console.log('reusing home view');
            itbmobile.Setup1View.delegateEvents(); // delegate events when the view is recycled
        }
        
        $("body").append(itbmobile.Setup1View.el);
        $(".ipage").hide();
        $("#page4").show();
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

        // TODO: this should use backbone model facility
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
                        //pieData.push({value: itbmobile.currentUserVacationPlan.Available_Days__c, color: "#69D2E7"});
                        //pieData.push({value: itbmobile.currentUserVacationPlan.Used_Days__c, color: "#E0E4CC"});
                        //pieData.push({value: itbmobile.currentUserVacationPlan.Requested_Days__c, color: "#F38630"});
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
