/**
 * Created by Spades-k on 2016/7/21.
 */
define('h5/js/page/csadDirectionCenter',[
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/css/page/csadCssZy.css'
], function ($, Data, Common, URL) {

    function initDirectionCenter(){

        Events();
        $('body').attr('data-orderstatus','未下单');
        $('body').attr('data-page','0');
        boxOrderStatistics();//盒子订单统计
        getListOfBoxes(2,'',0);//获取盒子订单列表
        returning();//待回访统计
        returninglist();//待回访列表

    }


    function csadDirectionCenterHtml(){
        var template='<section id="direction_box"><div id="direction_center"><div class="con_box clearfix"><div class="leftbox clearfix"><div class="payment_list box_order"><ul></ul></div><div class="payment_people box_order_people"><ul></ul></div></div><div class="rightbox"><div class="payment_list returning"><ul></ul></div><div class="payment_people returning_people"><ul></ul></div></div></div></div></section>';

        return template;
    }

    //盒子订单统计
    function boxOrderStatistics(){
        var data={
            type:1,
            hasTrade:0,
            allTrade:0
        },
            html=[];
        Data.getMineScBoxTradeCount(data).done(function(res) {
            var template='<li class="no_orders active">未下单({{noOrderCount}})</li><li class="unpaid">未付款({{noPayOrderCount}})</li><li class="already_paid">已付款({{payedOrderCount}})</li><li class="stocking">已备货({{readyOrderCount}})</li><li class="receipt">已收货({{finishOrderCount}})</li><li class="shipped">已发货({{sendedOrderCount}})</li><li style="height: 260px;cursor: auto;"></li>';
            html.push(bainx.tpl(template, res));
            $('.box_order ul').append(html.join(''));
        })

    }

    //待回访
    function returning(){
        var data={

            },
            html=[];
        Data.getMineScBoxTradeCount(data).done(function(res) {
            var template='<li class="active"><div class="list_box row fvc fac"><div class="box_l"><p>第一天</p><p>待回访</p></div><div class="box_r"><p>(6)</p></div></div></li><li><div class="list_box row fvc fac"><div class="box_l"><p>第二天</p><p>待回访</p></div><div class="box_r"><p>(6)</p></div></div></li><li><div class="list_box row fvc fac"><div class="box_l"><p>第三天</p><p>待回访</p></div><div class="box_r"><p>(6)</p></div></div></li><li><div class="list_box row fvc fac"><div class="box_l"><p>第四天</p><p>待回访</p></div><div class="box_r"><p>(6)</p></div></div></li><li><div class="list_box row fvc fac"><div class="box_l"><p>第五天</p><p>待回访</p></div><div class="box_r"><p>(6)</p></div></div></li><li><div class="list_box row fvc fac"><div class="box_l"><p>第六天</p><p>待回访</p></div><div class="box_r"><p>(6)</p></div></div></li><li><div class="list_box row fvc fac"><div class="box_l"><p>第七天</p><p>待回访</p></div><div class="box_r"><p>(6)</p></div></div></li><li><div class="list_box row fvc fac"><div class="box_l"><p>七天后</p><p>未下单</p></div><div class="box_r"><p>(6)</p></div></div></li><li style="height: 85px;cursor: auto;"></li>';
            html.push(bainx.tpl(template, res));
            $('.returning ul').append(html.join(''));
        })

    }

    //待回访人数列表
    function returninglist(){
        var data={

        },
            html=[];
        Data.getBoxChatUserVOList(data).done(function(res) {
            var template='<li><div class="people_box row active"><div class="pic"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160620/vNTT-0-1466418229760.jpg" alt=""></div><div class="people_msg"><p class="f18"><strong>张三</strong></p></div><div class="p_r"><p class="f12">下午17:08</p></div></div></li>';
            if ($.isArray(res.list) && res.list.length) {
                $.each(res.list,function(index,item){
                    var datatime='';

                    html.push(bainx.tpl(template,item));
                })
            }else{
                html=['<li class="tc"><div class="people_box row fvc">没有数据哦！</div></li>'];
            }
            $('.returning_people ul').append(html.join('')+'<li class="returning_next_page tc">下一页</li>');
            if(!res.hasNext){
                $('.returning_next_page').remove();
            }
        });
        function   formatDate(now)   {
            var   year=now.getYear();
            var   month=now.getMonth()+1;
            var   date=now.getDate();
            var   hour=now.getHours();
            var   minute=now.getMinutes();
            var   second=now.getSeconds();
            return   hour+":"+minute;
        }
    }

    //获取盒子订单列表
    function getListOfBoxes(alltrade,tradestatus,pg){
        var data={
            type:1,
            allTrade:alltrade,
            tradeStatus:tradestatus,
            pg:pg,
            sz:10
        },
            html=[];
        Data.getMineScBoxTradeList(data).done(function(res) {
            var template='<li><div class="people_box row fvc"><div class="pic"><img src="{{userPicUrl}}"></div><div class="people_msg"><p class="f18"><strong>{{userName}}</strong></p><p>盒子名：{{boxName}}</p><p>￥{{price}}</p></div><div class="p_r"><p class="f12">{{data}}{{time}}</p><p>{{orderstatus}}</p></div></div></li>';
            if ($.isArray(res.list) && res.list.length) {
                var datatime='';
                var orderstatus=$('body').attr('data-orderstatus');
                $.each(res.list,function(index,item){
                    item.time=formatDate(new Date(item.lastUpdated));
                    if(new Date(item.lastUpdated).getHours()<=11){
                        datatime='上午';
                    }else if(new Date(item.lastUpdated).getHours()==12){
                        datatime='中午';
                    }else{
                        datatime='下午';
                    }
                    item.data=datatime;
                    item.orderstatus=orderstatus;
                    html.push(bainx.tpl(template,item));
                });
            }else{
                html=['<li class="tc"><div class="people_box row fvc">没有数据哦！</div></li>'];
            }
            $('.box_order_people ul').append(html.join('')+'<li class="box_next_page tc">下一页</li>');
            if(!res.hasNext){
                $('.box_next_page').remove();
            }
        });
        function   formatDate(now)   {
            var   year=now.getYear();
            var   month=now.getMonth()+1;
            var   date=now.getDate();
            var   hour=now.getHours();
            var   minute=now.getMinutes();
            var   second=now.getSeconds();
            return   hour+":"+minute;
        }
    }


    function Events(){
        $('#direction_box').on('click','.box_next_page',function(){
            var page=parseInt($('body').attr('data-page'))+1;
            getListOfBoxes(2,'',page);
            $('.box_order_people .box_next_page').eq(0).remove();
        }).on('mouseover','.people_box',function(){
          $(this).addClass('active');
        }).on('mouseout','.people_box',function(){
            $(this).removeClass('active');
        }).on('click','.unpaid',function(){
            $('body').attr('data-orderstatus','未付款');
            $('.box_order_people ul').empty();
            $('body').attr('data-page','0');
            $(this).addClass('active').siblings().removeClass('active');
            getListOfBoxes(0,2,0);
        }).on('click','.already_paid',function(){
            $('body').attr('data-orderstatus','已付款');
            $('.box_order_people ul').empty();
            $('body').attr('data-page','0');
            $(this).addClass('active').siblings().removeClass('active');
            getListOfBoxes(0,4,0);
        }).on('click','.no_orders',function(){
            $('body').attr('data-orderstatus','未下单');
            $('.box_order_people ul').empty();
            $('body').attr('data-page','0');
            $(this).addClass('active').siblings().removeClass('active');
            getListOfBoxes(2,'',0);
        }).on('click','.stocking',function(){
            $('body').attr('data-orderstatus','已备货');
            $('.box_order_people ul').empty();
            $('body').attr('data-page','0');
            $(this).addClass('active').siblings().removeClass('active');
            getListOfBoxes(0,6,0);
        }).on('click','.receipt',function(){
            $('body').attr('data-orderstatus','已收货');
            $('.box_order_people ul').empty();
            $('body').attr('data-page','0');
            $(this).addClass('active').siblings().removeClass('active');
            getListOfBoxes(0,7,0);
        }).on('click','.shipped',function(){
            $('body').attr('data-orderstatus','已发货');
            $('.box_order_people ul').empty();
            $('body').attr('data-page','0');
            $(this).addClass('active').siblings().removeClass('active');
            getListOfBoxes(0,5,0);
        })


    }

    return{
        csadDirectionCenterHtml:csadDirectionCenterHtml,
        initDirectionCenter:initDirectionCenter
    }

})