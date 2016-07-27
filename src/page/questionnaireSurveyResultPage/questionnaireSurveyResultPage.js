/**
 * 问卷调查 结果
 * Created by xiuxiu on 2016/4/22.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/nexter',
    'h5/js/common/data',
    'h5/js/common/loadImage',
    'h5/js/common/goods'
], function($, URL, Common,Nexter, Data,LoadImage,Goods) {

    var Page,
        firstLoad = true;

    function init() {

        render();
    }
    function render() {

        Page = $('<div class="page-content grid" id="questionContainer"><div class="result">您的肌肤类型：<span></span></div><div class="goodsList grid"><h3>护肤品智能推荐：</h3><ul></ul></div> </div><div class="bottom_bar"> <span class="btn">咨询专家</span> </div>').appendTo('body');


        if ($('.goodsList').offset().top < $(window).height()*1.5 && firstLoad) {
            getGoodsList();
            firstLoad = false;
        }

        bindEvents();
    }


    function bindEvents() {
        Page.on('tap', '.btn', function (event) {
            event.preventDefault();
            URL.assign(location.href + '?app=1');
        }).on('tap','.viewMore',function(event){
            event.preventDefault();
            if($(this).hasClass('hide')){
                $(this).text('展开更多').removeClass('hide');
                $(this).parent('.narrowContent').find('.desc').removeClass('show').addClass('hide');
            }else{
                $(this).text('收起').addClass('hide');
                $(this).parent('.narrowContent').find('.desc').addClass('show').removeClass('hide');
            }
        })
    }


    function getGoodsList(){
        var element = $('#questionContainer');
        var nexter = new Nexter({
            element: element,
            dataSource: Data.getoneSkinAndItems,
            enableScrollLoad: true,
            data: {
                //itemTypes: 9
            }
        }).load().on('load:success', function (res) {
            console.log(res);
            var html=[];
            if (res.itemlist.length) {
                $.each(res.itemlist, function (index, item) {
                    html.push(htmlItem(item));
                });
                $('.goodsList ul').append(html.join(''));
                LoadImage(this.element);
                $('.goodsList ul li').each(function(index){
                    // console.log($(this).find('.desc').height(),index)
                    if($(this).find('.desc').height() <= 22){
                        $(this).find('.viewMore').hide();
                    }
                })
                $('.result span').text(res.skinType);
            } else if (this.get('pageIndex') == 0) {
                $('.goodsList ul').html('<div class="not-has-msg"><img src="'+imgPath+'/common/images/loading_fail.png"/><p>灰常抱歉，暂时没有数据哦</p></div>');
            }

        }).render();

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

    function htmlItem(item){
        var tpl = '<li ><div class="row" href="'+URL.goodsDetail+'?gid={{id}}"> <div class="col col-19"><div class="grid"><div class="row"><div class="thumb"><img data-lazyload-src="{{listimg}}" /></div><div class="goods col "><span class="title">{{title}}</span><div class="pricec-item"><span class="price">{{_htmlPrice}}</span><del class="price">{{_htmlRelPrice}}</del></div> <span class="buyBtn">立即购买</span></div></div> </div></div></div><div class="narrowContent"><div class="descBox"> <p class="hide desc">推荐理由：{{keyWord}}</p></div><span class="viewMore">展开更多<i></i></span></div> </li>',
            thumbsHtml = [];
        //item.price = Common.moneyString(item.price);
        //
        //if(item.pics){
        //    item.pics = item.pics.split(';')[0];
        //    $.each(item.pics,function(index,item) {
        //        thumbsHtml.push('<img src="'+item+'" alt="" >');
        //    });
        //    item.pics = thumbsHtml.join('');
        //}
        var goods = Goods.create(item);
        goods.listimg = goods.picUrls + '!300q75';
        goods.keyWord = '传说中无所不能的“红BB”，让你的皮肤如明星般匀净透白！谜尚(MISSHA)魅力润颜白皙柔护霜SPF30+/PA+++13#50ml，遮瑕力No.1的红B.B霜，具有更完美的遮盖力及保湿力，轻松隐藏面部所有瑕疵。令肌肤焕然一新，水润剔透、富有弹性。'


        return bainx.tpl(tpl, goods);
    }
    init()
})
