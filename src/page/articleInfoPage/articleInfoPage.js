/**
 * 发现文章详情
 * Created by Spades-k on 2016/6/1.
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/common/loadImage',
    'h5/js/common/nexter',
    'h5/js/common/transDialog',
    'h5/js/common/lazyload',
    'plugin/pinchzoom/0.0.2/pinchzoom',
], function ($, Data, Common, URL,LoadImage, Nexter,Dialog,Lazyload,Pinchzoom) {
    var Page,
        userId=pageConfig.pid,
        cid=URL.param.cid,
        dyid=URL.param.dyid,
        goalType=URL.param.goalType,
        userName=URL.param.userName,
        firstLoad=true,
        ifcomment=false,
        ifclikes=false,
        iflikes=false,
        iffollow=false;
    function init(){
        render();
        //评论
        var tem='<div class="nivo row" style="display: none;"><div class="col col-6 nivo_title">全部评论</div><!--<div class="col col-19 row far"><div class="f_clikes " data-clicks=""><i></i><span></span></div><div class="f_comment" id="f_comment"><i></i><span></span></div><div class="f_likes" data-likes="" data-id=""><i></i><span></span></div><div class="f_share" id="f_share"><i></i><span></span></div></div>--></div>';
        $('.nav_box').append(tem);
    }

    function render(){
        $('.waitting').hide();
        Page=$('<section class="page-content grid"><div class="con_head"></div><div class="content"></div><div class="nav_box"></div><div class="comment"><ul></ul></div><p id="datahide" data-contenThumbPicUrl="" data-contentAbstract="" style="display:none;"></p></section><!--<section class="header" style="display: block;"><div class="navbar"><div class="btn-navbar navbar-left"><span href="javascript:history.go(-1);" class="icon icon-return"></span></div><div class="navbar-main"></div><div class="btn-navbar navbar-right"></div></div></section>--><div class="large animated fadeInDown" id="large_container" style="display:none"><img id="large_img"> </div>').appendTo('body');


        //showpicList();
        var commentHtml = '<footer class="grid"><div class="f_box row fvc"><div class="msg_addpic col col-3 hide"><!--<div class="click_btn"><i class="click_i" data-clicks=""></i></div>--><form id="my_form" enctype="multipart/form-data"><div class="img_box"><img id="img_btn" src="'+URL.imgPath+'common/images/find/icon_pic.png"/><div class="f_addpic"><div class="addpic_i"></div></div></div><input type="hidden" name="type" value="6"> <input type="file" class="file" name="file" multiple="multiple"></form></div><div class="msg_in col col-21"><input id="msg_in_input" type="text" placeholder="说点什么吧～"></div><div class="msg_btn col col-3"><div class="collect_btn row fac fvc"><img data-likes="" src="'+URL.imgPath+'/common/images/find/article_collect_max.png"/></div><p class="send hide" data-commentType="1" data-targetCommentId="0">发送</p></div></div></footer>';
        $('body').append(commentHtml);

        document.getElementById('msg_in_input').addEventListener('click', function(event){
            $('.collect_btn').hide();
            $('.send').show();
            $('.msg_in input').val('');
            if($('.send').attr('data-commenttype')==2){
                $('.msg_addpic').hide();
            }else{
                $('.msg_addpic').show();
                $('.msg_in input').attr('placeholder','说点什么吧～');
                $('.msg_btn p').attr('data-commentType','1');
                $('.msg_btn p').attr('data-targetCommentId','0');
            }
        },false);
        conHead();
        if ($('.comment').offset().top < $(window).height()*1.5 && firstLoad) {
            firstLoad = false;
        }
        //articleCon();
    }

    //图片显示
    //function showpicList(){
    //    var template='<ul class="row"><li class="col col-25"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160517/vNTT-0-1463450642438.png"></li><li class="col col-25"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160517/vNTT-0-1463450642438.png"></li><li class="col col-25"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160517/vNTT-0-1463450642438.png"></li><li class="col col-25"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160517/vNTT-0-1463450642438.png"></li><li class="col col-25"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160517/vNTT-0-1463450642438.png"></li><li class="col col-25"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160517/vNTT-0-1463450642438.png"></li></ul>';
    //    //var html=[];
    //    //$.each(list, function (index, item) {
    //    //    html.push(bainx.tpl(template,item));
    //    //})
    //    $('.content_pic').append(template);
    //}

    //头部图
    function conHead(){
        userId ? userId : userId=-1;
        var data={
            cid:cid,
            dyid:dyid,
            goalType:goalType,
            userId:userId
        }
        Data.seeOneSnsContentDetail(data).done(function(res) {//查看详情
            var template = '<img src="{{contentSurfacePicUrl}}"/><!--<div class="head_nva row"><div class="col col-5"><i href="javascript:history.go(-1);" class="nav_back"></i></div><div class="col col-20 row far"><i class="clicks" data-clicks="{{praiseFlag}}"></i><i class="share"></i></div></div>-->';
            var content = res.content,
                dynamic = res.dynamic,
                profile = res.profile,
                praiseList=res.praiseList,
                scuserlist=res.scuserlist,
                html = [],
                html1 = [],
                html_tpm=[];
            if (res) {
                content.praiseFlag = res.praiseFlag;//是否点赞
                //$('.navbar-main').text(content.contentShortTitle);
                //$('.f_clikes').attr('data-clicks',content.praiseFlag);
                html.push(bainx.tpl(template, content));
                $('.con_head').append(html.join(''));
                var template1 = '<div class="row content_box"><div class="con_people col col-15 row fvc"><div class="portrait"><img src="{{profilePic}}"></div><p>{{nickname}}</p></div><div class="col col-10 con_follow row far fvc" style="{{showorhide}}"><div class="follow" data-goalUserId="{{goalUserId}}" data-follow="{{attentionType}}">{{isfollow}}</div></div></div><div class="art_msg row"><div class="col col-20 row fvc time_box"><i class="time"></i>{{dateCreated}}</div><div class="col col-5 row fvc browse_box far"><i class="browse"></i>{{timesOfBrowsed}}</div></div><div class="art_text">{{content}}</div><div class="clike_num"><p class="tc num_t row fac fvc">～<span class="numchang">{{timesOfCollected}}</span><span class="textchang">人收藏</span><span class="collect_i"></span>～</p><div class="people_portrait row fvc fac">{{praisehtml}}</div></div><input type="hidden" id="data_shareandcollectn" data-contenThumbPicUrl="{{contenThumbPicUrl}}" data-contentAbstract="{{contentAbstract}}" data-cid="{{id}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}" data-attentionType="{{attentionType}}" data-collectFlag="{{collectFlag}}">';

                content.dateCreated = bainx.formatDate('Y-m-d h:i', new Date(content.dateCreated));
                content.dyid=dynamic.id;
                content.goalType=dynamic.goalType;
                content.attentionType=res.attentionType;
                content.collectFlag=res.collectFlag;
                if(res.attentionType==1){
                    content.isfollow='已关注';
                }else{
                    content.isfollow='关注ta';
                }
                content.timesOfCollected=dynamic.timesOfCollected;
                content.timesOfBrowsed = dynamic.timesOfBrowsed;
                content.nickname = profile.nickname;
                content.goalUserId=profile.id;
                profile.id==userId ? content.showorhide='display:none;' : content.showorhide='';
                profile.profilePic ? content.profilePic = profile.profilePic : content.profilePic = 'http://mikumine.b0.upaiyun.com/common/images/avatar-small.png';

                content.timesOfCommented=dynamic.timesOfCommented;
                content.timesOfReferenced=dynamic.timesOfReferenced;//转发
                content.timesOfPraised=dynamic.timesOfPraised;
                //$('.f_clikes').find('span').text(dynamic.timesOfPraised);
                $('.click_i').attr('data-clicks',content.praiseFlag);
                //var content=content,
                 var html=[];
                $.each(scuserlist,function(index,item){
                    var profilePic;
                    item.profilePic ? profilePic=item.profilePic : profilePic=''+URL.imgPath+'common/images/avatar-small.png';
                    html.push('<div class="pic" data-id="'+item.id+'"><img src="'+profilePic+'" /></div>');
                    content.praisehtml=html.join('');
                })
                //$('.f_likes').attr('data-likes',res.collectFlag);
                //$('.f_comment').find('span').text(dynamic.timesOfCommented);
                ////$('.f_share').find('span').text(dynamic.timesOfReferenced);
                //$('.f_likes').find('span').text(dynamic.timesOfCollected);
                html1.push(bainx.tpl(template1, content));
                $('.content').append(html1.join(''));
                $('.collect_btn img').attr('data-likes',content.collectFlag);
                if (content.collectFlag == 1) {
                    $('.collect_i').attr('id','showlikesed');
                    $('.collect_btn img').attr('src',""+URL.imgPath+"common/images/find/article_collected_max.png");
                    $('.textchang').text('人收藏');
                }
                //if(res.collectFlag==1){
                //    $('.f_likes').attr('id', 'likesed');
                //}
                $('#datahide').attr('data-contenThumbPicUrl',content.contenThumbPicUrl);
                $('#datahide').attr('data-contentAbstract',content.contentAbstract);

                $('.nivo').show();
                conHandle();
                comment();
                //adsorbent();
            }
        })
    }

    //评论
    function comment(){

        var data={
            goalId:dyid
        }
        var element = $('.page-content');
        var nexter = new Nexter({
            element: element,
            dataSource: Data.selectSnsComentIndexPage,
            enableScrollLoad: true,
            scrollBodyContent: $('.comment ul'),
            data: data,
        }).load().on('load:success', function(res) {
            var template='<li class="grid box" data-userId="{{userId}}" data-name="{{nickname}}" data-targetCommentId="{{targetCommentId}}"><div class="row"><div class="portrait"><img src="{{profilePic}}"/></div><div class="comment_box col col-16"><h4>{{nickname}}</h4><br/><p><span>{{targetName}}</span>{{content}}</p></div><div class="delect"><span id="delectComment" data-cid="{{targetCommentId}}">{{isDelete}}</span></div></div><div class="pic_list clearfix">{{picUrls}}</div><div class="comment_time row fvc far">{{dateCreated}}</div></li>',
                html=[];
            if ($.isArray(res.list) && res.list.length) {
                $.each(res.list, function (index, item) {
                    item.targetCommentId=item.mikuMineCommentsDo.id;
                    item.content=item.mikuMineCommentsDo.content;

                    item.nickname=item.profile.nickname;
                    item.dateCreated=bainx.formatDate('Y-m-d h:i', new Date(item.mikuMineCommentsDo.dateCreated));
                    item.profile.profilePic ? item.profilePic=item.profile.profilePic : item.profilePic = ''+URL.imgPath+'common/images/avatar-small.png';
                    item.userId=item.profile.id;
                    item.profile.id==userId ? item.isDelete='删除' : item.isDelete='';

                    item.targetName=item.targetName;
                    if(item.flag==1){
                        item.targetName='回复 @'+item.targetName+'： ';
                    }
                    var picUrls=item.mikuMineCommentsDo.picUrls;
                    var htmlpicUrls=[];
                    if(picUrls){
                        var picUrlsArry=picUrls.split(',');
                        for (var i=0;i<picUrlsArry.length;i++){
                            htmlpicUrls.push('<div class="img"><img src="'+picUrlsArry[i]+'" data-index="'+(i+1)+'"></div>');
                        }
                    }else{
                        htmlpicUrls.push('');
                    }
                    item.picUrls=htmlpicUrls.join('');
                    html.push(bainx.tpl(template,item));
                });
                $('.comment ul').append(html.join('')+'<li class="notData hide"><img src="'+URL.imgPath+'common/images/loading_fail.png"/><p>暂时没有评论哦</p></li>');
                LoadImage(element);
                viewLargeImg();
                if($('.pinch-zoom-container').length<1){
                    $('div#large_container').each(function () {
                        new Pinchzoom($(this), {});
                    });
                }
                $('.img').height($('.img img').width());
                isHavePic();
            }else if(this.get('pageIndex') == 0){
                    var _html='<li class="notData"><img src="'+URL.imgPath+'common/images/loading_fail.png"/><p>暂时没有评论哦</p></li>';
                    $('.comment ul').append(_html);
            }

        });
        var sid,
            scrollEventHandle = function(event) {
                event.preventDefault();
                clearTimeout(sid);
                sid = setTimeout(function() {
                    LoadImage(element);
                }, 0);
            }
        element.on('scroll', scrollEventHandle);
    }

    //事件绑定
    function bindEvent(){

        //on('tap','.click_i',function(){
        //    var clicks=$(this).attr('data-clicks');
        //    var data={
        //        cid:dyid,
        //        userId:userId
        //    }
        //    if(ifclikes){
        //        return false;
        //    }
        //    ifclikes=true;
        //    if(clicks==0){
        //        Data.addOneContentPraise(data).done(function(res){//点赞
        //            ifclikes=false;
        //            $('.click_i').attr('data-clicks','1');
        //            bainx.broadcast('点赞成功！');
        //            $('.click_i').addClass('click_i_active');
        //            var num=$('.numchang').text();
        //            $('.numchang').text(parseInt(num)+1);
        //            $('.textchang').text('人赞，已赞');
        //            $('.people_portrait').find('.pic').length>=1 ? $('.people_portrait').find('.pic').eq(0).before('<div class="pic" data-id="'+userId+'"><img src="'+res.profile.profilePic+'"></div>') : $('.people_portrait').append('<div class="pic" data-id="'+userId+'"><img src="'+res.profile.profilePic+'"></div>');
        //            //var num=$('.f_clikes').find('span').text();
        //            //$('.f_clikes').find('span').text(parseInt(num)+1);
        //            //$('.f_clikes').attr('id','clicksed');
        //        })
        //    }else if(clicks==1){
        //        Data.cancelOneContentPraise(data).done(function(res){//取消点赞
        //            ifclikes=false;
        //            $('.click_i').attr('data-clicks','0');
        //            bainx.broadcast('取消点赞成功！');
        //            $('.click_i').removeClass('click_i_active');
        //            var num=$('.numchang').text();
        //            $('.numchang').text(parseInt(num)-1);
        //            $('.textchang').text('人赞');
        //            $('.people_portrait div[data-id="'+userId+'"]').remove();
        //            //var num=$('.f_clikes').find('span').text();
        //            //$('.f_clikes').find('span').text(parseInt(num)-1);
        //            //$('.f_clikes').attr('id','');
        //        })
        //    }
        //
        //})

        $('body').on('tap','.msg_btn p',function(){
            var commentData= $.trim($('.msg_in input').val()),
                commentType= $(this).attr('data-commentType'),
                targetCommentId=$(this).attr('data-targetCommentId'),
                picUrls=[],
                picUrlsList=$('.f_addpic').find('dd');

                $.each(picUrlsList,function(index,item){
                picUrls.push($(item).find('img').attr('src'));
            })
                var data={
                    cid:cid,
                    dyid:dyid,
                    userId:userId,
                    userName:userName,
                    comment:commentData,
                    goalType:goalType,
                    commentType:commentType,
                    targetCommentId:targetCommentId,
                    picUrls:picUrls.join(",")
                },
                html=[],
                commentList=[];

            if(!commentData){
                bainx.broadcast('评论为空！');
                return false;
            }
            if(ifcomment){
                return false;
            }
            ifcomment=true;
            Data.addOneCommentByUsersay(data).done(function(res){
                if(res.flag==1 || res.flag==2){
                    ifcomment=false;
                    bainx.broadcast('评论成功！');
                    var num=$('.f_comment').find('span').text();
                    $('.f_comment').find('span').text(parseInt(num)+1);
                    $('.msg_addpic').show();
                    $('.f_addpic').find('dd').remove();
                    isHavepiv();
                    $('.msg_in input').val('');
                    $('.msg_in input').attr('placeholder','说点什么吧～');
                    $('.msg_btn p').attr('data-commentType','1');
                    $('.msg_btn p').attr('data-targetCommentId','0');
                    var tpm='<li class="grid box" data-userId="{{userId}}" data-name="{{nickname}}" data-targetcommentid="{{targetcommentid}}"><div class="row"><div class="portrait"><img src="{{profilePic}}"/></div><div class="comment_box col col-16"><h4>{{nickname}}</h4><br/><p><span>{{targetName}}</span>{{content}}</p></div><div class="delect"><span id="delectComment" data-cid="{{id}}">{{isDelete}}</span></div></div><div class="pic_list clearfix"></div></li>';
                    commentList.userName=res.dynamic.userName;
                    commentList.content=res.comment.content;
                    commentList.id=res.comment.id;
                    commentList.nickname=res.profile.nickname;
                    commentList.userId=res.profile.id;
                    res.profile.profilePic ? commentList.profilePic=res.profile.profilePic : commentList.profilePic = ""+URL.imgPath+"common/images/avatar-small.png";
                    res.profile.id==userId ? commentList.isDelete='删除' : commentList.isDelete='';
                    commentList.targetName=res.targetName;
                    commentList.targetcommentid=res.comment.id;
                    if(commentList.targetName){
                        commentList.targetName='回复 @'+commentList.targetName+'： ';
                    }
                    html.push(bainx.tpl(tpm, commentList));
                    $('.page-content .comment ul li').length>=1 ? $('.page-content .comment ul li').eq(0).before(html.join('')) : $('.page-content .comment ul').append(html.join(''));
                    var htmltpm=[];
                    var pics=res.comment.picUrls;
                    if(pics){
                        var picsarr=pics.split(",");
                        console.log(picsarr)
                        for(var i=0;i<picsarr.length;i++){
                            htmltpm.push('<div class="img"><img src="'+picsarr[i]+'" data-index="'+(i+1)+'"></div>');
                        }
                    }else{
                        htmltpm.push('');
                    }
                    $('.page-content .comment ul li').eq(0).find('.pic_list').append(htmltpm.join(''));
                    viewLargeImg();
                    if($('.pinch-zoom-container').length<1){
                        $('div#large_container').each(function () {
                            new Pinchzoom($(this), {});
                        });
                    }
                    isHavePic();
                    $('.img').eq(0).height($('.img img').width());
                    $('.notData').hide();
                    $('.msg_addpic').hide();
                    $('.collect_btn').show();
                    $('.send').hide();
                }else{
                    bainx.broadcast('评论失败！');
                }
            })

        }).on('change', '.file', function (event) {
            $('.waitting').show();
            if(pageConfig.pid==''){
                URL.assign('vLoginPage.htm');
                return;
            }
            Common.uploadImages(event,'#my_form', URL.upYunUploadPics).done(function(res) {
                $('.waitting').hide();
                var addPic = $('.f_addpic');
                var picUrls = res.result.picUrls,
                    imgListUrl = [];
                picUrls = picUrls.split(';');
                $.each(picUrls,function(index,item){
                    imgListUrl.push('<dd class="active"><img src="'+ item+'!small"  alt=""><span class="delete"></span></dd>');
                })
                imgListUrl = imgListUrl.join('');
                addPic.append(imgListUrl);

                isHavepiv();
            }).fail(function() {
                bainx.broadcast('上传图片失败！');
            });

        }).on('click', 'input', function (event) {
            if (event && event.preventDefault) {
                window.event.returnValue = true;

            }
        }).on('tap','.delete',function(event){
            event.preventDefault();

            $(this).addClass('currentDelete').siblings().removeClass('currentDelete');
            var data = {
                filePath:$(this).parent('dd').children('img').attr('src')
            }

            Data.upyunDeleteFile(data).done(function(res){
                bainx.broadcast('删除成功！');
                $('.currentDelete').parent('dd').remove();

                isHavepiv();
            })
        }).on('tap','.comment_box p,.comment_box h4,.portrait img',function(event){
            var me=$(this);
            setTimeout(function(){
                event.stopPropagation();
                var id=me.parent().parent().parent().attr('data-userId');
                if(id==userId){
                    return;
                }
                $('.msg_addpic').hide();
                var name=me.parent().parent().parent().attr('data-name');
                var targetCommentId=me.parent().parent().parent().attr('data-targetCommentId');
                $('.msg_btn p').attr('data-commentType','2');
                $('.msg_btn p').attr('data-targetCommentId',targetCommentId);
                $('.msg_in input').attr('placeholder','回复 @'+name);
                //.on('click','.f_comment',function(){
                //    $('.msg_in input').val('');
                //    $('.msg_in input').attr('placeholder','说点什么吧～');
                //    $('.msg_btn p').attr('data-commentType','1');
                //    $('.msg_btn p').attr('data-targetCommentId','0');
                //
                //    $('.msg_addpic').show();
                //
                //    $('.msg_in input').focus();
                //})
                },320);
        }).on('tap','.f_share',function(){
            var contenThumbPicUrl=$("#datahide").attr("data-contenThumbPicUrl");
            var contentAbstract=$("#datahide").attr("data-contentAbstract");
            var url=window.location.href;
            getComIos(contentAbstract,contenThumbPicUrl,url);
            shareListener.openSharePop(""+contentAbstract+";"+contenThumbPicUrl+";"+url+"")
        }).on('tap','#delectComment',function(e){//删除自己的评论
            e.stopPropagation();
            var cid=$(this).attr('data-cid'),
                data={
                cid:cid
            }
            Data.deleteOnePraise(data).done(function(res){
                if(res.flag){
                    bainx.broadcast('删除评论成功！');
                    var num=$('.f_comment').find('span').text();
                    $('.f_comment').find('span').text(parseInt(num-1));
                    $('.comment').find('li[data-targetCommentId="'+cid+'"]').animate({opacity: 0.1},1000,'ease-out');
                    setTimeout(function(){
                        $('.comment').find('li[data-targetCommentId="'+cid+'"]').remove();
                    },1000);
                    if($('.comment li').length==2){
                        if($('.comment .notData')){
                            $('.comment .notData').show();
                        }else{
                            var _html='<li class="notData"><img src="'+URL.imgPath+'common/images/loading_fail.png"/><p>暂时没有评论哦</p></li>';
                            $('.comment ul').append(_html);
                        }
                    }
                }else{
                    bainx.broadcast('删除评论失败！');
                }
            })
        }).on('tap','#close',function(){
            $('.page-content').css('overflow-y','auto');
            $('body').removeClass('height_hidden');
            $('.pic_list').css({height:'auto','overflow':'auto'})
            $('.page-content').css({'z-index':'0'});
            $('#large_img').attr('src','');
            $('.pinch-zoom-container').hide();
        }).on('tap','.follow',function(e){
            if(iffollow){
                return false;
            }
            iffollow=true;
            var goalUserId=$(this).attr('data-goalUserId'),
                datafollow=$(this).attr('data-follow'),
                relationType= 1,
                f_follow=$(this);
            if(datafollow==0){
                userId ? userId : userId=-1;
                var data={
                    userId:userId,
                    goalUserId:goalUserId,
                    relationType:relationType
                }
                Data.concernOneUserById(data).done(function(res){
                    if(res.flag==1){
                        bainx.broadcast('关注成功！');
                        $('.follow').attr('data-follow',1);
                        iffollow=false;
                        f_follow.text('已关注');
                    }else if(res.flag==0){
                        bainx.broadcast('关注失败！');
                        iffollow=false;
                    }
                })
            }else if(datafollow==1){
                var data={
                    goalUserId:goalUserId,
                    userId:userId
                }
                Data.cancelOneConcernByIds(data).done(function(res){
                    if(res.flag==1){
                        bainx.broadcast('取消关注成功！');
                        $('.follow').attr('data-follow',0);
                        iffollow=false;
                        f_follow.text('关注ta');
                    }else if(res.flag==0){
                        bainx.broadcast('取消关注失败！');
                        iffollow=false;
                    }
                })
            }
        }).on('tap','.collect_btn img',function(){
            var num=$(this).attr('data-likes');
            var data={
                cid:cid,
                dyId:dyid,
                userId:userId
            }
            if(iflikes){
                return false;
            }
            iflikes=true;
            if(num==0){
                Data.collectionOneContent(data).done(function(res){
                    if(res.flag){
                        iflikes=false;
                        bainx.broadcast('收藏成功！');
                        $('.collect_btn img').attr('data-likes','1');
                        var num=$('.numchang').text();
                        $('.numchang').text(parseInt(num)+1);
                        $('.collect_btn img').attr('src',""+URL.imgPath+"common/images/find/article_collected_max.png");
                        $('.collect_btn img').css('-webkit-animation', 'like_animation 0.3s');
                        setTimeout(function(){
                            $('.collect_btn img').css('-webkit-animation', '');
                        },300);
                        $('.collect_i').attr('id','showlikesed');
                        var profilePic;
                        res.profile.profilePic ? profilePic=res.profile.profilePic : profilePic=''+URL.imgPath+'common/images/avatar-small.png';
                        $('.people_portrait').find('.pic').length>=1 ? $('.people_portrait').find('.pic').eq(0).before('<div class="pic" data-id="'+userId+'"><img src="'+profilePic+'"></div>') : $('.people_portrait').append('<div class="pic" data-id="'+userId+'"><img src="'+profilePic+'"></div>');
                    }
                })
            }else{
                Data.cancelcollectionOneContent(data).done(function(res){
                    if(res.flag){
                        iflikes=false;
                        bainx.broadcast('取消收藏成功！');
                        $('.collect_btn img').attr('data-likes','0');
                        var num=$('.numchang').text();
                        $('.numchang').text(parseInt(num)-1);
                        $('.collect_btn img').attr('src',""+URL.imgPath+"common/images/find/article_collect_max.png");
                        $('.collect_btn img').css('-webkit-animation', 'like_animation 0.3s');
                        setTimeout(function(){
                            $('.collect_btn img').css('-webkit-animation', '');
                        },300);
                        $('.collect_i').attr('id','');
                        $('.people_portrait div[data-id="'+userId+'"]').remove();
                    }
                })
            }
        }).on('tap','.con_head,.content,.nav_box,.notData,.pic_list,.comment_time,.comment_box',function(){
            $('.msg_addpic').hide();
            $('.collect_btn').show();
            $('.send').hide();
            $('.msg_in input').val('');
            $('.msg_in input').attr('placeholder','说点什么吧～');
            $('.msg_btn p').attr('data-commentType','1');
            $('.msg_btn p').attr('data-targetCommentId','0');
        }).on('tap','#img_btn',function(){
            $('.file').click();
        })

            //.on('tap','#large_img',function(){
            //    $(this).attr('src','');
            //    $('#large_container').hide();
            //
            //})

            //.on('tap','.con_head,.content,.nav_box,.notData,.pic_list',function(){
            //    $('.msg_in input').val('');
            //    $('.msg_in input').attr('placeholder','说点什么吧～');
            //    $('.msg_btn p').attr('data-commentType','1');
            //    $('.msg_btn p').attr('data-targetCommentId','0');
            //    $('.msg_addpic').show();
            //    $('.click_btn').show();
            //    $('#my_form').hide();
            //})

    }
    bindEvent();


    //判断图片列表是否有图片
    function isHavepiv(){
        var dd=$('.f_addpic').find('dd');
        if(dd.length>0){
            $('.f_addpic').show();
        }else{
            $('.f_addpic').hide();
        }
    }

    //查看大图
    function viewLargeImg(){
        var zWin = $(window),
            cid,
            wImage = $('#large_img'),
            domImage = wImage[0];
        var loadImg = function(id,target,callback){
            $('#large_container').css({
                width:zWin.width(),
                height:zWin.height()
            }).show();
            var imgsrc = target.attr('src');
            imgsrc = imgsrc.substring(0, imgsrc.indexOf('!'));
            var ImageObj = new Image();
            ImageObj.src = imgsrc;
            $('.waitting').show();
            ImageObj.onload = function(){
                $('.waitting').hide();
                var w = this.width;
                var h = this.height;
                var winWidth = zWin.width();
                var winHeight = zWin.height();
                var realw = parseInt((winWidth - winHeight*w/h)/2);
                var realh = parseInt((winHeight - winWidth*h/w)/2);
                wImage.css('width','auto').css('height','auto');
                wImage.css('padding-left','0px').css('padding-top','0px');
                if(h/w>1.2){
                    wImage.attr('src',imgsrc).css('height',winHeight).css('padding-left',realw+'px');
                }else{
                    wImage.attr('src',imgsrc).css('width',winWidth).css('padding-top',realh+'px');
                }
                callback&&callback();
            }
        }

        $('.pic_list div img').tap(function(e){
            e.stopPropagation();
            $('.page-content').css('overflow-y','hidden');
            var _id = cid = parseInt($(this).attr('data-index'));
            loadImg(_id,$(this));
            $('.box').data('current','off');
            $(this).parents('.box').data('current','on');
            $('.pinch-zoom-container').show();
        });
        var lock = false,
            thumbLen = $('.box[data-current="on"]').find('.pic_list img').length;

            $('body').on('swipeLeft','#large_container',function(){
            if(lock && thumbLen == 1){
                return;
            }
            cid++;
            lock =true;

            var tar = $('.box[data-current="on"]').find('.pic_list img[data-index="'+cid+'"]'),
                lastThumb = $('.box[data-current="on"]').find('.pic_list div:last-child img').data('index');


            if(cid < lastThumb + 1) {
                loadImg(cid, tar, function () {
                    domImage.addEventListener('webkitAnimationEnd', function () {
                        wImage.removeClass('animated bounceInRight');
                        lock = false;
                    }, false);
                    wImage.addClass('animated bounceInRight');
                });
            }else{
                cid = lastThumb;
            }
        }).on('swipeRight','#large_container',function(){
            if(lock && thumbLen == 1 ){
                return;
            }
            cid--;
            lock =true;

            var tar = $('.box[data-current="on"]').find('.pic_list img[data-index="'+cid+'"]');
            if(cid>0 ){
                loadImg(cid,tar,function(){
                    domImage.addEventListener('webkitAnimationEnd',function(){
                        wImage.removeClass('animated bounceInLeft');
                        lock = false;
                    },false);
                    wImage.addClass('animated bounceInLeft');
                });
            }else{
                cid = 1;
            }
        })
    }

    //是否有图片
    function isHavePic(){
        var pics= $('.pic_list');
        $.each(pics,function(index,item){
            var iscon=$(item).is(":empty");
            if(iscon){
                $(item).remove();
            }
        })
    }

    //content里面内容的处理
    function conHandle(){
        var v_imgf=$('.art_text img.edui-faked-video');
        var v_imgup=$('.art_text img.edui-upload-video');
        v_imgf.each(function(index){
            var url=$(this).attr('_url');
            var html='<video class="edui-upload-video  vjs-default-skin video-js" controls="controls" preload="none" width="420" height="280" src="'+url+'" data-setup="{}"></video>';
            $(this).before(html);
            $(this).remove();

        })
        v_imgup.each(function(index){
            var url=$(this).attr('_url');
            var html='<video class="edui-upload-video  vjs-default-skin video-js" controls="controls" preload="none" width="420" height="280" src="'+url+'" data-setup="{}"></video>';
            $(this).before(html);
            $(this).remove();

        })


        var video=$('.art_text video');
        video.each(function(){
            $(this).attr('width','100%');
            $(this).attr('height','auto');
        })
    }

    //function adsorbent(){
    //    var dv = $('.nav_box'), st;
    //    dv.attr('otop', dv.offset().top); //存储原来的距离顶部的距离
    //    console.log($('.page-content').height())
    //    $('.page-content').scroll(function () {
    //        st = Math.max($('.page-content').scrollTop());
    //        console.log(st)
    //        if (st > (parseInt(dv.attr('otop'))-46)) {
    //            dv.attr('id','ft');
    //            //$('.nav_box .nivo').css('border-top','none');
    //        } else{
    //            dv.attr('id','');
    //            //$('.nav_box .nivo').css('border-top','1px solid #E7E7E7');
    //        }
    //    })
    //}

    //分享app设置参数
    //$('body').append('<script>function getCom(contentAbstract,contenThumbPicUrl,url){shareListener.openSharePop(""+contentAbstract+";"+contenThumbPicUrl+";"+url+"");} function getComIos(e1,e2,e3){}</script>');

    $('body').append('<script>function shareAndcollect(){var selector=$("#data_shareandcollectn"),contenThumbPicUrl=selector.attr("data-contenThumbPicUrl"),contentAbstract=selector.attr("data-contentAbstract"),cid=selector.attr("data-cid"),dyid=selector.attr("data-dyid"),goalType=selector.attr("data-goalType"),collectFlag=selector.attr("data-collectFlag"),url="http://"+window.location.host+"/api/h/1.0/articleInfoPage.htm?cid="+cid+"&dyid="+dyid+"&goalType="+goalType;shareListener.openSharePop(""+contentAbstract+";"+contenThumbPicUrl+";"+url+";"+collectFlag+";"+dyid+";"+cid+"");}function returenMsgToIos(){var selector=$("#data_shareandcollectn"),contenThumbPicUrl=selector.attr("data-contenThumbPicUrl"),contentAbstract=selector.attr("data-contentAbstract"),cid=selector.attr("data-cid"),dyid=selector.attr("data-dyid"),goalType=selector.attr("data-goalType"),collectFlag=selector.attr("data-collectFlag"),url="http://"+window.location.host+"/api/h/1.0/articleInfoPage.htm?cid="+cid+"&dyid="+dyid+"&goalType="+goalType;var msg=contentAbstract+";"+contenThumbPicUrl+";"+url;return msg;}</script>');

    init();

})