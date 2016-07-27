/**
 * Created by Spades-k on 2015/11/4.
 */



require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data'
],function($, URL, Data){

    var Page;


    //初始化
    function init() {
        render();
        renderAllyOrder();
    }

    //生成页面
    function render() {
        //header template
        //getAllyData()
        var item = {directAlly: 1001};

        var template = '<section class="header"><div class="content navbar"><div class="btn-navbar navbar-left"><a href="javascript:history.go(-1);" class="icon icon-return"></a></div><div class="navbar-main">订单列表</div></div></section><div class="page-content"><div class="page-ally-order-list"><div class="grid ally-order-list"></div></div></div>';

        html = bainx.tpl(template, item);

        Page = $(html).appendTo('body');
    }

    //盟友统计 （直接、间接）
    // function getAllyData(){
    //    Data.myAlly().done(function(res){
    //            console.log(res);
    //            allyList = res;
    //        }).fail();
    //}


    //盟友订单列表 （直接、间接）
    function renderAllyOrder(){
        //getAllyList()
        var item = [{name: "刘晓晓", order: 68, profit: 200},{name: "刘晓", order: 168, profit: 208}];
        var template = '<div class="search-layout grid"><div class="row search-box"><div class="col col-2 search-submit"></div><div class="col col-23"><input type="text" class="search-input" placeholder="输入我的盟昵称"></div></div></div><div class="ally-list clearfix"><ul class="media-list"><li class="media"><div class="media-left"></div> <div class="media-body"><h4 class="media-heading"><span class="label">昵称：</span>{{name}}</h4> <p><span class="label-wrap"><span class="label">订单数：</span>{{order}}</span><span class="label-wrap"><span class="label">贡献分润：</span>￥{{profit}}</span></p></div></li></ul></div>';

        html = bainx.tpl(template, item);

        Page = $(html).appendTo('.page-ally-list');

        $('.media-left', Page).html('<a href="#"><img class="media-object" src="' + URL.imgPath + 'common/images/avatar-large.png" alt="..."></a>');


    }

    //获取盟友列表
    function getAllyOrder() {

    }



    init();
});