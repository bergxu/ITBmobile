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
        // render home header
        itbmobile.homeHeaderView = new itbmobile.HomeHeaderView();
        this.$pageHeader.html(itbmobile.homeHeaderView.render().el);
        
        // render home body
        if (itbmobile.currentUser != null && itbmobile.currentUser.id != null) {
            // user's already logged in
            console.log("user's logged in");
            itbmobile.homeView = new itbmobile.HomeView({model: itbmobile.currentUser});
            this.$content.html(itbmobile.homeView.render().el);
            itbmobile.homeView.loadData();
        } else {
            // user hasn't logged in yet
            console.log("user's not logged in");
        }
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

        if (!itbmobile.chatterHeaderView) {
            itbmobile.chatterHeaderView = new itbmobile.ChatterHeaderView();
            itbmobile.chatterHeaderView.render();
        } else {
            itbmobile.chatterHeaderView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$pageHeader.html(itbmobile.chatterHeaderView.el);
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

        if (!itbmobile.timerHeaderView) {
            itbmobile.timerHeaderView = new itbmobile.TimerHeaderView();
            itbmobile.timerHeaderView.render();
        } else {
            itbmobile.timerHeaderView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$pageHeader.html(itbmobile.timerHeaderView.el);
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

        if (!itbmobile.setupHeaderView) {
            itbmobile.setupHeaderView = new itbmobile.SetupHeaderView();
            itbmobile.setupHeaderView.render();
        } else {
            itbmobile.setupHeaderView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$pageHeader.html(itbmobile.setupHeaderView.el);
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
            
        itbmobile.currentUser = new itbmobile.User();
        itbmobile.currentResource = new itbmobile.Resource();
        itbmobile.currentUser.fetch({
            success: function() {
                if (itbmobile.currentUser != null && itbmobile.currentUser.id != null) {
                    itbmobile.currentResource.fetchByOwner({data: {ownerId: itbmobile.currentUser.get("id")}, success: function() {
                        itbmobile.currentUser.set({resourceId: itbmobile.currentResource.get("Id")});
                        window.location.href = "#home";
                    }});
                } else {
                    alert("Can't get current user!");
                }
            }
        });
    }
}

$(document).on("ready", function () {
    itbmobile.loadTemplates(["ShellView", "HomeView", "HomeHeaderView", "HomeVacationView", "HomeTaskListView", "HomeTaskListItemView", "ChatterView", "TimerView", "SetupView"], function () {
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
