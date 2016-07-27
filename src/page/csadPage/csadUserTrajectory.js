/**
 * Created by Spades-k on 2016/7/20.
 */
define('h5/js/page/csadUserTrajectory',[
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/css/page/csadCssZy.css'
], function ($, Data, Common, URL) {

    function initUserTrajectory(){
        Events();
    }

    function csadUserTrajectoryHtml(){
        var template='<section class="page-content grid" id="_index"><div class="usertrajectory_user_box"><div class="box_nav"><ul class="clearfix"><li class="fl"><div>诊断分析报告</div></li><li class="fl active"><div>用户轨迹</div></li><li class="fl">&nbsp;</li></ul></div><div class="con"><div class="buy_box_records"><div class="title tc">购买盒子记录</div><div class="table_con"><table class="one_msg"><tbody><tr><td width="5%"><i>7</i></td><td width="15%"><p>2016-04-24</p></td><td width="21%">盒子名：28天美白淡斑盒</td><td width="7%">￥388</td><td style="color:#FF6868; " width="10%">已付款</td><td width="20%"><ul class="clearfix"><li class="fl">课程进度：</li><li class="fl"><p>共560分钟</p><p>第1/28天<p>已完成2/56次</p></li></ul></td><td width="15%"><a href="#">查看盒子>></a></td></tr></tbody></table><table class="more_msg"><tbody><tr><td width="5%" style="border-bottom: 0;"><i>7</i></td><td width="15%" style="border-bottom: 0;"><p>2016-04-24</p></td><td width="21%">盒子名：28天美白淡斑盒</td><td width="7%">￥388</td><td width="10%" style="color: #FF6868;">已付款</td><td width="20%"><ul class="clearfix"><li class="fl">课程进度：</li><li class="fl"><p>共560分钟</p><p>第1/28天<p>已完成2/56次</p></li></ul></td><td width="15%"><a href="#">查看盒子>></a></td></tr><tr><td width="5%"></td><td width="15%"><p></p></td><td width="21%">盒子名：28天美白淡斑盒</td><td width="7%">￥388</td><td width="10%" style="color: #FF6868;">已付款</td><td width="20%"><ul class="clearfix"><li class="fl">课程进度：</li><li class="fl"><p>共560分钟</p><p>第1/28天<p>已完成2/56次</p></li></ul></td><td width="15%"><a href="#">查看盒子>></a></td></tr></tbody></tbody></table></div><div class="up_and_down"><p>展开</p></div></div><div class="analysis_report_list"><div class="buy_box_records"><div class="title tc">分析报告列表</div><div class="table_con"><table class="one_msg"><tbody><tr><td width="5%"><i>7</i></td><td width="15%"><p>2016-04-24</p></td><td width="25%">盒子名：28天美白淡斑盒</td><td width="10%" style="color:#FF6868; ">已付款</td><td width="30%">报告生成时间：2016-01-01 12:00</td><td width="15%"><a href="#">查看报告>></a></td></tr></tbody></table><table class="more_msg"><tbody><tr><td width="5%" style="border-bottom: 0;"><i>7</i></td><td width="15%" style="border-bottom: 0;"><p>2016-04-24</p></td><td width="25%">盒子名：28天美白淡斑盒</td><td width="10%" style="color:#FF6868; ">已付款</td><td width="30%">报告生成时间：2016-01-01 12:00</td><td width="15%"><a href="#">查看报告>></a></td></tr><tr><td width="5%"></td><td width="15%"><p></p></td><td width="25%">盒子名：28天美白淡斑盒</td><td width="10%" style="color:#FF6868; ">已付款</td><td width="30%">报告生成时间：2016-01-01 12:00</td><td width="15%"><a href="#">查看报告>></a></td></tr></tbody></tbody></table></div><div class="up_and_down"><p>展开</p></div></div></div><div class="product_usage_record"><div class="buy_box_records"><div class="title tc">产品使用记录<span class="addrecord">新增记录</span></div><div class="table_con"><table class="one_msg"><tbody><tr><td width="5%"><i>7</i></td><td width="31%"><p style="padding: 0;background-color: white;border-radius: 0;">2016-04-24 12:00</p><p style="display:block;padding: 0;background-color: white;border-radius: 0;color: #B4B4B4;">28天美白淡化盒 2016年1月1日开始使用</p></td><td width="37%"><p>有时使用产品和观看课程视频，皮肤状态良好</p></td><td width="10%"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160720/vNTT-0-1468986618254.jpg"></td><td width="25%"><a href="#">编辑记录>></a></td></tr></tbody></table><table class="more_msg"><tbody><tr><td width="5%" style="border-bottom: 0;"><i>7</i></td><td width="31%" style="border-bottom: 0;"><p style="display:block;padding: 0;background-color: white;border-radius: 0;">2016-04-24 12:00</p><p style="padding: 0;background-color: white;border-radius: 0;color: #B4B4B4;">28天美白淡化盒 2016年1月1日开始使用</p></td><td width="37%">有时使用产品和观看课程视频，皮肤状态良好</td><td width="10%"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160720/vNTT-0-1468986618254.jpg"></td><td width="25%"><a href="#">编辑记录>></a></td></tr><tr><td width="5%"></td><td width="31%"><p></p></td><td width="37%">有时使用产品和观看课程视频，皮肤状态良好</td><td width="10%"><img src="" /></td><td width="25%"><a href="#">编辑记录>></a></td></tr></tbody></table></div><div class="up_and_down"><p>展开</p></div></div></div></div></div></section>';
        return template;
    }

    function Events(){
        $('body').on('click','.up_and_down',function(){
           $(this).prev().slideToggle("slow");
        })
    }






    return{
        initUserTrajectory:initUserTrajectory,
        csadUserTrajectoryHtml:csadUserTrajectoryHtml
    }

})