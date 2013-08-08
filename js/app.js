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

        if (!itbmobile.timerView) {
            itbmobile.timedata = new itbmobile.TimerData();
            itbmobile.timerView = new itbmobile.TimerView({model:itbmobile.timedata});
            itbmobile.timerView.render();
        } else {
            console.log('reusing timer view');
            itbmobile.timerView.delegateEvents(); // delegate events when the view is recycled
		}   
        this.$content.html(itbmobile.timerView.el);
        //$('#week_Date').mobipick();                                                                                                                                             
        //$('#week_Day').selectmenu();
		 $("#week_Day").change(function(){
			 itbmobile.timerView.goSpecificWeekDay();
		 });
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
    itbmobile.loadTemplates(["ShellView", "HomeView", "HomeHeaderView", "HomeVacationView", "HomeTaskListView", "HomeTaskListItemView", "ChatterView", "TimerView", "SetupView","ChatterHeaderView","ChatterCommentView"], function () {
     
        itbmobile.router = new itbmobile.Router();
        Backbone.history.start();

        $(".icon-home").popupWindow({
            windowURL: getAuthorizeUrl(loginUrl, clientId, redirectUri),
            windowName: 'Connect',
            centerBrowser: 1,
            height: 524,
            width: 675
        });
    });
});
