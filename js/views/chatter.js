itbmobile.ChatterView = Backbone.View.extend({

    // events:{
    //     "click #showMeBtn":"showMeBtnClick"
    // },
    render: function () {
        this.el = this.template(this.model.attributes);

        return this;
    }

});


itbmobile.ChatterCommentView = Backbone.View.extend({
  render: function () {
        this.el = this.template(this.model.attributes);

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
    fobj: null,
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
    wait: function () {
        $("#waitflag").show();
        $("#fullbg").show();
    },
    hideWait: function () {
        $("#waitflag").hide();
        $("#fullbg").hide();
    },
    showGroupChoicePanel: function () {
        var ad = chatterOperate.getPostion($("#btnselectChoice").get(0));
        document.getElementById("selectChoice").style.left = ad.left + "px";
        document.getElementById("selectChoice").style.top = (ad.top + ad.height) + "px";
        document.getElementById("selectChoice").style.display = "block";
    },
    newFeed: function () {
        chatterOperate.wait();
        var text = $("#feedtxt").val();
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
                var chatter = new itbmobile.chatterData();
                var feeds = [];
                feeds.push(response);
                chatter.set({ first: 0, user: itbmobile.currentUser, newgroup: { id: id, img: groupimg, name: groupname }, data: { items: feeds} });
                var mychatterView = new itbmobile.ChatterView({ model: chatter });
                mychatterView.render();
                var content = mychatterView.el;
                $("#content").prepend(content);
                $("#commentinputDialog").hide();
                chatterOperate.hideWait();

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
            var chatter = new itbmobile.chatterData();
            var feeds = [];
            feeds.push(response);
            chatter.set({ first: 0, user: itbmobile.currentUser, newgroup: false, data: { items: feeds} });
            var mychatterView = new itbmobile.ChatterView({ model: chatter });
            mychatterView.render();
            var content = mychatterView.el;
            $("#content").prepend(content);
            $("#commentinputDialog").hide();
            chatterOperate.hideWait();
        }, function (response) {
            //error
            alert("error");
        }, "POST", JSON.stringify(info)
    );

    },

    commentlike: function (obj, cid) {
        chatterOperate.wait();
        var fobj = $(obj).parents("[myid='commentpanel']");
        var commentlikes = fobj.find("[myid='clikes']").eq(0);


        if (obj.src.indexOf("unlike.png") != -1) {
            var likeli = fobj.find('[clcid="' + itbmobile.currentUser.id + '"]');
            var likeid = likeli.attr("clikeid");
            chatterOperate.unlike(likeid, function (response) {

                obj.src = "images/like.png";
                likeli.remove();
                chatterOperate.hideWait();
            });

            return;
        }



        if (obj.src.indexOf("like.png") != -1) {

            var path = '/' + client.apiVersion + "/chatter/comments/" + cid + "/likes";
            client.ajax(path, function (response) {
                var li = '<li clcid="' + itbmobile.currentUser.id + '" clikeid="' + response.id + '"><a href="javascript:void(0)"><img src="images/like.png"/> you</a></li>';
                if (commentlikes.length == 0) {

                    fobj.append('<ul myid="clikes" class="nav nav-list">' + li + "</ul>");
                }
                else {
                    commentlikes.append(li);
                }
                obj.src = "images/unlike.png";
                chatterOperate.hideWait();

            }, function (response) {

                alert("error");
            }, "POST");

            return;
        }





    },

    dolike: function (obj, cid) {
        chatterOperate.wait();
        var fobj = $(obj).parents('[cid]');
        var commlike = fobj.find("[myid='commentlike']").eq(0);
        if (obj.src.indexOf("unlike.png") != -1) {
            var likeli = commlike.find('[lcid="' + itbmobile.currentUser.id + '"]');
            var likeid = likeli.attr("likeid");
            chatterOperate.unlike(likeid, function (response) {
                chatterOperate.hideWait();
                obj.src = "images/like.png";
                likeli.remove();
            });
            return;
        }


        var path = '/' + client.apiVersion + "/chatter/feed-items/" + cid + "/likes";
        client.ajax(path, function (response) {

            chatterOperate.hideWait();
            obj.src = "images/unlike.png";
            var li = '<ul myid="commentlike" class="nav nav-list"><li lcid="' + itbmobile.currentUser.id + '" likeid="' + response.id + '"><a href="javascript:void(0)"><img src="images/like.png" /> you</a></li>';
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
        $("#commentinputDialog").show();

    },
    addOneFeed: function () {
        $("#newFeedDialog").show();
    },
    addonecomment: function (obj) {
        chatterOperate.fobj = $(obj).parents('[cid]');
        $("#commentDialog").show();
    }
    ,
    hideAddonecomment: function (obj) {
        $(obj).parent().parent().hide();
    }
    ,


    newAcomment: function () {

        chatterOperate.wait();

        var fobj = chatterOperate.fobj;
        var feedID = fobj.attr("cid");
        var text = $('#commenttxt').val();
        var text1 = text.replace(/\n/g, '<br />');
        var panel = fobj.find("[myid='addcommentDIV']").eq(0);
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
            chatterOperate.hideWait();
            var ccid = response.id;
            var scdt = new Date(response.createdDate).format("yyyy-MM-dd hh:mm:ss");
            var chatter = new itbmobile.chatterData();
            chatter.set({ name: response.user.name, dt: scdt, text: text1, id: response.id });
            var myView = new itbmobile.ChatterCommentView({ model: chatter });
            myView.render();
            var content = myView.el;
            if (panel.next().attr("myid") == "commentlike") {
                panel.next().after(content);
            }
            else {
                panel.after(content);
            }
            $('#commenttxt').val("");
            $("#commentDialog").hide();
        }, function (response) {
            //error
            alert("add error");
        }, "POST", JSON.stringify(info)
        );

    },
    getAllGroups: function () {
        var path = '/' + client.apiVersion + '/chatter/groups';
        client.ajax(path, function (response) {
            chatterOperate.groups = response;
            chatterOperate.getAll();
        },
           function (response) {

               alert("error");

           });
    }
    ,
    getAll: function () {
        chatterOperate.wait();
        var path = '/' + client.apiVersion + "/chatter/feeds/news/me/feed-items";
        client.ajax(path, function (response) {
            chatterOperate.hideWait();
            chatterOperate.result = response;
            chatterOperate.resultArr.push(response);
            var chatter = new itbmobile.chatterData();
            chatter.set({ first: 1, user: itbmobile.currentUser, newgroup: false, data: response });
            itbmobile.chatterView = new itbmobile.ChatterView({ model: chatter });
            itbmobile.chatterView.render();
            $("#content").html(itbmobile.chatterView.el);
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
            chatterOperate.hideWait();

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
            $("#bottompanel").hide();
            chatterOperate.resultArr.push(response);
            chatterOperate.result = response;
            var chatter = new itbmobile.chatterData();
            chatter.set({ first: 0, user: itbmobile.currentUser, newgroup: false, data: response });
            mychatterView = new itbmobile.ChatterView({ model: chatter });
            mychatterView.render();
            var child = $("#content").append(mychatterView.el);

            // $("#content").find("[id='bottompanel']").remove();



        }, function (response) {
            //error
            alert("load error");
            var ddewee = 1;
        });

    }

}
