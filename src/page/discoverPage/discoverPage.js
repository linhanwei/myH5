/**
 * 发现
 * Created by Spades-k on 2016/5/30.
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
    //'plugin/swiper/3.3.1/swiper',
    //'plugin/swiper/3.3.1/swiper.css'
], function ($, Data, Common, URL,LoadImage, Nexter,Dialog,Lazyload) {
    var Page,
        userId = pageConfig.pid,
        dialog,
        firstLoad=true,
        ifclicks=false,
        iflikes=false,
        iffollow=false;
    function init(){
        render();
    }

    function render(){
        $('.waitting').hide();
        Page=$('<section id="indexPage" class="page-content"><div id="banner" class="banner pic-carousel"></div><!--<div class="cate-nav grid"></div><div class="hotVideo hide"><div class="nivo hot_class"></div><div class="swiper"></div></div>--><div class="article"><div class="article_box"><div class="nivo selected_articles">精选文章</div><ul class="article_list grid"></ul></div></div></section><!--<section class="header" style="display: block;"><div class="content navbar"><!--<div class="btn-navbar navbar-left"><span href="javascript:history.go(-1);" class="icon icon-return"></span></div><div class="navbar-main">发现</div><div class="btn-navbar navbar-right"></div></div></section>-->').appendTo('body');

        bannerHtml();
        //gridHtml();
        //htmlItems();
        if ($('.article_box').offset().top < $(window).height()*1.5 && firstLoad) {
            htmlItems();
            firstLoad = false;
        }
        //sortDialog();//弹出
        //judgeInformation();
        //footerHtml();
        $('#indexPage').scroll(function(){
            var scrollNum=$('.banner').offset().top;
            sessionStorage.setItem('scrollheight',scrollNum);
            downloadLoad(scrollNum);
        });
    }

    //banner图片
    function bannerHtml(){
        var template='<li href="{{href}}"><img _src="{{src}}" data-lazyload-src="{{src}}" /></li>';
        var data=[
            {
                href:'http://miku.unesmall.com/api/h/1.0/beJoinAgencyGift.htm',
                src:'http://mikumine.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160419/vNTT-0-1461068725519.jpg'
            },
            {
                href:'http://miku.unesmall.com/api/h/1.0/hActive.htm?page=allImgPage&active_name=syzx',
                src:'http://mikumine.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160630/vNTT-0-1467277990341.jpg'
            },
            {
                href:'http://miku.unesmall.com/api/h/1.0/hActive.htm?page=allImgPage&active_name=csypzchd',
                src:'http://mikumine.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160429/vNTT-0-1461912428294.jpg'
            }
        ]
        var html=['<div class="slider-outer"><ul>'];
        $.each(data,function(index,item){
            html.push(bainx.tpl(template,item));
        });
        html.push('</ul></div><div id="carousel-status" class="carousel-status"><ul></ul></div>');
        $('.banner').append(html.join(''));

        require('slider', function(Slider) {
            //var ww = $(window).width();
            //$('#indexPage .banner, #indexPage .banner img').width(ww);

            Slider({
                slideCell:"#banner",
                titCell:".carousel-status ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell:".slider-outer ul",
                effect:"left",
                autoPlay:true,//自动播放
                autoPage:true, //自动分页
                switchLoad:"_src" //切换加载，真实图片路径为"_src"
            });

            //var slide = new Slider(target, {
            //    loop: 1,
            //    curIndex: 0,
            //    useTransform: 1,
            //    lazy: '.lazyimg',
            //    play: true, //动画自动播放
            //    interval: 3000,
            //    //trigger: '.carousel-status',
            //    //activeTriggerCls: 'sel',
            //    //hasTrigger: 'tap',
            //    callback: function (index) {
            //        statusElementLayout.find('.sel').removeClass('sel');
            //        statusElementLayout.find('span').eq(index).addClass('sel');
            //    }
            //});
        });
    }

    //grid
    //function gridHtml(){
    //    var template='<div class="cate-nav grid"><ul class="cate-nav-ul clearfix"><li class="cate-nav-li " href="/api/h/1.0/crowdfundHomePage.htm"><div class="cate-li-img"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160429/vNTT-0-1461895687655.png"></div><div class="cate-li-tit ellipsis">众筹</div></li><li class="cate-nav-li " href="http://miku.unesmall.com/api/h/1.0/hActive.htm?page=oneFenSeckill"><div class="cate-li-img"><img src="http://mikumine.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160302/vNTT-0-1456885506017.png"></div><div class="cate-li-tit ellipsis">开学季</div></li><li class="cate-nav-li " href="http://test.unesmall.com/api/h/1.0/clearCachePage.htm"><div class="cate-li-img"><img src="http://mikumine.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160302/vNTT-0-1456885522153.png"></div><div class="cate-li-tit ellipsis">清除缓存</div></li><li class="cate-nav-li " href="http://test.unesmall.com/api/h/1.0/myPoint.htm?type=1"><div class="cate-li-img"><img src="http://mikumine.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160302/vNTT-0-1456885540494.png"></div><div class="cate-li-tit ellipsis">签到</div></li></ul></div>';
    //
    //    $('.cate-nav').append(template);
    //
    //}


    //进入发现入口时的判断
    //function judgeInformation(){
    //    var data={
    //        userId:userId
    //    }
    //    //renderNexter(data);
    //    Data.isHavaSnsProfile(data).done(function(res){
    //        console.log(res)
    //        //var data=res.result;
    //        if(res.flag==0){
    //            sortDialog();
    //            //htmlItems(res.list);
    //        }else if(res.flag==1){
    //            if(dialog){
    //                dialog.hide();
    //            }
    //            //htmlItems();
    //        }
    //    })
    //}

    //文章列表
    function htmlItems() {
        userId ? userId : userId=-1;
        var data={
            userId:userId
        }
        var element = $('#indexPage'),
            nexter = new Nexter({
                element: element,
                dataSource: Data.selectSnsIndexPage,
                enableScrollLoad: true,
                pageSize: 20,
                scrollBodyContent: $('.article_box ul'),
                data:data,
            }).load().on('load:success', function (res)
            {
                $('.hot_class').text('热门课程');
                //$('.swiper').empty();
                //swiper();
                if ($.isArray(res.list) && res.list.length) {
                    var html =[],
                        template = '<li><div class="list_head row"><div class="col col-15 row fvc"><div class="head_pic"><img data-lazyload-src="{{profilePic}}"></div><div class="head_title"><h4>{{nickname}}</h4><p>{{dateCreated}}</p></div></div><div class="col col-10 row head_follow far fvc" style="{{showorhide}}"><div class="follow_btn" data-follow="{{attentionType}}" data-goalUserId="{{goalUserId}}">{{isfollow}}</div></div></div><div class="content" href="'+URL.articleInfoPage+'?cid={{cid}}&dyid={{dyid}}&goalType={{goalType}}&userName={{userName}}&praiseFlag={{praiseFlag}}"><div class="content_pic"><img data-lazyload-src="{{contentSurfacePicUrl}}"></div><div class="content_con"><h4>{{contentTitle}}</h4><p>{{contentAbstract}}</p></div></div><div class="footer row"><div class="col far row footer_con"><div class="col row fvc fac f_browse"><i></i><span>{{timesOfBrowsed}}</span></div><!--<div class="col row fvc fac f_clikes" data-clicks="{{praiseFlag}}" data-dyid="{{dyid}}"><i class="{{clicksed}}"></i><span>{{timesOfPraised}}</span></div>--><div class="col row fvc fac f_likes" data-likes="{{collectFlag}}" data-id="{{id}}" data-dyid="{{dyid}}" data-cid="{{cid}}"><i class="{{likesed}}"></i><span>{{timesOfCollected}}</span></div><div class="col row fvc fac f_comment" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}" data-userName="{{userName}}" data-praiseFlag="{{praiseFlag}}"><i></i><span>{{timesOfCommented}}</span></div><!--<div class="f_reprint" id="f_reprint" data-contenThumbPicUrl="{{contenThumbPicUrl}}" data-contentAbstract="{{contentAbstract}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}"><i></i><span></span></div>--><!--<div class="f_f_reprint_l" data-cid="{{cid}}" data-dyid="{{dyid}}"><i>转载</i><span>{{timesOfReferenced}}</span></div>--></div></div></li>';
                    //var template2='<li><div class="list_head row"><div class="col col-15 row fvc"><div class="head_pic"><img src="{{profilePic}}"></div><div class="head_title"><h4>{{nickname}}<!--<span class="f_c ml15">转发了</span>--></h4><p>{{dateCreated}}</p></div></div><div class="col col-10 row head_follow far fvc" style="{{showorhide}}"><div class="follow_btn"  data-follow="{{attentionType}}" data-goalUserId="{{goalUserId}}">{{isfollow}}</div></div></div><div class="content" href="'+URL.articleInfoPage+'?cid={{cid}}&dyid={{dyid}}&goalType={{goalType}}&userName={{userName}}&praiseFlag={{praiseFlag}}"><!--<div class="forward_word"><span class="f16 f_c_r">@王小丫</span><span class="f16">是我转发 ！</span></div>--><div class="content_p_con"><p>{{content}}</p></div><div class="content_p_pic">{{picUrls}}</div></div><div class="footer row"><div class="col far row footer_con"><div class="col row fvc fac f_browse"><i></i><span>{{timesOfBrowsed}}</span></div><!--<div class="col row fvc fac f_clikes" data-clicks="{{praiseFlag}}" data-dyid="{{dyid}}"><i class="{{clicksed}}"></i><span>{{timesOfPraised}}</span></div>--><div class="col row fvc fac f_likes" data-likes="{{collectFlag}}" data-id="{{id}}" data-dyid="{{dyid}}" data-cid="{{cid}}"><i class="{{likesed}}"></i><span>{{timesOfCollected}}</span></div><div class="col row fvc fac f_comment" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}" data-userName="{{userName}}" data-praiseFlag="{{praiseFlag}}"><i></i><span>{{timesOfCommented}}</span></div><!--<div class="f_reprint" id="f_reprint" data-contenThumbPicUrl="{{contenThumbPicUrl}}" data-contentAbstract="{{contentAbstract}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}"><i></i><span></span></div>--><!--<div class="f_f_reprint_l" data-cid="{{cid}}" data-dyid="{{dyid}}"><i>转载</i><span>{{timesOfReferenced}}</span></div>--></div></div></li>';
                    $.each(res.list, function (index, item) {
                        var mikuMydynamic=item.mikuMydynamic;
                        var mikuSnsContent=item.mikuSnsContent;
                        var profile=item.profile;
                        item.likesed = item.collectFlag == 1 ? 'likesed' : '';
                        item.clicksed = item.praiseFlag == 1 ? 'clicksed' : '';
                        item.timesOfBrowsed=mikuMydynamic.timesOfBrowsed;
                        item.timesOfReferenced=mikuMydynamic.timesOfReferenced;
                        item.timesOfPraised=mikuMydynamic.timesOfPraised;
                        item.timesOfCommented=mikuMydynamic.timesOfCommented;
                        item.timesOfCollected=mikuMydynamic.timesOfCollected;
                        item.dyid=mikuMydynamic.id;
                        item.goalType=mikuMydynamic.goalType;
                        item.contentTitle=mikuSnsContent.contentTitle;
                        item.content=mikuSnsContent.content;
                        if(mikuSnsContent.contentAbstract){
                            mikuSnsContent.contentAbstract.length>=55 ? item.contentAbstract=mikuSnsContent.contentAbstract.substring(1,55)+'...' : item.contentAbstract=mikuSnsContent.contentAbstract;
                        }
                        item.userName=mikuSnsContent.userName;
                        item.cid=mikuSnsContent.id;
                        item.contenThumbPicUrl=mikuSnsContent.contenThumbPicUrl;
                        item.dateCreated=bainx.formatDate('Y-m-d h:i', new Date(mikuSnsContent.dateCreated));
                        item.contentSurfacePicUrl=mikuSnsContent.contentSurfacePicUrl;
                        item.goalUserId=profile.id;
                        profile.id==userId ? item.showorhide='display:none;' : item.showorhide='';
                        item.nickname=profile.nickname;
                        profile.profilePic ? item.profilePic=profile.profilePic : item.profilePic=''+URL.imgPath+'common/images/avatar-small.png';
                        if(item.attentionType==1){
                            item.isfollow='已关注';
                        }else{
                            item.isfollow='关注ta';
                        }
                        //if(mikuSnsContent.picUrls){
                        //    var picUrls=mikuSnsContent.picUrls.split(';');
                        //    if(picUrls.length>1){
                        //        var tmp=[],
                        //            kz=0;
                        //        $.each(picUrls, function (k, v) {
                        //            if(k%3==0) {
                        //                tmp.push('<div class="row fvc pic_all">');
                        //            }
                        //            tmp.push('<div class="col pic_one"><span style="background-image: url('+v+')"></span></div>');
                        //            if(k%3==2){
                        //                tmp.push('</div>');
                        //            }
                        //            kz = k;
                        //        })
                        //        if(kz>2){
                        //            if(kz%3 == 0){
                        //                tmp.push('<div class="col"></div><div class="col"></div></div>');
                        //            }
                        //            if(kz%3 == 1){
                        //                tmp.push('<div class="col"></div></div>');
                        //            }
                        //        }else{
                        //            if(kz%3==0 || kz%3==1){
                        //                tmp.push('</div>');
                        //            }
                        //        }
                        //
                        //        item.picUrls=tmp.join('');
                        //    }else{
                        //        item.picUrls='<div class="pic_one"><span style="background-image: url('+mikuSnsContent.picUrls+')"></span></div>';
                        //    }
                        //}

                        //if(mikuSnsContent.contentCreateType==2){
                        //    html.push(bainx.tpl(template2,item));
                        //}else{
                        html.push(bainx.tpl(template,item));
                        //}
                    });
                    html.push('<li class="add_more tc">加载更多...</li>')
                    $('.article_list').append(html.join(''));
                    LoadImage(element);
                    if(!res.hasNext){
                        $('.add_more').hide();
                    }
                    var scrollheight=sessionStorage.getItem('scrollheight');
                    $("#indexPage").scrollTop(-scrollheight);
                }
                var sid,
                    scrollEventHandle = function(event) {
                        event.preventDefault();
                        clearTimeout(sid);
                        sid = setTimeout(function() {
                            LoadImage(element);
                        }, 0);
                    }
                element.on('scroll', scrollEventHandle);
            })
    }

    //footer
    //function footerHtml(){
    //    var template='<li class="col col-25  addHrefParm" href=""><i class="order_bar"></i><p>订制</p></li><li class="col col-25 active  addHrefParm" href=""><i class="find_bar"></i><p>发现</p></li><li class="col col-25 addHrefParm" href=""><i class="tipgoods_bar"><span class=" price" style="visibility:hidden"></span></i><p>尖货</p></li><li class="col col-25  addHrefParm" href=""><i class="user-bar "></i><p>我的</p></li>';
    //
    //    $('#app-bar ul').append(template);
    //}


    //弹窗
    //function sortDialog(){
    //    //var _html='<li class="notData"><img src="'+URL.imgPath+'/common/images/loading_fail.png"/><p>灰常抱歉，暂时没有数据哦</p></li>';
    //    //$('.article_list').append(_html);
    //
    //    //var istap = false;
    //    if (!dialog) {
    //
    //        dialog = new Dialog($.extend({}, {
    //            template: '<div id="sortPage"><section class="header"><div class="content navbar"><div class="btn-navbar navbar-left">取消</div></div></section><section class="con"><div class="con_box"><ul><li class="message"><h3>基本信息</h3><dl class="grid"><dd>个性签名：<input type="text" id="name" class="name" value="" placeholder="个性签名" size="15"> </dd><dd>性别：<span data-sex="0" class="choice active"><i></i>男</span><span data-sex="1" class="choice"><i></i>女</span></dd></dl></li></ul><div class="save" id="saveMsg"><span>保存</span></div></div></section></div> ',
    //            events: {
    //                'tap .navbar-left': function (event) {
    //                    event.preventDefault();
    //                    dialog.hide();
    //                }
    //            }
    //        }))
    //
    //    }
    //    dialog.show();
    //
    //}

    //转载弹窗
    //function forwardPopup(){
    //    if (!dialog) {
    //
    //        dialog = new Dialog($.extend({}, {
    //            template: '<div id="forwardPopup"><section class="header"><div class="content navbar"><div class="btn-navbar navbar-left">取消</div></div></section><section class="con"><div class="con_box" id="reprintCon"><ul><li><textarea rows="3" placeholder="说说转载心得..." style="width: 100%;resize: vertical;"></textarea></li></ul><div class="save" id="reprintBtn" data-cid="" data-dyid=""><span>转载</span></div></div></section></div> ',
    //            events: {
    //                'tap .navbar-left': function (event) {
    //                    event.preventDefault();
    //                    dialog.hide();
    //                }
    //            }
    //        }))
    //
    //    }
    //    dialog.show();
    //
    //}

    //swiper模板
    //function swiper(){
    //    var template='<div class="swiper-slide"><img hf="{{hf}}" src="{{src}}"></div>';
    //    var data=[
    //        {
    //            hf:'http://mikumine.b0.upaiyun.com/multimedia/20160613/1.2rhsysllztlbrfs.mp4',
    //            src:'http://unesmall.b0.upaiyun.com/find/1.jpg'
    //        },
    //        {
    //            hf:'http://mikumine.b0.upaiyun.com/multimedia/20160613/1.2rhsysllztlbrfs.mp4',
    //            src:'http://unesmall.b0.upaiyun.com/find/2.jpg'
    //        },
    //        {
    //            hf:'http://mikumine.b0.upaiyun.com/multimedia/20160613/1.2rhsysllztlbrfs.mp4',
    //            src:'http://unesmall.b0.upaiyun.com/find/02.png'
    //        },
    //        {
    //            hf:'http://mikumine.b0.upaiyun.com/multimedia/20160613/1.2rhsysllztlbrfs.mp4',
    //            src:'http://unesmall.b0.upaiyun.com/find/3.jpg'
    //        },
    //        {
    //            hf:'http://mikumine.b0.upaiyun.com/multimedia/20160613/1.2rhsysllztlbrfs.mp4',
    //            src:'http://unesmall.b0.upaiyun.com/find/4.jpg'
    //        }
    //    ];
    //    var html=['<div class="swiper-container"><div class="swiper-wrapper">'];
    //    $.each(data,function(index,item){
    //        html.push(bainx.tpl(template,item));
    //    });
    //    html.push('</div></div>');
    //    $('.swiper').append(html.join(''));
    //
    //    var swiper = new Swiper('.swiper-container', {
    //        pagination: '.swiper-pagination',
    //        slidesPerView: 3,
    //        paginationClickable: true,
    //        spaceBetween: 12,
    //        slidesOffsetBefore : 20,
    //        slidesOffsetAfter : 20,
    //        freeMode: true,
    //        preventClicks : true,
    //        preventClicksPropagation:true
    //    });
    //    $('.swiper-slide').height($('.swiper-slide').width());
    //}

    //事件绑定
    function bindEvent(){
        var saveClass='';
        $('body').on('tap', '.choice', function (event) {
            $(this).addClass('active').siblings().removeClass('active');
        }).on('tap','.follow_btn',function(){//关注
            if(iffollow){
                return false;
            }
            iffollow=true;
            var goalUserId=$(this).attr('data-goalUserId'),
                datafollow=$(this).attr('data-follow'),
                relationType= 1,
                f_follow=$('.follow_btn');
            if(datafollow==0){
                var data={
                    userId:userId,
                    goalUserId:goalUserId,
                    relationType:relationType
                }
                Data.concernOneUserById(data).done(function(res){
                    if(res.flag==1){
                        bainx.broadcast('关注成功！');
                        iffollow=false;
                        f_follow.each(function(index,item){
                            if($(this).attr('data-goalUserId')==goalUserId){
                                $(this).attr('data-follow',1)
                                $(this).text('已关注');
                            }
                        })
                    }else if(res.flag==0){
                        bainx.broadcast('关注失败！');
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
                        iffollow=false;
                        f_follow.each(function(index,item){
                            if($(this).attr('data-goalUserId')==goalUserId){
                                $(this).attr('data-follow',0)
                                $(this).text('关注ta');
                            }
                        })
                    }else if(res.flag==0){
                        bainx.broadcast('取消关注失败！');
                    }
                })
            }
        }).on('tap','.f_clikes',function(){
            if(ifclicks){
                return false;
            }
            ifclicks=true;
            var clicks=$(this).attr('data-clicks');
            var dyid=$(this).attr('data-dyid');
            var data={
                cid:dyid,
                userId:userId
            }
            var f_clikes=$(this);
            if(clicks==0){
                Data.addOneContentPraise(data).done(function(res){//点赞
                    bainx.broadcast('点赞成功！');
                    f_clikes.attr('data-clicks','1');
                    var num=f_clikes.find('span').text();
                    f_clikes.find('i').addClass('clicksed');
                    f_clikes.find('span').text(parseInt(num)+1);
                    ifclicks=false;
                })
            }else if(clicks==1){
                Data.cancelOneContentPraise(data).done(function(res){//取消点赞
                    bainx.broadcast('取消点赞成功！');
                    f_clikes.attr('data-clicks','0');
                    var num=f_clikes.find('span').text();
                    f_clikes.find('i').removeClass('clicksed');
                    f_clikes.find('span').text(parseInt(num)-1);
                    ifclicks=false;
                })
            }
        }).on('tap','.f_comment',function(){
            var cid=$(this).attr('data-cid');
            var dyid=$(this).attr('data-dyid');
            var userName=$(this).attr('data-userName');
            var goalType=$(this).attr('data-goalType');
            var praiseFlag=$(this).attr('data-praiseFlag');
            var href='articleInfoPage.htm?cid='+cid+'&dyid='+dyid+'&goalType='+goalType+'&userName='+userName+'&praiseFlag='+praiseFlag;
            URL.assign(href);
        }).on('click','.swiper-slide',function(e){
            e.preventDefault();
            var href=$(this).find('img').attr('hf');
            URL.assign(href);
        }).on('tap','.f_likes',function(){
            if(iflikes){
                return false;
            }
            iflikes=true;
            var cid=$(this).attr('data-cid');
            var dyid=$(this).attr('data-dyid');
            var f_likes=$(this);
            var likes=$(this).attr('data-likes');
            var data={
                cid:cid,
                dyId:dyid,
                userId:userId
            }
            if(likes==0){
                Data.collectionOneContent(data).done(function(res){
                    if(res.flag){
                        bainx.broadcast('收藏成功！');
                        f_likes.attr('data-likes','1');
                        var num=f_likes.find('span').text();
                        f_likes.find('i').addClass('likesed');
                        f_likes.find('span').text(parseInt(num)+1);
                        iflikes=false;
                    }
                })
            }else if(likes==1){
                Data.cancelcollectionOneContent(data).done(function(res){
                    if(res.flag){
                        bainx.broadcast('取消收藏成功！');
                        f_likes.attr('data-likes','0');
                        var num=f_likes.find('span').text();
                        f_likes.find('i').removeClass('likesed');
                        f_likes.find('span').text(parseInt(num)-1);
                        iflikes=false;
                    }
                })
            }
        })

        //.on('tap','#saveMsg',function(){//保存基本信息
        //    var sex=$('.choice.active').attr('data-sex'),
        //        signature=$('#name').val(),
        //        userInfo,
        //        data={
        //            sex:sex,
        //            signature:signature,
        //            userInfo:userInfo,
        //            userId:userId
        //        };
        //    Data.insertOneSnsProfileRecord(data).done(function(res){
        //        console.log(res)
        //        if(res.flag==0){
        //            //sortDialog();
        //            bainx.broadcast('添加失败！');
        //        }else if(res.flag==1){
        //            bainx.broadcast('添加成功！');
        //            dialog.hide();
        //            //htmlItems(res.list);
        //        }
        //    })
        //})


        //    .on('swipeUp','#indexPage',function(){
        //    if(!hasNext){
        //        bainx.broadcast('没有更多文章了！');
        //    }
        //})


        //.on('tap','.f_reprint',function(){
        //    var contenThumbPicUrl=$(this).attr("data-contenThumbPicUrl");
        //    var contentAbstract=$(this).attr("data-contentAbstract");
        //    var cid=$(this).attr("data-cid");
        //    var dyid=$(this).attr("data-dyid");
        //    var goalType=$(this).attr("data-goalType");
        //    var url='http://'+window.location.host+'/api/h/1.0/articleInfoPage.htm?cid='+cid+'&dyid='+dyid+'&goalType='+goalType;
        //    getComIos(contentAbstract,contenThumbPicUrl,url);
        //    shareListener.openSharePop(""+contentAbstract+";"+contenThumbPicUrl+";"+url+"");
        //})

        //.on('tap','#reprintBtn',function(){
        //    var cid=$(this).attr('data-cid'),
        //        dyid=$(this).attr('data-dyid'),
        //        content=$('#reprintCon textarea').val(),
        //        data={
        //            cid:cid,
        //            dyid:dyid,
        //            userId:userId,
        //            userName:-1,
        //            content:content,
        //            contentType:2,
        //            goalType:2,
        //            actionType:2,
        //            actionPostionType:1,
        //            topFlag:0
        //        }
        //    Data.addOneContentRerfence(data).done(function(res){
        //        if(res.flag==1){
        //            var num=saveClass.find('span').text();
        //            saveClass.find('span').text(parseInt(num)+1);
        //            $('#forwardPopup').hide();
        //            bainx.broadcast('转载成功！');
        //        }else{
        //            bainx.broadcast('转载失败！');
        //        }
        //    })
        //})

        //.on('tap','.f_f_reprint_l',function(){
        //    forwardPopup();
        //    saveClass=$(this);
        //    var cid=$(this).attr('data-cid'),
        //        dyid=$(this).attr('data-dyid');
        //    $('#reprintBtn').attr({'data-cid':cid,'data-dyid':dyid})
        //})

    }
    bindEvent();
    init();
    $('body').append('<script>function downloadLoad(scrollNum){shareListener.onPullDownRefresh(scrollNum);}</script>');
})