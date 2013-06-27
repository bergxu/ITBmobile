



function showpage(sid)
{
	hidewin();
	window.location.href="#"+sid;
}

function openwin()
 {
 document.getElementById("navmenu").className="mytest";
document.getElementById("navmenu").style.left=0+"px";
 }
 function hidewin()
 {
	 	

var sw=parseInt( $(window).width()*2/3);
document.getElementById("navmenu").style.left="-"+sw+"px";
 }

function init()
{
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
		"home":"home",
		"timer":"timer",
		"chatter":"chatter",
		"setup":"setup"
    },

    initialize: function () {
        itbmobile.shellView = new itbmobile.ShellView();
        $('body').html(itbmobile.shellView.render().el);
        this.$content = $("#content");
		
		
				
$("#mainpage").bind("swiperight",function()
	{
		openwin();
	}
	);
	
	$("#mainpage").bind("swipeleft",function()
	{
		hidewin();
	}
	);
	
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
    }
,
chatter:function()
{      
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
timer:function()
{
	
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
}

,
setup:function(){
	
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

}



);



    
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

        client.query("SELECT id, firstName, lastName FROM User where profileid = '00e20000000ors1' and isactive = true order by lastname limit 12", 
          function(response){
            for(var i = 0; i < response.records.length; i++) {
                itbmobile.store.employees[i].firstName = response.records[i].FirstName;
                itbmobile.store.employees[i].lastName = response.records[i].LastName;
            }
        });

        $('#loginli').hide();
    }
}

$(document).on("ready", function () {
    itbmobile.loadTemplates(["HomeView", "ShellView","ChatterView","TimerView","SetupView"],
        function () {
            itbmobile.router = new itbmobile.Router();
            Backbone.history.start();

            // $('#login').popupWindow({ 
            //     windowURL: getAuthorizeUrl(loginUrl, clientId, redirectUri),
            //     windowName: 'Connect',
            //     centerBrowser: 1,
            //     height:524, 
            //     width:675
            // });
        });


});
