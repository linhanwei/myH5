/**
 * Created by Spades-k on 2016/7/22.
 */
define('h5/js/page/csadAddNotes',[
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/css/page/csadCssZy.css'
], function ($, Data, Common, URL) {
    var userId=URL.param.userId;
    function initAddNotes(){

        Events();

        getNotes();//输出便签

    }

    function csadAddNotesHtml(){
        var template='<section id="addnotes"><div class="notes_box clearfix"><div class="people_msg row fvc fl"><div class="pic"><img src="http://wx.qlogo.cn/mmopen/FicMF6EiaFYTwFTMoext8aOWfPicl72iaotMDLxDyH4moHUCJGDia7KkNEfalrjMLo00ww6x1b8mxvYia5F17jzvryoKFznWV6NIJT/0"></div><div class="name"><p>张三</p></div><div class="time"><p><span class="time_title">注&nbsp;&nbsp;册&nbsp;&nbsp;&nbsp;时&nbsp;&nbsp;&nbsp;间：</span><span class="time_data">2016-03-09</span></p><p><span class="time_title">最新登陆时间：</span><span class="time_data">2016-03-09</span></p></div></div><div class="notes row fvc fl"><div class="notes_con clearfixc"><p class="fl">#这是标签这是标签</p><p class="fl">#这是标签这是标签</p><p class="fl">#这是标签这是标签</p><p class="fl">#这是标签这是标签</p><p class="fl">#这是标签这是标签</p></div><div class="notes_add"><p>添加</p></div></div></div></section>';
        return template;
    }

    function csadAddNotesHtml2(){
            var template='<section id="addnotes2"><div class="n_con"><div class="t_name">张三</div><div class="time_l clearfix"><p class="fl"><span class="time_title">注&nbsp;&nbsp;册&nbsp;&nbsp;&nbsp;时&nbsp;&nbsp;&nbsp;间：</span><span class="time_data">2016-03-09</span></p><p class="fl"><span class="time_title">最新登陆时间：</span><span class="time_data">2016-03-09</span></p></div><div class="notes_box clearfix row fvc"><div class="notes_list clearfix fl"></div><div class="notes_add fl"><p>添加</p></div></div></div></section>';
        return template;
    }

    //获取便签
    function getNotes(){
        var data={
                userId:userId
            },
            html=[];
        Data.selectoneUserTags(data).done(function(res) {
            if(res.info){
                var template='<p class="fl">#{{info}}</p>';
                $.each(res.info,function(index,item){
                    html.push(bainx.tpl(template,item));
                });
                $('.notes_list').append(html.join(''));
            }
        })
    }

    function pop(){
        var temple='<div class="pop_add hide"><div class="pop_box"><div class="add_con"><input type="text" placeholder="输入标签"><p>请输入最多20个字</p></div><div class="pop_btn row fvc fac"><div class="cancel col">取消</div><div class="confirm col">确定</div></div></div></div>';
        return temple;
    }


    function Events(){
        $('#addnotes,#addnotes2').on('click','.notes_add p',function(){
            $('.pop_add').show();
        }).on('click','.cancel',function(){
            $('.pop_add').hide();
            $('.add_con input').val('');
        }).on('click','.confirm',function(){
            var tag= $('.add_con input').val();
            if(!tag){
                return;
            }
            var data={
                userId:userId,
                tag:tag
            }
            Data.addOneUserTagInfo(data).done(function(res) {
                if(res.flag==1) {
                    bainx.broadcast('添加成功！');
                    $('.pop_add').hide();
                    $('.add_con input').val('');
                }
            })
        })
    }


    return{
        csadAddNotesHtml:csadAddNotesHtml,
        csadAddNotesHtml2:csadAddNotesHtml2,
        pop:pop,
        initAddNotes:initAddNotes
    }

})