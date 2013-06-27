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
        "":                 "home"
    },

    initialize: function () {
        itbmobile.shellView = new itbmobile.ShellView();
        $('body').html(itbmobile.shellView.render().el);
        this.$content = $("#content");
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
        this.$content.html(itbmobile.homelView.el);
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

        client.getCurrentUser(function(response) {
            alert(response.username);
        });

        /*
        itbmobile.currentUser.Id = "005M0000004bc8xIAA";
        itbmobile.currentUser.FirstName = "Lingjun";
        itbmobile.currentUser.LastName = "Jiang";
        client.query("SELECT Id, FirstName, LastName FROM ITBresource__c where OwnerId = '" + itbmobile.currentUser.Id + "' and Active__c = true", function(response) {
            itbmobile.currentUserResource = null;
            if (response.records == null || response.records.length == 0) {
                // Resource doesn't exist for current user
            } else if (response.records.length > 1) {
                for (var r : response.records) {
                    if (r.FirstName == itbmobile.currentUser.FirstName && r.LastName == itbmobile.currentUser.LastName) {
                        // Resource record found
                        itbmobile.currentUserResource = r;
                        break;
                    }
                }
            } else {
                // Resource record found
                itbmobile.currentUserResource = r;
            }
            
            alert(r.FirstName);
        });
        */
        
    }
}

$(document).on("ready", function () {
    itbmobile.loadTemplates(["HomeView", "ShellView"], function () {
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
