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
        "chatter":                       "chatterHome", 
        "chatterHome":                   "chatterHome", 
        "chatterAtMe":                   "chatterAtMe", 
        "chatterBookmark":               "chatterBookmark", 
        "chatterMe":                     "chatterMe", 
        "chatterGroup":                  "chatterGroup", 
        "chatterGroup/:id/feeds":        "chatterGroupFeeds", 
        "chatterGroup/:id":              "chatterGroupDetail", 
        "chatterUser":                   "chatterUser", 
        "chatterNewPost":                "chatterNewPost", 
        "chatterNewPost/group/:id":      "chatterNewPostGroup", 
        "chatterNewPost/news/:id":       "chatterNewPostNews", 
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

    chatterHome: function() {
        if (!itbmobile.chatterHomeView) {
            itbmobile.chatterHomeView = new itbmobile.ChatterHomeView({model: itbmobile.currentUser});
            itbmobile.chatterHomeView.render();
            this.$content.html(itbmobile.chatterHomeView.el);
            itbmobile.chatterHomeView.loadData();
        } else {
            console.log('reusing chatter home view');
            this.$content.html(itbmobile.chatterHomeView.el);
            itbmobile.chatterHomeView.delegateEvents();
        }
    },

    chatterAtMe: function() {
        if (!itbmobile.chatterAtMeView) {
            itbmobile.chatterAtMeView = new itbmobile.ChatterAtMeView({model: itbmobile.currentUser});
            itbmobile.chatterAtMeView.render();
            this.$content.html(itbmobile.chatterAtMeView.el);
            itbmobile.chatterAtMeView.loadData();
        } else {
            console.log('reusing chatter at me view');
            this.$content.html(itbmobile.chatterAtMeView.el);
            itbmobile.chatterAtMeView.delegateEvents();
        }
    },

    chatterBookmark: function() {
        if (!itbmobile.chatterBookmarkView) {
            itbmobile.chatterBookmarkView = new itbmobile.ChatterBookmarkView({model: itbmobile.currentUser});
            itbmobile.chatterBookmarkView.render();
            this.$content.html(itbmobile.chatterBookmarkView.el);
            itbmobile.chatterBookmarkView.loadData();
        } else {
            console.log('reusing chatter bookmark view');
            this.$content.html(itbmobile.chatterBookmarkView.el);
            itbmobile.chatterBookmarkView.delegateEvents();
        }
    },

    chatterMe: function() {
        if (!itbmobile.chatterMeView) {
            itbmobile.chatterMeView = new itbmobile.ChatterMeView({model: itbmobile.currentUser});
            itbmobile.chatterMeView.render();
            this.$content.html(itbmobile.chatterMeView.el);
        } else {
            console.log('reusing chatter me view');
            this.$content.html(itbmobile.chatterMeView.el);
            itbmobile.chatterMeView.delegateEvents();
        }
    },

    chatterGroup: function() {
        if (!itbmobile.chatterGroupView) {
            itbmobile.chatterGroupView = new itbmobile.ChatterGroupView({model: itbmobile.currentUser});
            itbmobile.chatterGroupView.render();
            this.$content.html(itbmobile.chatterGroupView.el);
            itbmobile.chatterGroupView.loadData();
        } else {
            console.log('reusing chatter group view');
            this.$content.html(itbmobile.chatterGroupView.el);
            itbmobile.chatterGroupView.delegateEvents();
        }
    },

    chatterGroupFeeds: function(pid) {
        itbmobile.chatterGroupFeedsView = new itbmobile.ChatterGroupFeedsView({model: new itbmobile.ChatterGroupItem({id:pid})});
        itbmobile.chatterGroupFeedsView.render();
        this.$content.html(itbmobile.chatterGroupFeedsView.el);
        itbmobile.chatterGroupFeedsView.loadData();
    },

    chatterUser: function() {
        if (!itbmobile.chatterUserView) {
            itbmobile.chatterUserView = new itbmobile.ChatterUserView({model: itbmobile.currentUser});
            itbmobile.chatterUserView.render();
            this.$content.html(itbmobile.chatterUserView.el);
            itbmobile.chatterUserView.loadData();
        } else {
            console.log('reusing chatter group view');
            this.$content.html(itbmobile.chatterUserView.el);
            itbmobile.chatterUserView.delegateEvents();
        }
    },

    chatterNewPost: function() {
        itbmobile.chatterNewPostView = new itbmobile.ChatterNewPostView({model: new itbmobile.ChatterNewPost({retUrl:"chatterHome"})});
        itbmobile.chatterNewPostView.render();
        this.$content.html(itbmobile.chatterNewPostView.el);
    },
    
    chatterNewPostGroup: function(pid) {
        itbmobile.chatterNewPostView = new itbmobile.ChatterNewPostView({model: new itbmobile.ChatterNewPost({id:pid, type:"record", retUrl:"chatterGroup/" + pid + "/feeds"})});
        itbmobile.chatterNewPostView.render();
        this.$content.html(itbmobile.chatterNewPostView.el);
    },
    
    chatterNewPostNews: function(pid) {
        itbmobile.chatterNewPostView = new itbmobile.ChatterNewPostView({model: new itbmobile.ChatterNewPost({id:pid, type:"record", retUrl:"news/" + pid + "/feeds"})});
        itbmobile.chatterNewPostView.render();
        this.$content.html(itbmobile.chatterNewPostView.el);
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
var uId = '';

var apiVersion = "v28.0";
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
        uId = oauthResponse.id;
        if(uId){
            uId = /id\/\w+?\/(\w+)$/.exec(uId);
            if(uId && uId[1])
            uId = uId[1];
		 }
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
    itbmobile.loadTemplates(["ShellView", "HomeView", "HomeHeaderView", "HomeVacationView", "HomeTaskListView", "HomeTaskListItemView", "TimerView", "SetupView","EngagementListView", "TimerHeaderView", "TimecardItemView", "TimecardListView", "TimeEntryItemView", "TimeEntryListView","ChatterHomeView", "ChatterAtMeView", "ChatterBookmarkView", "ChatterMeView", "ChatterFeedItemView", "ChatterGroupView", "ChatterGroupItemView", "ChatterGroupFeedsView", "ChatterUserView", "ChatterUserItemView", "ChatterNewPostView"], function () {
     
        itbmobile.router = new itbmobile.Router();
        Backbone.history.start();

        $("#loginsfdc").popupWindow({
            windowURL: getAuthorizeUrl(loginUrl, clientId, redirectUri),
            windowName: 'Connect',
            centerBrowser: 1,
            height: 524,
            width: 675
        });
    });
});
