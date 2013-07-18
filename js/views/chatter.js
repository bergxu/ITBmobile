itbmobile.ChatterView = Backbone.View.extend({

    // events:{
    //     "click #showMeBtn":"showMeBtnClick"
    // },
    render: function () {
        this.el = this.template(this.model.attributes);

        return this;
    }

});

itbmobile.ChatterHeaderView = Backbone.View.extend({

    render: function () {
        this.$el.html('<ul class="nav"><li><a href="#"><i class="icon-home icon-2x"></i></a></li></ul><div class="navbar-inner"><a href="javascript:void(1);" onclick="chatterOperate.showNewFeedPanel(this)"><i class="icon-comments icon-2x"></i></a></div>'+
        '<div id="bottompanel" class="well" style="position:fixed; bottom:0px; height:35px; width:100%; text-align:center; vertical-align:middle;display:none;color:blue">loading.....</div>');
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
    groups: null,
    getPostion: function (e) {
        var t = e.offsetTop;
        var l = e.offsetLeft;
        var w = e.offsetWidth;
        var h = e.offsetHeight;
        while (e = e.offsetParent) {
            t += e.offsetTop;
            l += e.offsetLeft;
        }

        return { top: t, left: l, height: h, width: w };

    },

    shownewFeedWin: function () {
        $("#fullbg").show();
        $("#commentinputDialog").show();

    },
    showGroupChoicePanel: function () {
        var ad = chatterOperate.getPostion($("#btnselectChoice").get(0));
        document.getElementById("selectChoice").style.left = ad.left + "px";
        document.getElementById("selectChoice").style.top = (ad.top + ad.height) + "px";
        document.getElementById("selectChoice").style.display = "block";
    },
    newFeed: function () {

        var text = $("#feedtext").val();
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
        var path = '/' + client.apiVersion + "/chatter/feeds/news/me/feed-items?text=New+post";

        if ($("#selectGroup:visible").length > 0) {
            var id = $("#selectGroup").find("option:selected").eq(0).attr("groupid");
            var groupname = $("#selectGroup").find("option:selected").eq(0).text();
            var groupimg = null;

            for (var k = 0; k <= chatterOperate.groups.groups.length - 1; k++) {
                if (chatterOperate.groups.groups[k].id == id) {
                    groupimg = chatterOperate.groups.groups[k].photo.standardEmailPhotoUrl;
                    break;

                }

            }


            path = '/' + client.apiVersion + "/chatter/feeds/record/" + id + "/feed-items";
            client.ajax(path, function (response) {
                //callback
                alert("send group");

                var chatter = new itbmobile.chatterData();
                var feeds = [];
                feeds.push(response);
                chatter.set({ first: 0, user: itbmobile.currentUser, newgroup: { id: id, img: groupimg, name: groupname }, data: { items: feeds} });
                var mychatterView = new itbmobile.ChatterView({ model: chatter });
                mychatterView.render();
                var content = mychatterView.el;
                $("#content").prepend(content);
                $("#newFeedDialog").hide();

                return;
            }, function (response) {
                //error
                alert("error");
                return;
            }, "POST", JSON.stringify(info)
		);

            return;
        }


        client.ajax(path, function (response) {
            //callback

            var chatter = new itbmobile.chatterData();
            var feeds = [];
            feeds.push(response);
            chatter.set({ first: 0, user: itbmobile.currentUser, newgroup: false, data: { items: feeds} });
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

        var fobj = $(obj).parents("[myid='commentpanel']");
        var commentlikes = fobj.find("[myid='clikes']").eq(0);


        if (obj.src.indexOf("unlike.png") != -1) {
            var likeli = fobj.find('[clcid="' + itbmobile.currentUser.id + '"]');
            var likeid = likeli.attr("clikeid");
            chatterOperate.unlike(likeid, function (response) {
                alert("delete");
                obj.src = "img/like.png";
                likeli.remove();
            });

            return;
        }



        if (obj.src.indexOf("like.png") != -1) {

            var path = '/' + client.apiVersion + "/chatter/comments/" + cid + "/likes";
            client.ajax(path, function (response) {
                var li = '<li clcid="' + itbmobile.currentUser.id + '" clikeid="' + response.id + '"><a href="javascript:void(0)"><img src="img/like.png"/> you</a></li>';
                if (commentlikes.length == 0) {

                    fobj.append('<ul myid="clikes" class="nav nav-list">' + li + "</ul>");
                }
                else {
                    commentlikes.append(li);
                }
                obj.src = "img/unlike.png";

            }, function (response) {

                alert("error");
            }, "POST");

            return;
        }





    },

    dolike: function (obj, cid) {

        var fobj = $(obj).parents('[cid]');
        var commlike = fobj.find("[myid='commentlike']").eq(0);
        if (obj.src.indexOf("unlike.png") != -1) {
            var likeli = commlike.find('[lcid="' + itbmobile.currentUser.id + '"]');
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
            var li = '<ul myid="commentlike" class="nav nav-list"><li lcid="' + itbmobile.currentUser.id + '" likeid="' + response.id + '"><a href="javascript:void(0)"><img src="img/like.png" />you</a></li>';
            if (commlike.length == 0) {
                fobj.find("[myid='addcommentDIV']").eq(0).after('<ul myid="commentlike" class="nav nav-list">' + li + "</ul>");
            }
            else {
                commlike.eq(0).prepend(li);
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
        client.ajax(path, callback, function (response) {
            alert("error");
        }, "DELETE");
    },
    showNewFeedPanel: function () {
        $("#fullbg").show();
        $("#commentinputDialog").show();

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
            var ccid = response.id;
            var scdt = new Date(response.createdDate).format("yyyy-MM-dd hh:mm:ss");
            var content = '<div class="well" myid="commentpanel"><div>' + text + '</div><span ccid="' + response.id + '" style="color: #1574B9;">' + response.user.name + " " + scdt + '</span><div><a href="javascript:void(0)"><img src="img/like.png"  onclick="chatterOperate.commentlike(this,\'' + response.id + '\')"/></a></div></div>';
            var clist = fobj.find("[myid='commentpanel']");
            if (clist.length == 0) {
                if (panel.next().attr("myid") == "commentlike") {
                    panel.next().aftert(content);
                }
                else {
                    panel.after(content);
                }
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

    },
    getAllGroups: function () {
        var path = '/' + client.apiVersion + '/chatter/groups';
        client.ajax(path, function (response) {
            alert("group success");

            chatterOperate.groups = response;
            chatterOperate.getAll();
        },
           function (response) {

               alert("error");

           });
    }
    ,
    getAll: function () {
        var path = '/' + client.apiVersion + "/chatter/feeds/news/me/feed-items";
        $("#content").html("<div class='well'>loading...</div>");
        client.ajax(path, function (response) {

            chatterOperate.result = response;
            chatterOperate.resultArr.push(response);
            var chatter = new itbmobile.chatterData();
            chatter.set({ first: 1, user: itbmobile.currentUser, newgroup: false, data: response });
            itbmobile.chatterView = new itbmobile.ChatterView({ model: chatter });
            itbmobile.chatterView.render();
            $("#content").html(itbmobile.chatterView.el);
            alert("receive");
            return;
            $(window).bind("scroll", function () {

                if (window.location.href.indexOf("#chatter") == -1) {
                    $(window).unbind("scroll");
                    return;
                }
                var wh = $(window).height();
                if (!chatterOperate.result.nextPageUrl) {
                    return;
                }

                if ((document.body.scrollHeight - wh - document.body.scrollTop) <= 10) {
                    $("#bottompanel").show();
                    chatterOperate.nextpage();
                }
            });


            $("#selectChoice li").bind("click", function () {
                $("#btnselectChoice").html($(this).text() + ' <span class="caret"></span>');
                $("#selectChoice").hide();

                if ($(this).text() == "My Fellows") {
                    $("#selectGroup").hide();

                }
                else {
                    $("#selectGroup").show();

                }
            });


            $('#selectGroup').html("");
            var li = "";
            $.each(chatterOperate.groups.groups, function (i, n) {
                li = li + '<option groupid="' + n.id + '"><a href="javascript:void(0)">' + n.name + '</a></option>';
            });
            $('#selectGroup').html(li);


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
            chatter.set({ first: 0, user: itbmobile.currentUser, newgroup: false, data: response });
            mychatterView = new itbmobile.ChatterView({ model: chatter });
            mychatterView.render();
            var child = $("#content").append(mychatterView.el);
            $("#bottompanel").hide();
            alert("finished");

        }, function (response) {
            //error
            alert("load error");
            var ddewee = 1;
        });

    }

}
