/**
 * 问卷调查
 * Created by xiuxiu on 2016/4/19.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/data',

], function($, URL, Common, Data) {

    var Page,
        dialog,
        uuid  = URL.param.uuid,
        name = URL.param.name,
        _uid = URL.param.uid,
        moveId = '',        //进度条的值;
        type = URL.param.type,
        hasDataW =false;

    if(_uid){
        var arrUid = _uid.split("_");
        if(arrUid.length > 1){
            _uid = parseInt(arrUid[1]);
        }
    }else{
        _uid = -1;
    }

    function init() {

        render();

        edit();

    }

    function render() {

        Page = $('<div id="questionContainer" class="page-content"></div>').appendTo('body');

            var data = {
                uuid:uuid
            }
            Data.getoneSkinDataByUuid(data).done(function(res){

                initHtml(res)

            })

    }

    function initHtml(res){


        var  resTpl = '<dd data-lastqid="{{prevId}}" data-lastoptids="{{prevOptionId}}" data-lastoptid="{{lastOptid}}" data-currentoptids="{{optionValue}}"><span>{{questionShorter}}</span><span class="answer-item">{{optionAnswer}}</span></dd>',
            html=[],
            detail=[];

        $.each(res.data, function(index, item){
            if(item.questionId != 0 && item.reportPrintArea != 0){

                if(item.optionShowStyle == 2){
                    item.optionRvalue = '<b class="color" style="background-color: '+item.optionName+'"></b>';
                }
                item.optionAnswer = item.optionRvalue;
                if (item.questionType == 4) {

                    html.push(bainx.tpl(resTpl, item));

                } else {


                    detail.push(bainx.tpl(resTpl, item))
                }

            }

        });

        name = name ? name : '我们来回顾下您';
        $('#questionContainer').find('.question_item').addClass('hide');
        $('#questionContainer').append('<div class="resultPage"><p class="title">'+name+'的肌肤测试</p><ul><li class="skinCondition"><h3>肌肤状态</h3><dl class="detail">'+html.join('')+'</dl></li><li class="lifeStyle"><h3>生活方式</h3><dl class="detail">'+detail.join('')+'</dl></li></ul></div>');

        if(!type){
            $('#questionContainer').append('<div class="bottom_bar grid"><ul class=" row"><li class="col start" href="'+URL.questionnaireSurveyPage+'"><span class=" btn">重新开始</span></li><li class="col"><span class=" btn reset" href="'+URL.questionnaireSurveyResultPage+'">确定</span></li></ul></div>')
        }

        if(type =='edit') {
            //$('.title').hide();
            $('.resultPage').find('.answer-item').addClass('editAnswer');
            $('.skinCondition h3').text('您的肌肤状态');
            $('.lifeStyle h3').text('您的生活方式');

        }
        if(type =='SkinData'){
            TypeTest('W');
            $('.title').hide();
        }

        if(localStorage.length > 0) {    //localStorage
                localStorage.removeItem(_uid)
        }
    }

    //测肤数据
    function TypeTest(timetype){
        var data = {
            profileId:_uid,
            timetype:timetype
        }
        Data.selectByNewTimeTypeTest(data).done(function(res){
            var item = {
                measureValue1:res.list[0].measureValue,
                measureValue2:res.list[1].measureValue,
                measureValue3:res.list[2].measureValue,
                measureValue4:res.list[3].measureValue
            }


            if(item.measureValue1 == 0 && item.measureValue2 == 0 && item.measureValue3 == 0 &&item.measureValue4 == 0 && timetype =='W'){
                hasDataW = true;
                TypeTest('Y');

            }else{
                hasDataW = false;
            }

            if(!hasDataW){
                var  resTpl = '<dd >脸颊：{{measureValue3}}%</dd><dd >T区：{{measureValue2}}%</dd><dd >额头：{{measureValue1}}%</dd><dd >下巴：{{measureValue4}}%</dd>',
                    html=[];
                html.push(bainx.tpl(resTpl, item));
                $('.lifeStyle').after('<li><h3>测肤数据</h3><dl class="detail">'+html.join('')+'</dl></li>');
            }
        })
    }

    //修改问题
    function edit(){
        if(type =='edit') {
            $('body').on('tap', '.resultPage dd', function () {
                var questionId = $(this).data('lastqid'),
                    optionIds = $(this).data('lastoptids').toString(),
                    _currentOptIds = $(this).data('currentoptids').toString(),
                    optionId = optionIds.indexOf(';') > -1 ? -2 : optionIds;

                $(this).addClass('currentQ').siblings().removeClass('currentQ');
                initQuestion(questionId, optionId, optionIds, true, _currentOptIds);
            }).on('tap', '.btn', function () {
                if ($(this).hasClass('sure')) {
                    var answerIdArr = [],
                        optionstype = $('.answerBox dl').data('optionstype');
                    $('.active').each(function () {
                        answerIdArr.push($(this).data('id'));
                    })
                    answerIdArr = answerIdArr.join(';');


                    console.log(answerIdArr);
                    var qid = $('.currentQuestion').data('question'),
                        oId = optionstype == 1 ? answerIdArr : -2,
                        oIds = answerIdArr;

                    if ($('.blockDiv').length > 0) {
                        oIds = moveId;
                        oId = moveId;
                    }

                    initQuestion(qid, oId, oIds, false);
                } else {
                    $('.currentQuestion').remove();
                }

            }).on('tap', '.answerBox dd', function (event) {
                event.preventDefault();
                var answerNum = parseInt($(this).parent('dl').data('answernum'));
                if (answerNum > 1) {
                    chooseRC($(this), false, answerNum)
                } else {
                    chooseRC($(this), true)
                }
            })
        }
    }

    //初始化问题
    function initQuestion(questionId,optionId,optionIds,isShow,_currentOptIds){
        var data = {
                questionId:questionId,
                optionId:optionId,
                optionIds:optionIds,
                flag:1,
                uuid:uuid,
                uid:_uid
            },
            answerTextArr = [],
            _con = $('#questionContainer');

        if($('.currentQuestion').length > 0 && $('.currentQuestion').find('.active').length > 0){


            $('.active').each(function(){
                answerTextArr.push($(this).text());
            })

            if ($('.blockDiv').length > 0) {
                answerTextArr = $('.moveTips').text();
            }

            $('.answerBox').attr('data-answerText',answerTextArr);
        }


        Data.finalselectBydevQuestions(data).done(function(res){

            if(isShow){
                var question = res.question,
                    option = res.option;


                var template = '<div class="question_item question{{id}} currentQuestion" data-index="{{index}}"  data-question={{id}} data-uuid={{uuid}}><p class="title">{{questionName}}</p><p class="tips">{{questionDes}}</p><div class="answerBox" data-last="{{isend}}">{{touchHtml}}<dl data-answernum="{{optionsSelectableMaxnum}}" data-optionstype="{{optionsSelectableType}}">{{answerTPL}}</dl></div><div class="bottom_bar grid"> <ul class=" row"><li class="col"><span class="sure btn">确定</span></li><li class="col"><span class="btn reset" >取消</span></li></ul> </div></div>',
                    html = [],
                    answer = [];
                question.uuid = res.uuid;
                question.isend = res.isend == true ? '1':'0';

                var answerTPL = '',
                    touchContent = '';

                if(option) {

                    $.each(option, function (index, itemA) {
                        switch (itemA.optionShowStyle){
                            case 1://文字
                                answerTPL = '<dd ><span data-id="{{id}}">{{optionValue}}</span><p>{{optionDes}}</p> </dd>';
                                answer.push((bainx.tpl(answerTPL, itemA)));
                                break;
                            case 2:  //色值
                                touchContent = '<dd data-color="{{optionValue}}" data-id="{{id}}" style="background-color: {{optionName}}"></dd>';
                                answer.push((bainx.tpl(touchContent, itemA)));

                                break;

                            case 3://进度条
                                touchContent = '<dd data-value="{{optionValue}}" data-id="{{id}}" style="height: 0;opacity: 0"></dd>';
                                answer.push((bainx.tpl(touchContent, itemA)));
                                break;
                        }

                    });

                    question.answerTPL = answer.join('');

                    if(option[0].optionShowStyle == 2){
                        question.touchHtml = '<div class="blockDiv colorBlock" ><dl class="colorBlockInner" id="colorBlock'+question.id+'">'+question.answerTPL+'</dl> <span id="block'+question.id+'" class="block1"></span><p class="blockDrapTips">请将滑块向上下拖动</p></div>';

                    }
                    if(option[0].optionShowStyle == 3){
                        question.touchHtml = '<div class="blockDiv colorBlock2" > <div id="colorBlock'+question.id+'" class="colorOuter"><div class="inner" id="colorBlockInner'+question.id+'"></div></div><span id="block'+question.id+'" class="block2"></span><span class="moveTips">'+option[0].optionValue+'</span></div><p class="blockDrapTips">请将滑块向上下拖动</p>';
                    }
                }
                html.push(bainx.tpl(template, question));
                _con.append(html.join(''));

                var _currentQusetion = $('.currentQuestion'),

                    chooseAnswer = _currentQusetion.find('dd').children('span');

                var optionIdsArr = _currentOptIds.split(';');

                chooseAnswer.each(function () {
                    for (var k in optionIdsArr) {
                        if ($(this).data('id') == optionIdsArr[k]) {
                            $(this).addClass('active');
                        }
                    }
                })

                if(_currentQusetion.find('dd').length < 4){
                    _currentQusetion.find('dd').addClass('block');
                }

                if(_currentQusetion.find('.colorBlock').length > 0){

                    var block = _currentQusetion.find('.block1')[0],
                        outer = _currentQusetion.find('.colorBlock').height(),
                        ddCont = _currentQusetion.find('.colorBlockInner').find('dd');


                    drapColor(block,outer,ddCont);
                }
                if(_currentQusetion.find('.colorBlock2').length > 0){
                    var block = _currentQusetion.find('.block2')[0],
                        outer = _currentQusetion.find('.colorBlock2').height(),
                        ddCont = _currentQusetion.find('.answerBox').find('dd'),
                        inner = _currentQusetion.find('.inner')[0],
                        tips = _currentQusetion.find('.moveTips')[0];
                    drapProgress(block,outer,inner,tips,ddCont)
                }

            }
            else{

                $('.currentQ').children('.answer-item').text(answerTextArr);
                $('.currentQuestion').remove();

            }



        })
    }


    // 拖拽事件
    function drap(block,outer,callbackinnder){
        var oW,oH;

        block.addEventListener("touchstart", function(e) {
            var touches = e.touches[0];
            oW = touches.clientX - block.offsetLeft;
            oH = touches.clientY - block.offsetTop;
            //阻止页面的滑动默认事件
            document.addEventListener("touchmove",defaultEvent,false);
        },false)

        block.addEventListener("touchmove", function(e) {
            var touches = e.touches[0];


            var oTop = touches.clientY - oH;


            if(oTop > -10 && oTop < outer-10) {

                block.style.top = oTop + "px";

                callbackinnder(oTop);
            }

        },false);

        block.addEventListener("touchend",function() {
            document.removeEventListener("touchmove",defaultEvent,false);
        },false);
        function defaultEvent(e) {
            e.preventDefault();
        }
    }

    //
    function drapProgress(block,outer,inner,tips,ddCont){
        //拖拽事件 的

        drap(block,outer,callback2);

        function callback2(oTop){
            var avgH = outer / (ddCont.length);
            inner.style.height = oTop + 9 + "px";
            for(var i = 0,l = ddCont.length; i< l; i++){
                if(oTop > avgH * i && oTop < avgH * (i+1)){
                    tips.innerHTML = ddCont.eq(i).data('value');
                    moveId = ddCont.eq(i).data('id');

                }
            }

        }

    }
    function drapColor(block,outer,ddCont){


        drap(block,outer,callback1);
        function callback1(oTop){


            for(var i in ddCont){
                if($('window').height() < 480){
                    if(oTop > 19 * i && oTop < 19 * (i+1)){
                        moveId = ddCont.eq(i).data('id');
                    }
                }else{
                    if(oTop > 26 * i && oTop < 26 * (i+1)){
                        moveId = ddCont.eq(i).data('id');
                    }
                }
            }

        }
    }


    //判断是否是多选
    function chooseRC(target,canMultiple,chooseNum){
        canMultiple == true ? chooseAnswerRadio(target) : chooseAnswerCheckbox(target,chooseNum);
    }

    //单选
    function chooseAnswerRadio(target){
        var _span = target.children('span'),
            _view =target.parents('.answerBox'),
            siblingsSpan = _view.find('span');
        siblingsSpan.removeClass('active');
        _span.addClass('active');

    }

    //多选
    function chooseAnswerCheckbox(target,chooseNum){
        var _span =target.children('span'),
            _view =target.parents('.answerBox'),
            _activeL = _view.find('.active').length;

        // console.log(_activeL);
        if(_span.hasClass('active')){
            _span.removeClass('active')

        }else{
            if(_activeL < chooseNum) {
                _span.addClass('active')

            }
            else
            {
                bainx.broadcast('最多只能选择'+chooseNum+'个')
            }
        }
    }


    init();
})