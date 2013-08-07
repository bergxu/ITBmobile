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
        this.$pageHeader = $("#pageheader");
    },

    home: function () {
        if (itbmobile.currentUser != null && itbmobile.currentUser.id != null) {
            // user's already logged in
            console.log("user's logged in");
            if (!itbmobile.homeView) {
                itbmobile.homeView = new itbmobile.HomeView({ model: itbmobile.currentUser });
                itbmobile.homeView.render();
            } else {
                console.log('reusing home view');
                itbmobile.homeView.delegateEvents(); // delegate events when the view is recycled
            }
            this.$content.html(itbmobile.homeView.el);
        } else {
            // user hasn't logged in yet
            console.log("user's not logged in");
        }
        if (!itbmobile.homeHeaderView) {

        } else {
            console.log('reusing home header view');
            //itbmobile.homeHeaderView.delegateEvents(); // delegate events when the view is recycled
        }
        itbmobile.homeHeaderView = new itbmobile.HomeHeaderView();
        itbmobile.homeHeaderView.render();
        this.$pageHeader.html(itbmobile.homeHeaderView.el);
    },

    chatter: function () {




        if (!itbmobile.chatterHeaderView) {
            itbmobile.chatterHeaderView = new itbmobile.ChatterHeaderView();
            itbmobile.chatterHeaderView.render();

        } else {
            itbmobile.chatterHeaderView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$pageHeader.html(itbmobile.chatterHeaderView.el);

        if (!itbmobile.chatterView) {
          
            var chatter = new itbmobile.chatterData();
            chatterOperate.getAllGroups();
        } else {
            console.log('reusing home view');
            itbmobile.chatterView.delegateEvents(); // delegate events when the view is recycled
            this.$content.html(itbmobile.chatterView.el);
        }
    

    },

    timer: function () {
        if (!itbmobile.timerHeaderView) {
            itbmobile.timerHeaderView = new itbmobile.TimerHeaderView();
            itbmobile.timerHeaderView.render();
        } else {
            itbmobile.timerHeaderView.delegateEvents(); // delegate events when the view is recycled
         }
        this.$pageHeader.html(itbmobile.timerHeaderView.el);

        if (!itbmobile.timerdataview) {
            itbmobile.timedata = new itbmobile.TimerData();
            itbmobile.timerdataview = new itbmobile.TimerView({model:itbmobile.timedata});
            itbmobile.timerdataview.render();
        } else {
            console.log('reusing timer view');
            itbmobile.timerdataview.delegateEvents(); // delegate events when the view is recycled
		}   
        this.$content.html(itbmobile.timerdataview.el);
        $('#week_Date').mobipick();                                                                                                                                             
        $('#week_Day').selectmenu();
    },

    setup: function () {
        if (!itbmobile.setupView) {
            itbmobile.setupView = new itbmobile.SetupView();
            itbmobile.setupView.render();
        } else {
            console.log('reusing home view');
            itbmobile.setupView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$content.html(itbmobile.setupView.el);

        if (!itbmobile.setupHeaderView) {
            itbmobile.setupHeaderView = new itbmobile.SetupHeaderView();
            itbmobile.setupHeaderView.render();
        } else {
            itbmobile.setupHeaderView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$pageHeader.html(itbmobile.setupHeaderView.el);
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
        uId = credsData.id;
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
                    itbmobile.loadTemplates(["ShellView", "HomeView", "HomeHeaderView", "HomeVacationView", "HomeTaskListView", "HomeTaskListItemView", "ChatterView", "TimerView", "SetupView"], function () {
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
