itbmobile.ChatterView = Backbone.View.extend({

    // events:{
    //     "click #showMeBtn":"showMeBtnClick"
    // },
    render: function () {
        this.el=this.template(this.model.attributes);

        return this;
    }

});

itbmobile.ChatterHeaderView = Backbone.View.extend({

    render: function () {
        this.$el.html('<ul class="nav"><li><a href="#"><i class="icon-home icon-2x"></i></a></li></ul><div class="navbar-inner"><a href="javascript:void(1);" onclick="chatterOperate.showNewFeedPanel(this)"><i class="icon-comments icon-2x"></i></a></div>');
        return this;
    }
});

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month   
        "d+": this.getDate(),    //day   
        "h+": this.getHours(),   //hour   
        "m+": this.getMinutes(), //minute   
        "s+": this.getSeconds(), //second   
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter   
        "S": this.getMilliseconds() //millisecond   
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
     (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
       RegExp.$1.length == 1 ? o[k] :
         ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

var chatterOperate = {
    Feeds: [],
    result: null,
    resultArr: [],
    addComments: [],
    isquery: 0,
    newFeed: function () {

        var text = $("#feedtext").val();
        var path = '/' + client.apiVersion + "/chatter/feeds/news/me/feed-items?text=New+post";
        var info = { "body":
    {
        "messageSegments": [
    {
        "type": "Text",
        "text": text
    }
    ]
    }
        };

        client.ajax(path, function (response) {
            //callback

            var chatter = new itbmobile.chatterData();
            var feeds = [];
            feeds.push(response);
            chatter.set({ first: 0, user: itbmobile.currentUser, data: { items: feeds} });
            var mychatterView = new itbmobile.ChatterView({ model: chatter });
            mychatterView.render();
            var content = mychatterView.el;
            $("#content").prepend(content);

            $("#newFeedDialog").hide();
        }, function (response) {
            //error
            alert("error");
        }, "POST", JSON.stringify(info)
    );

    },

    commentlike: function (obj, cid) {
        if (obj.src.indexOf("like.png") != -1) {
            var fobj = $(obj).parents('[cid]');
            var commentlikes = fobj.find("[myid='commentlikes']").eq(0);
            var path = '/' + client.apiVersion + "/chatter/comments/" + cid + "/likes";
            client.ajax(path, function (response) {
                var li = '<li likeid="' + itbmobile.currentUser.id + '"><a href="javascript:void(0)"><img src="img/like.png"/> you</a></li>';
                if (commentlikes.length == 0) {

                    fobj.find("[myid='commentlikes']").append('<ul myid="commentlikes" class="nav nav-list">' + li + "</ul>");
                }
                else {
                    fobj.find("[myid='commentpanel']").append(li);
                }
                obj.src = "img/unlike.png";

            }, function (response) {

                alert("error");
            }, "POST");
        }

    },

    dolike: function (obj, cid) {

        var fobj = $(obj).parents('[cid]');
        var commlike = fobj.find("[myid='commentlike']").eq(0);
        if (obj.src.indexOf("unlike.png") != -1) {
            var likeli = fobj.find("[myid='commentlike']").eq(0).find('[lcid="' + itbmobile.currentUser.id + '"]');
            var likeid = likeli.attr("likeid");
            chatterOperate.unlike(likeid, function (response) {
                alert("delete");
                obj.src = "img/like.png";
                likeli.remove();
            });
            return;
        }




        var path = '/' + client.apiVersion + "/chatter/feed-items/" + cid + "/likes";
        client.ajax(path, function (response) {
            //callback
            alert("add a like");
            obj.src = "img/unlike.png";
            var li = '<ul myid="commentlike" class="nav nav-list"><li lcid="' + itbmobile.currentUser.id + '"><a href="javascript:void(0)"><img src="img/like.png" />you</a></li>';
            if (commlike.length == 0) {
                fobj.find("[myid='addcommentDIV']").eq(0).after('<ul myid="commentlike" class="nav nav-list">' + li + "</ul>");
            }
            else {
                commlike.eq(0).append(li);
            }

        }, function (response) {
            //error
            alert("error");
        }, "POST"
    );

    }
    ,
    unlike: function (likeid, callback) {
        var path = '/' + client.apiVersion + "/chatter/likes/" + likeid;
        client.ajax(path, callback, function (response) { alert("error"); }, "DELETE");
    },
    showNewFeedPanel: function () {
        $("#newFeedDialog").show();
    },
    addOneFeed: function () {
        $("#newFeedDialog").show();
    },
    addonecomment: function (obj) {
        var fobj = $(obj).parents('[cid]');

        fobj.find("[myid='addcommentDIV']").eq(0).show();
        fobj.find("[myid='commentinput']").eq(0).val("");

    }
    ,
    hideAddonecomment: function (obj) {
        $(obj).parent().parent().hide();
    }
    ,


    newAcomment: function (obj, feedID) {

        var fobj = $(obj).parents('[cid]');
        var text = fobj.find("[myid='commentinput']").eq(0).val();
        var panel = fobj.find("[myid='addcommentDIV']").eq(0);
        alert("start");
        var path = '/' + client.apiVersion + "/chatter/feed-items/" + feedID + "/comments?text=New+comment";
        //  /services/data/v28.0/chatter/feed-items/0D5D0000000DaSbKAK/comments?text=New+comment

        var info = { "body":
        {
            "messageSegments": [
        {
            "type": "Text",
            "text": text
        }
        ]
        }
        };


        client.ajax(path, function (response) {

            chatterOperate.addComments.push(response);
            var ccid = response.id;
            var scdt = new Date(response.createdDate).format("yyyy-MM-dd hh:mm:ss");
            var content = '<div class="well" myid="commentpanel"><div>' + text + '</div><span ccid="' + response.id + '" style="color: #1574B9;">' + response.user.name + " " + scdt + "</span></div>";

            var clist = fobj.find("[myid='commentpanel']");
            if (clist.length == 0) {
                panel.after(content);
            } else {
                clist.eq(clist.length - 1).after(content);
            }
            fobj.find("[myid='commentinput']").eq(0).val("");
            panel.hide();
            $("#newFeedDialog").hide();
        }, function (response) {
            //error
            alert("add error");
        }, "POST", JSON.stringify(info)
        );

    }
    ,
    getAll: function () {
        var path = '/' + client.apiVersion + "/chatter/feeds/news/me/feed-items";
        $("#content").html("<div class='well'>loading...</div>");
        client.ajax(path, function (response) {

            chatterOperate.result = response;
            chatterOperate.resultArr.push(response);
            var chatter = new itbmobile.chatterData();
            chatter.set({ first: 1, user: itbmobile.currentUser, data: response });
            itbmobile.chatterView = new itbmobile.ChatterView({ model: chatter });
            itbmobile.chatterView.render();
            $("#content").html(itbmobile.chatterView.el);


        }, function () {
            //error
            alert("load error");
        });

    },
    nextpage: function () {
        if (!chatterOperate.result.nextPageUrl) {
            return;
        }

        var st = chatterOperate.result.nextPageUrl.split("chatter/feeds/news/")[1];
        var path = '/' + client.apiVersion + "/chatter/feeds/news/" + st;
        // chatterOperate.result.nextPageUrl;
        client.ajax(path, function (response) {

            alert("nextpage");
            chatterOperate.resultArr.push(response);
            chatterOperate.result = response;
            var chatter = new itbmobile.chatterData();
            chatter.set({ first: 0, user: itbmobile.currentUser, data: response });
            mychatterView = new itbmobile.ChatterView({ model: chatter });
            mychatterView.render();
            var child = $("#content").append(mychatterView.el);
            alert("finished");

        }, function (response) {
            //error
            alert("load error");
            var ddewee = 1;
        });

    }

}
