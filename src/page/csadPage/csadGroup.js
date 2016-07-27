/**
 * 分组信息
 * Created by xiuxiu on 2016/7/18.
 */
define('h5/js/page/csadGroup', [
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/csadCommon',

], function($,URL, Data,CsadCommon) {

    var group = function(){
        var membersList,
        _setTime = setInterval(function ()
        {
            if(sessionStorage.getItem('membersListIM')){
            membersList = sessionStorage.getItem('membersListIM');
            membersList = JSON.parse(membersList);
            console.log(membersList)
                clearInterval(_setTime);
                groups();
                bindEvent();
            }
    },1000);

        //function init(){
        //
        //}

        function bindEvent(){
            $('body')
            //分组展开关闭
                .on('click','.groupList .title',function(){
                    if(!$(this).find('.groupName').hasClass('disable')){
                        ($(this).parent().hasClass('hideGroupMember')) ? $(this).parent().removeClass('hideGroupMember') : $(this).parent().addClass('hideGroupMember')
                    }

                })
                .on('click','.groupItem',function(){
                    CsadCommon.chooseContactDivClick(this);
                })


                //分组的操作


                //添加分组
                .on('click','.addGroupBtn',function(){
                    $('.title').removeClass('currentItem');
                    $('.groupsContent ul').append('<li class="groupList hideGroupMember"><div class="title currentItem"><span class="groupName"></span><span class="number hide">0</span></div><div class="groupMember"></div> </li>');
                    $('.groupList').last().find('.groupName').html('<input value="未命名" name="groupName" />').addClass('disable');
                    $('input[name=groupName]').select();
                })

                //编辑分组
                .on('click','.editGroupBtn',function(){
                    var target = $('.groupsContent .currentItem'),
                        groupName = target.find('.groupName').text();
                    target.find('.number').addClass('hide');

                    target.find('.groupName').html('<input value="'+groupName+'" name="groupName" />').addClass('disable');
                    $('input[name=groupName]').select();
                })
                .on('blur','input[name=groupName]',function(){
                    var target = $('.groupsContent .currentItem').parents('li'),
                        groupName = $(this).val(),
                        groupid = target.data('id') ? target.data('id') : '';
                    target.find('.groupName').html(groupName).removeClass('disable');
                    target.find('.number').removeClass('hide');
                    editOrAddGroup(groupid,target.find('.groupName'),target);
                })
                //删除分组
                .on('click','.deleteGroupBtn',function(){
                    var target = $('.groupsContent .currentItem').parents('li');
                    deleteGroup(target);
                })

                //将好友放入分组内
                .on('click','.groupItemLi',function(){
                    var currentItem = $('.currentItem'),
                        groupId = $(this).data('id'),
                        fUserId = currentItem.data('fuserid'),
                        data = {
                            groupId:groupId,
                            fUserId:fUserId
                        }
                    Data.changeFriendsGroupMap(data).done(function(){
                        $('.groupList').each(function(){
                            if($(this).data('id') == groupId){
                                currentItem.attr('data-groupid',groupId);
                                var currentItemHtm = currentItem.clone();
                                var Oldnumber = parseInt(currentItem.parents('.groupList').find('.number').text());
                                currentItem.parents('.groupList').find('.number').text(--Oldnumber);
                                currentItem.remove();
                                // console.log( $(this).find('dl').length,currentItemHtm)
                                $(this).find('dl').length == 0 ? $(this).find('.groupMember').append('<dl></dl>') :  '';
                                $(this).find('dl').append(currentItemHtm);
                                var Newnumber = parseInt($(this).find('.number').text());
                                $(this).find('.number').text(++Newnumber);

                            }
                        })
                        $('.groupItem').contextmenu(function() {
                            var oMenu2 = document.getElementById("rightMenu2");
                            var oMenu = document.getElementById("rightMenu");
                            $('.title').removeClass('currentItem');
                            $('.groupItem').removeClass('currentItem');
                            $(this).addClass('currentItem');
                            contextMenu(oMenu2);
                            oMenu.style.display = "none";
                            return false;
                        })
                    })

                })

                //修改好友备注
                .on('click','.editMemberBtn',function(){
                    var target = $('.currentItem'),
                        userNote = target.find('em').text(),
                        nickName = target.find('i') ? target.find('i').text() : userNote;
                    target.find('img').addClass('hide');


                    target.find('span').html('<input value="'+userNote+'" name="memberName" />').addClass('disable').attr('data-nickname',nickName);
                    $('input[name=memberName]').select();
                })
                .on('blur','input[name=memberName]',function(){
                    var target = $('.currentItem'),
                        memberName = $(this).val(),
                        memberid = target.data('id');
                    target.find('span').removeClass('disable');
                    target.find('img').removeClass('hide');
                    var data = {
                        id:memberid,
                        userName:memberName
                    }
                    Data.modFriendsName(data).done(function(){
                        var _spanD = target.find('span'),
                            _nickName = _spanD.data('nickname');
                        _spanD.html('<em>'+memberName+'</em>(<i>'+_nickName+'</i>)');

                    })
                })

                .on('keyup','#kw',function(){
                    getContent('#kw');
                })
                .on('click','.icon-search',function(){
                    getContent('#kw');
                })

            //搜索
            $(document).keydown(function(e){
                e = e || window.event;
                var keycode = e.which ? e.which : e.keyCode;
                if(keycode == 38){
                    if($.trim($("#append").html())==""){
                        return;
                    }
                    movePrev();
                }else if(keycode == 40){
                    if($.trim($("#append").html())==""){
                        return;
                    }
                    $("#kw").blur();
                    if($(".item").hasClass("addbg")){
                        moveNext();
                    }else{
                        $(".item").removeClass('addbg').eq(0).addClass('addbg');
                    }

                }else if(keycode == 13){
                    dojob();
                }
            });

            var movePrev = function(){
                $("#kw").blur();
                var index = $(".addbg").prevAll().length;
                if(index == 0){
                    $(".item").removeClass('addbg').eq($(".item").length-1).addClass('addbg');
                }else{
                    $(".item").removeClass('addbg').eq(index-1).addClass('addbg');
                }
            }

            var moveNext = function(){
                var index = $(".addbg").prevAll().length;
                if(index == $(".item").length-1){
                    $(".item").removeClass('addbg').eq(0).addClass('addbg');
                }else{
                    $(".item").removeClass('addbg').eq(index+1).addClass('addbg');
                }

            }

            var dojob = function(){
                $("#kw").blur();
                var value = $(".addbg").text();
                $("#kw").val(value);
                $("#append").hide().html("");
            }
        }

        //搜索
        function getContent(obj){
            var kw = $.trim($(obj).val());
            if(kw == ""){
                $("#append").hide().html("");
                return false;
            }
            var html = "";

            $.each(membersList,function(i,item){
                $.each(item.friendsGroupMapList,function(j,memberItem){
                    if (memberItem.profileName && memberItem.profileName.indexOf(kw) >= 0 || memberItem.userName && memberItem.userName.indexOf(kw) >= 0) {
                        var headPic = memberItem.profilePic ? memberItem.profilePic : 'http://mikumine.b0.upaiyun.com/common/images/avatar-small.png',
                            _userName = memberItem.userName ? memberItem.userName + '(<i>'+memberItem.profileName+'</i>)' : memberItem.profileName;
                        html = html +  '<div class="resultItem row" data-groupid="'+item.id+'" data-id="'+memberItem.emUserName+'" id="'+memberItem.emUserName+'" type="chat" displayname="'+memberItem.emUserName+'" data-fuserid="'+memberItem.userId+'"><div class="headPic '+memberItem.emUserName+'_imgUrl"><img src="'+headPic+'"/></div><div class="col col-15"><p>'+_userName+'</p><p>来自分组：'+item.name+'</p></div> </div>'
                    }
                })
            })
            if(html != ""){
                $("#append").show().html('<p class="search_result_tit">搜索结果</p>'+html);
            }else{
                $("#append").hide().html("");
            }
        }

        //************结束搜索


        //分组
        function groups(){
            $('body').append('<div class="groupsContent" id="container"><div class="search-wrap"><div class="row search-box"><div class="icon-search search-submit"></div><div class="input-wrap"><input type="text" class="search-input" id="kw" placeholder="搜索"></div><div class="icon-wrap" style="display: none;"><i class="icon-close"></i></div></div></div><div id="append" class="grid hide"></div><ul></ul></div><div id="rightMenu" class="rightMenu"><ul><li class="addGroupBtn">添加分组</li><li class="deleteGroupBtn"> 删除分组</li><li class="editGroupBtn"> 修改分组</li></ul></div><div id="rightMenu2" class="rightMenu"><ul><li class="deleteMemberBtn"> 删除好友</li><li class="editMemberBtn"> 修改好友备注</li><li class="moveMemberBtn"> 将好友移动到<ul class="allGroup"></ul></li></ul></div>');
            var template = '<li class="groupList hideGroupMember" data-id="{{id}} "><div class="title"><span class="groupName">{{name}}</span><span class="number">{{count}}</span></div><div class="groupMember">{{dlHtml}}</div> </li>',
                liHtmls = [];

            //Data.getGroupAndFriendsList().done(function(res){
            //    var list = res.list;
            //
            //    if(list.length > 0){
            //
                   // membersList = list;
                    $.each(membersList,function(index,item){
                        var templateContent = '<dd class="groupItem" data-groupid="{{groupId}}" data-id="{{id}}" id="miku_{{fUserId}}" type="chat" displayname="miku_{{fUserId}}" data-fuserid="{{fUserId}}"><img class="miku_{{fUserId}}_imgUrl" src="{{profilePic}}" /><span>{{name}}</span></dd>',
                            dlHtml = [];
                        $.each(item.friendsGroupMapList,function(index,dlitem){
                            dlitem.profilePic = dlitem.profilePic ? dlitem.profilePic : imgPath+'common/images/avatar-small.png';
                            dlitem.name = dlitem.userName ? '<em>'+dlitem.userName + '</em>(<i>'+dlitem.profileName+'</i>)' : '<em>'+dlitem.profileName+ '</em>';
                            dlHtml.push(bainx.tpl(templateContent,dlitem));
                        })
                        item.dlHtml = dlHtml.length > 0 ? '<dl>'+dlHtml.join('')+'</dl>' : '';
                        item.count = item.friendsGroupMapList.length;
                        liHtmls.push(bainx.tpl(template,item));
                    })
                    $('.groupsContent ul').append(liHtmls.join(''));

             //   }

                defineContext();
          //  })
            Data.getMikuFriendsGroupList().done(function(res){
                var allGroupTpl = '<li data-id="{{id}}" class="groupItemLi">{{name}}</li>',
                    html = [];
                $.each(res.list,function(index,item){
                    html.push(bainx.tpl(allGroupTpl,item));
                })
                $('.allGroup').append(html.join(''));
            })

        }

        var getOffset = {
            top: function (obj) {
                return obj.offsetTop + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0)
            },
            left: function (obj) {
                return obj.offsetLeft + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0)
            }
        };
        var aDoc = [document.documentElement.offsetWidth, document.documentElement.offsetHeight];
        //设置右键
        function defineContext()
        {
            var oMenu = document.getElementById("rightMenu");
            var oMenu2 = document.getElementById("rightMenu2");
            var aUl = oMenu.getElementsByTagName("ul");
            var aUl2 = oMenu2.getElementsByTagName("ul");
            var container = document.getElementById("container");

            // console.log(aDoc)
            rightMenu(oMenu);
            rightMenu(oMenu2);
            var cLi = container.getElementsByTagName("li");
            //自定义右键菜单

            //右键
            $('.title').contextmenu(function() {
                $('.title').removeClass('currentItem');
                $('.groupItem').removeClass('currentItem');
                $(this).addClass('currentItem');
                contextMenu(oMenu,aUl);
                oMenu2.style.display = "none";
                return false;
            })
            $('.groupItem').contextmenu(function() {
                $('.title').removeClass('currentItem');
                $('.groupItem').removeClass('currentItem');
                $(this).addClass('currentItem');
                contextMenu(oMenu2);
                var editMemberB = $('.editMemberBtn');
                (!$(this).data('groupid')) ? editMemberB.addClass('hide') : editMemberB.removeClass('hide');
                oMenu.style.display = "none";
                return false;
            })

            //点击隐藏菜单
            document.onclick = function ()
            {
                oMenu.style.display = "none";
                oMenu2.style.display = "none";
            };
        }
        function rightMenu(oMenu){

            var aUl = oMenu.getElementsByTagName("ul");
            var aLi = oMenu.getElementsByTagName("li");
            var showTimer = hideTimer = null;
            var i = 0;
            var maxWidth = maxHeight = 0;


            oMenu.style.display = "none";

            for (i = 0; i < aLi.length; i++)
            {
                //为含有子菜单的li加上箭头
                aLi[i].getElementsByTagName("ul")[0] && (aLi[i].className = "sub");

                //鼠标移入
                aLi[i].onmouseover = function ()
                {
                    var oThis = this;
                    var oUl = oThis.getElementsByTagName("ul");

                    //鼠标移入样式
                    oThis.className += " active";

                    //显示子菜单
                    if (oUl[0])
                    {
                        clearTimeout(hideTimer);
                        showTimer = setTimeout(function ()
                        {
                            for (i = 0; i < oThis.parentNode.children.length; i++)
                            {
                                oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
                                (oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
                            }
                            oUl[0].style.display = "block";
                            oUl[0].style.top = oThis.offsetTop + "px";
                            oUl[0].style.left = oThis.offsetWidth + "px";
                            // setWidth(oUl[0]);

                            //最大显示范围
                            maxWidth = aDoc[0] - oUl[0].offsetWidth;
                            maxHeight = aDoc[1] - oUl[0].offsetHeight;

                            //防止溢出
                            maxWidth < getOffset.left(oUl[0]) && (oUl[0].style.left = -oUl[0].clientWidth + "px");
                            maxHeight < getOffset.top(oUl[0]) && (oUl[0].style.top = -oUl[0].clientHeight + oThis.offsetTop + oThis.clientHeight + "px")
                        },300);
                    }
                };

                //鼠标移出
                aLi[i].onmouseout = function ()
                {
                    var oThis = this;
                    var oUl = oThis.getElementsByTagName("ul");
                    //鼠标移出样式
                    oThis.className = oThis.className.replace(/\s?active/,"");

                    clearTimeout(showTimer);
                    hideTimer = setTimeout(function ()
                    {
                        for (i = 0; i < oThis.parentNode.children.length; i++)
                        {
                            oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
                            (oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
                        }
                    },300);
                };
            }
        }

        function contextMenu(oMenu){
            var event = event || window.event;
            oMenu.style.display = "block";
            oMenu.style.top = event.clientY + "px";
            oMenu.style.left = event.clientX + "px";

            //setWidth(aUl[0]);

            //最大显示范围
            maxWidth = aDoc[0] - oMenu.offsetWidth;
            maxHeight = aDoc[1] - oMenu.offsetHeight;

            //防止菜单溢出
            oMenu.offsetTop > maxHeight && (oMenu.style.top = maxHeight + "px");
            oMenu.offsetLeft > maxWidth && (oMenu.style.left = maxWidth + "px");
            //return false;
        }

        //编辑分组


        //编辑分组 && 提交
        function editOrAddGroup(groupid,groupName,target){
            var data = {
                id:groupid,
                name:groupName.text()
            }
            Data.createOrEditMikuFriendsGroup(data).done(function(res){
                // console.log(groupid)
                var vo = res.vo;

                groupName.text(vo.name);
                if(!groupid){            //添加分组
                    target.attr('data',vo.id);
                    $('.allGroup').append('<li data-id="'+vo.id+'">'+vo.name+'</li>');
                }else{
                    $('.allGroup li').each(function(){
                        if($(this).data('id') == vo.id){
                            $(this).text(vo.name);
                        }
                    })
                }
            })
        }
        //删除分组
        function deleteGroup(target){
            if(target.find('.groupMember').find('dd').length == 0){
                var groupid = target.data('id'),
                    data = {
                        id:groupid
                    }
                Data.delMikuFriendsGroup(data).done(function(){
                    target.remove();
                    bainx.broadcast('删除成功！');
                })
            }else{
                bainx.broadcast('该组内还有成员不能删除哦~');
            }

        }


      //  init();

    }
    return group;

})