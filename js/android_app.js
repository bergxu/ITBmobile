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
        if (itbmobile.currentUser != null && itbmobile.currentUser.id != null) {
            // user's already logged in
            console.log("user's logged in");
            if (!itbmobile.homeView) {
                itbmobile.homeView = new itbmobile.HomeView({ model: itbmobile.currentUser });
                itbmobile.homeView.render();
				  this.$content.html(itbmobile.homeView.el);
            } else {
                console.log('reusing home view');
				  this.$content.html(itbmobile.homeView.el);
                itbmobile.homeView.delegateEvents();
            }
		} else {
            // user hasn't logged in yet
            console.log("user's not logged in");
        }
    },

    chatter: function () {
        /*if (!itbmobile.chatterView) {
            itbmobile.chatterView = new itbmobile.ChatterView();
            itbmobile.chatterView.render();
            this.$content.html(itbmobile.chatterView.el);
        } else {
            console.log('reusing chatter view');
            this.$content.html(itbmobile.chatterView.el);
            itbmobile.chatterView.delegateEvents();
        }*/
    },

    timer: function () {
        if (!itbmobile.timerView) {
            itbmobile.timerViewData = new itbmobile.TimerViewData();
            itbmobile.timerView = new itbmobile.TimerView({model:itbmobile.timerViewData});
            itbmobile.timerView.render();
            this.$content.html(itbmobile.timerView.el);
        } else {
            console.log('reusing timer view');
            this.$content.html(itbmobile.timerView.el);
            itbmobile.timerView.delegateEvents(); // delegate events when the view is recycled
		}   
		//itbmobile.timerView.bindEvent();
    },

    setup: function () {
        if (!itbmobile.setupView) {
            itbmobile.setupView = new itbmobile.SetupView();
            itbmobile.setupView.render();
            this.$content.html(itbmobile.setupView.el);
        } else {
            console.log('reusing setup view');
            this.$content.html(itbmobile.setupView.el);
            itbmobile.setupView.delegateEvents(); // delegate events when the view is recycled
        }
    }

});

$(document).on("ready", function () {
    logToConsole("onLoad: jquery ready");
    document.addEventListener("deviceready", onDeviceReady,false);
});

    // The version of the REST API you wish to use in your app.
    var apiVersion = "v28.0";
    var debugMode = true;
    var logToConsole = cordova.require("salesforce/util/logger").logToConsole;
    var client ;
	 var uId = '';

    function onDeviceReady() {
        logToConsole("onDeviceReady: Cordova ready");
               
        cordova.require("salesforce/plugin/oauth").getAuthCredentials(salesforceSessionRefreshed, getAuthCredentialsError);
        //cordova.require("salesforce/plugin/oauth").authenticate(salesforceSessionRefreshed, getAuthCredentialsError);

        document.addEventListener("salesforceSessionRefresh",salesforceSessionRefreshed,false);
    }
        
    function salesforceSessionRefreshed(creds) {
        logToConsole("salesforceSessionRefreshed");
        
        var credsData = creds;
        if (creds.data)  
            credsData = creds.data;

        client = new forcetk.Client(credsData.clientId, credsData.loginUrl, null,
            cordova.require("salesforce/plugin/oauth").forcetkRefresh);
        client.setSessionToken(credsData.accessToken, apiVersion, credsData.instanceUrl);
        uId = credsData.identityUrl;
        if(uId){
            uId = /id\/\w+?\/(\w+)$/.exec(uId);
            if(uId && uId[1])
            uId = uId[1];
		 }
        //client.setRefreshToken(credsData.refreshToken);
        //client.setUserAgentString(credsData.userAgent);


        itbmobile.currentUser = new itbmobile.User();
        itbmobile.currentResource = new itbmobile.Resource();
        itbmobile.currentUser.fetch({
            success: function() {
                if (itbmobile.currentUser != null && itbmobile.currentUser.id != null) {
                    itbmobile.currentResource.fetchByOwner({data: {ownerId: itbmobile.currentUser.get("id")}, success: function() {
                    itbmobile.currentUser.set({resourceId: itbmobile.currentResource.get("Id")});
					  itbmobile.loadTemplates(["ShellView", "HomeView", "HomeHeaderView", "HomeVacationView", "HomeTaskListView", "HomeTaskListItemView", "ChatterView", "TimerView", "SetupView","ChatterHeaderView","ChatterCommentView","EngagementListView", "TimecardItemView", "TimecardListView", "TimeEntryItemView", "TimeEntryListView"], function () {
                                                 itbmobile.router = new itbmobile.Router();
                                                  Backbone.history.start();
                                                  });
                    }});
                } else {
                    alert("Can't get current user!");
                  }
            }
        });

    }

    function getAuthCredentialsError(error) {
        logToConsole("getAuthCredentialsError: " + error);
    }
