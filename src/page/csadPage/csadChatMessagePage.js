/**
 * 聊天消息
 * Created by xiuxiu on 2016/7/18.
 */
require([
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/csadCommon'
], function($,URL, Data,CommonCsad)
{
    function init(){
        $('.waitting').hide();
        CommonCsad.layout();

        var template = '<section class="row"><div class="accordion-inner" id="momogrouplist"> <ul id="momogrouplistUL" class="chat03_content_ul"></ul></div><div id="nullchater">暂时没有会话消息哦~</div><div class="mainContainer col col-10 hide"><div class="chatRight"><div id="chat01"><div class="chat01_title grid"><ul class="talkTo row"><li id="talkTo" class="col col-20"><a></a></li><li class="col col-5"><span id="ext" >结束会话</span></li></ul></div><div id="null-nouser" class="chat01_content"></div></div><div class="chat02"><div class="chat02_title">'+inittoolHtml()+'<div id="wl_faces_box" class="wl_faces_box"><div class="wl_faces_content"><div class="title"><ul><li class="title_name">常用表情</li><li class="title_name" style="left:105px;" id="tusijiBtn">兔斯基</li><li class="wl_faces_close"><span class="turnoffFaces_box"></span></li></ul></div><div id="wl_faces_main" class="wl_faces_main"><ul id="emotionUL" class="emtionList"></ul><ul id="tusijiUL" class="emtionList" style="display:none"></ul></div></div><div class="wlf_icon"></div></div></div><div id="input_content" class="chat02_content"><textarea id="talkInputId" style="resize: none;"></textarea></div><div class="chat02_bar"><span class="sendText">发送</span></div></div></div></div>  <input type="file" id="fileInput" style="display:none;"/><div class="rightNa col col-10"></div> </section>'

        $('.wrapper').append(template);

        //添加大表情
        var bigEmtionList = ['002','007','010','012','013','018','019','020','021','022','024','027','029','030','035','040'],
            bigEmtionHtml = [];
        $.each(bigEmtionList,function(index,item){
            bigEmtionHtml.push('<li><img data-name="[示例'+(index+1)+']" src="'+imgPath+'common/images/personalTailor/csad/faces/icon_'+item+'.gif"/></li>');
        })
        $('#tusijiUL').append(bigEmtionHtml.join(''));
    }
    function inittoolHtml(){
        var html = [],
            data = [
                {
                    name:'表情',
                    className:'showEmotionDia',
                    type:'',
                    id:''

                },{
                    name:'图片',
                    className:'sendIt',
                    type:'img',
                    id:'sendPicInput'

                },{
                    name:'语音',
                    className:'sendIt',
                    type:'audio',
                    id:'sendAudioInput'

                },{
                    name:'录音',
                    className:'recordBtn startRecord',
                    type:'',
                    id:''

                }],
            tpl ='<input id="{{id}}" class="hide"/><a class="chat02_title_btn ctb01 {{className}}"  title="{{name}}" type="{{type}}"></a>';
        $.each(data,function(index,item){

            html.push(bainx.tpl(tpl,item));
        })

        return html.join('')

    }

    init();
})