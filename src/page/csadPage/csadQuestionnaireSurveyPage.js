/**
 * 问卷调查
 * Created by xiuxiu on 2016/4/19.
 */
define('h5/js/page/csadQuestionnaireSurveyPage', [
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/data',
    'plugin/addressData/1.0.0/addressData',
    'h5/js/common/questionData'
], function($, URL, Common, Data,addressData,QuestionData) {

    var questionSurvey = function(_uid,rid,userName,userTel,serviceId)
    {
        var Page,
            _flag = false,
            _status,
            hasNotCreateBox = true,
            canEdit = true,
            fileTpl = '<dd><div class="addPic"><form id="my_form" enctype="multipart/form-data"><img src="'+imgPath + 'common/images/personalTailor/pic_add.png"/><input type="hidden" name="type" value="1"/> <input type="file" class="file" name="file"  multiple="multiple"/></form></div>  </dd>';//上传图片

        _uid = manageId(_uid);//用户id
        //处理id
        function manageId(id){

            var arrId = id.split("_");
            if(arrId.length > 1){
                id = parseInt(arrId[1]);
            }

            return id;
        }

        function init(){
            render();
        }

        function render(){



            judgeStatus();

            bindEvents();

        }

        //布局
        function layout(data){
            var
                imgs = data && data.imgs ? data.imgs.split(';') : '',
                demand = data && data.demand ? data.demand : '',
                expertDiagnose = data && data.expertDiagnose ? data.expertDiagnose : '',
                question = initQuestion(),
                basicMessageTpl = getUserMessage(data),
                sovleQuestionTpl = wantSovleQuestion(imgs,demand,expertDiagnose),
                data = [
                    {
                        name:'基本信息',
                        content:basicMessageTpl,
                        className:'basicMessage'
                    },{
                        name:'生活和身体状况',
                        content:question.htmlA,
                        className:'lifeAndBodyCondition'
                    },{
                        name:'肌肤状况/日常护理习惯',
                        content:question.htmlB,
                        className:'skinCondition'
                    },{
                        name:'目前最想解决的皮肤问题/确诊问题',
                        content:sovleQuestionTpl,
                        className:'wantToSolve'
                    }
                ],
                tpl ='<div class="boxItem {{className}}"><div class="title">{{name}}</div><div class="contentItem grid">{{content}}</div></div>',
                html = [];
            $.each(data,function(index,item){
                html.push(bainx.tpl(tpl,item));
            })

            $('.containerQuestion').append(html.join(''));

            if($('.sex.active').length == 0){
                $('.sex').eq(1).addClass('active');
            }
            if($('.isHaveHealproduct.active').length == 0){
                $('.isHaveHealproduct').eq(0).addClass('active');
            }
        }

        //用户基本信息
        function getUserMessage(data){
            var _userName = userName,
                birthday = '',
                mobile = userTel,
                city = '',
                sex,
                isHaveHealproduct;
            if(data){
                _userName = data.name;
                birthday = data.birthday;
                mobile = data.mobile;
                city = data.city;
                sex = data.sex;
                isHaveHealproduct = data.isHaveHealproduct;
            }
            var basicMessage = '<div class="col"> <label>{{label}}:</label>{{content}}</div>',
                basicMessageHtml = [],
                basic = [
                    {
                        label:'昵称',
                        type:'text',
                        name:'userName',
                        value:_userName
                    },
                    {
                        label:'性别',
                        type:'radio',
                        name:'sex',
                        option:[
                            {
                                value:'男',
                                id:1
                            },{
                                value:'女',
                                id:2
                            }
                        ],
                        value:sex
                    },
                    {
                        label:'生日',
                        type:'date',
                        name:'birthday',
                        value:birthday
                    },
                    {
                        label:'电话号码',
                        type:'tel',
                        name:'tel',
                        value:mobile
                    },
                    {
                        label:'常居住地',
                        type:'text',
                        name:'address',
                        value:city
                    },
                    {
                        label:'是否服用保健品',
                        type:'radio',
                        name:'isHaveHealproduct',
                        option:[
                            {
                                value:'是',
                                id:1
                            },{
                                value:'否',
                                id:0
                            }
                        ],
                        value:isHaveHealproduct
                    }
                ],
                _index = 0;

            $.each(basic,function(i,basicItem){

                if (i % 2 == 0) {
                    basicMessageHtml.push('<div class="row">');
                }
                if(basicItem.type=='radio'){
                    var optiontpl = '<span  class="choice basicChoice {{name}} {{active}}" data-id="{{id}}"><i></i>{{value}}</span>',
                        optionhtml =[];
                    $.each(basicItem.option,function(j,optionItem){
                        optionItem.name = basicItem.name;
                        optionItem.active = basicItem.value == optionItem.id ? 'active' : '';
                        optionhtml.push(bainx.tpl(optiontpl,optionItem));
                    })
                    basicItem.content=optionhtml.join('');

                }else{
                    basicItem.content='<input type="'+basicItem.type+'" class="'+basicItem.name+'" name="'+basicItem.name+'" value="'+basicItem.value+'"/>'
                }


                basicMessageHtml.push(bainx.tpl(basicMessage,basicItem));
                if (i % 2 == 1) {
                    basicMessageHtml.push('</div>');
                }
                _index = i;

            })
            if (_index % 2 == 0) {
                basicMessageHtml.push('</div>');
            }
            return basicMessageHtml.join('');
        }

        //想要解决的问题
        function  wantSovleQuestion(list,demand,expertDiagnose){
            var imgList = '';
            if(list){
                var tplHtml = [];
                $.each(list,function(index,item){
                    tplHtml.push('<dd  class="active"><img src="'+ item+'" /><i class="deleteImg"></i></dd>');
                })
                imgList = tplHtml.join('');
            }
            var Tpl = '<div class="textarea" class="demand"><p>1、需求问题</p><textarea class="demand">'+demand+'</textarea><p>1、确诊问题</p><textarea class="diagnose">'+expertDiagnose+'</textarea><dl>'+imgList+fileTpl+'</dl></div>';

            return Tpl

        }

        //判断用户答到哪一步
        function judgeStatus(){

            if(rid){
                var data = {
                    dId : rid
                }
                Data.getDetectRecordDetail(data).done(function(res){
                    appendToMain(res,false);
                })
            }
            if(_uid){
                var data = {
                    userId : _uid
                }
                Data.getLastUserDetectDataByUserId(data).done(function(res){
                    appendToMain(res,true);

                })
            }
        }

        //查询到数据之后的操作
        function appendToMain(res,restart){
            _status = res.flag;//flag=0没有答过题,需要用户或者专家进行重新答题  flag=1 单单用户的插入基本信息  flag=2 专家进行帮填的操作 flag=3 专家问诊的操作
            var data = res.data  ? res.data : '';

            layout(data); //list==素颜照的src


            if(_status == 3 && !restart){   //去生成盒子，不可编辑

                $('.containerQuestion input,.containerQuestion textarea').attr('readonly','readonly');
                $('.deleteImg').hide();
                canEdit = false;
            }
            if(data) {

                $('.containerQuestion').attr('data-id', data.id)
                var skinCondition = data.skinCondition ? data.skinCondition.split('&') : '',
                    lifeAndBodyCondition = data.lifeAndBodyCondition ? data.lifeAndBodyCondition.split('&') : '';
                if (!canEdit) {
                    $('.lifeAndBodyCondition').find('dd').addClass('hide');
                    $('.skinCondition').find('dd').addClass('hide');
                    $('.addPic').addClass('hide');
                }

                if (lifeAndBodyCondition) {
                    $.each(lifeAndBodyCondition, function (i, itemList) {
                        var lifeAndBodyItem = itemList ? itemList.split(';') : '';
                        $.each(lifeAndBodyItem, function (j, item) {
                            $('.lifeAndBodyCondition').find('dd').each(function () {
                                if ($(this).data('id') == item) {

                                    $(this).attr('class', 'active');

                                }
                            })
                        })
                    })
                }
                if (skinCondition) {
                    $.each(skinCondition, function (i, itemList) {
                        if (skinCondition.length > (i + 1)) {
                            var skinConditionItem = itemList ? itemList.split(';') : '';
                            $.each(skinConditionItem, function (j, item) {
                                $('.skinCondition').find('dd').each(function () {
                                    if ($(this).data('id') == item) {
                                        $(this).attr('class', 'active');
                                    }
                                })
                            })
                        }


                    })
                    var tableData = skinCondition[3];
                    tableData = tableData.split(';');
                    $('table').find('.td').each(function (i) {
                        if (tableData[i] == '无') {
                            tableData[i] = '';
                        }
                        var targetInput = $(this).find('input'),
                            targetSpan = $(this).find('span');
                        targetInput.val(tableData[i]);
                        targetSpan.addClass(tableData[i]);
                    })
                }

            }

            if(canEdit){
                $('<div class="footer grid questionTool"><div class="row"> <span class="draftBtn col">保存草稿</span><span class="submitBtn col">生成盒子 >></span></div></div> ').appendTo('.containerQuestion');
            }

            if(_status == 4){
                hasNotCreateBox = false;
            }

        }



        //提交问题
        function submitQuestion(isdraft){

            var flag = isdraft ? -1: 3,
                lifeAndBodyCondition = [],
                skinCondition = [],
                imgs = [],
                demand = $('.demand').val(),
                expertDiagnose = $('.diagnose').val();

            //生活和身体状况
            $('.lifeAndBodyCondition .question_item').each(function(){
                var quetionA = [];
                $(this).find('.active').each(function(){
                    quetionA.push($(this).data('id'));
                })
                quetionA = quetionA.join(';');
                lifeAndBodyCondition.push(quetionA);
            })
            lifeAndBodyCondition = lifeAndBodyCondition.join('&');

            //肌肤状况,日常护理习惯
            $('.skinCondition .question_item').each(function(){
                var quetionB = [],colAll = [];
                $(this).find('.active').each(function(){
                    quetionB.push($(this).data('id'));
                })
                quetionB = quetionB.join(';');
                if($(this).find('table').length > 0){
                    $(this).find('.td').each(function(){
                        var value;

                        if($(this).find('input').length > 0){
                            value =  $.trim($(this).find('input').val()) ? $.trim($(this).find('input').val()) : '无';
                        }
                        if($(this).find('span').length > 0){
                            value = $(this).find('.activeSpan').length  == 0 ? '无' : 'activeSpan';
                        }
                        colAll.push(value);


                    })
                    colAll = colAll.join(';');

                }

                quetionB += colAll;

                skinCondition.push(quetionB);

            })
            skinCondition = skinCondition.join('&');


            //素颜照
            $('.wantToSolve dd.active').each(function(){
                imgs.push($(this).find('img').attr('src'));
            })
            imgs = imgs.join(';');

            // console.log(lifeAndBodyCondition,skinCondition,imgs);

            var data = {
                flag:flag,
                userId:_uid,
                dpId:$('.containerQuestion').data('id') && hasNotCreateBox ? $('.containerQuestion').data('id') : 0,
                name:$('input[name=userName]').val(),
                sex:$('.sex.active').data('id'),
                isHaveHealproduct:$('.isHaveHealproduct.active').data('id'),
                birthday:$('input[name=birthday]').val(),
                mobile:$('input[name=tel]').val(),
                city:$('input[name=address]').val(),
                lifeAndBodyCondition:lifeAndBodyCondition,
                skinCondition:skinCondition,
                imgs:imgs,
                demand:demand,
                expertDiagnose:expertDiagnose,
                serviceId:serviceId
            }

            Data.insertOneDetectQuestionData(data).done(function(res){
                var _rid = res.data.id;
                bainx.broadcast('保存成功！');
                $('.containerQuestion').attr('data-id',_rid)

                if(!isdraft){
                    var boxData={detectReportId:_rid}
                    Data.createOrUpdateBox(boxData).done(function (res) {
                        bainx.broadcast('生成盒子成功！');
                        URL.assign(URL.createMineBoxPage+'?boxId='+res.vo.id+'&rid='+_rid+'&canEdit=true')
                    })
                }


            })

        }

        //问题
        function initQuestion(){
            var template = '<div class="question_item" data-index="{{index}}"  data-question="{{id}}"><p class="title_q">{{index}}、{{questionName}}{{selectMore}}</p><p class="tips">{{questionDes}}</p><div class="answerBox" data-last="{{isend}}" ><dl data-answernum="{{optionsSelectableMaxnum}}">{{answerTPL}}</dl></div></div>',
                htmlA = [],
                htmlB = [];
            $.each(QuestionData,function(i,item){
                var res =  item,
                    question = res.question,
                    option = res.optionsList,
                    answer = [];
                question.index = i+1;

                if(parseInt(question.optionsSelectableMaxnum) > 1){
                    question.selectMore = '(可多选)'
                }
                if(option) {
                    $.each(option, function (Oindex, itemA) {


                        var  answerTPL = '<dd data-id="{{id}}" data-value="{{optionName}}"><span class="choice" ><i></i>{{optionName}}</span></dd>';
                        answer.push((bainx.tpl(answerTPL, itemA)));
                    });
                    question.answerTPL = answer.join('');
                }
                if(res.questionType == 1){
                    htmlA.push(bainx.tpl(template, question));
                }
                if(res.questionType == 2){
                    htmlB.push(bainx.tpl(template, question));
                }

            })
            htmlA = htmlA.join('');
            htmlB = htmlB.join('');

            htmlB = htmlB + '<div class="question_item"> <p class="title_q">7、平时的保养项目：</p><table class="table"><tr><th></th><th>日</th><th>夜</th><th>品牌</th></tr><tr><td>卸妆</td><td class="td"><span></span></td><td  class="td"><span></span></td><td  class="td"><input type="text" /></td></tr><tr><td>洁面</td><td  class="td"><span></span></td><td  class="td"><span></span></td><td  class="td"><input type="text" /></td></tr><tr><td>化妆水</td><td  class="td"><span></span></td><td  class="td"><span></span></td><td  class="td"><input type="text" /></td></tr><tr><td>精华原液</td><td  class="td"><span></span></td><td  class="td"><span></span></td><td  class="td"><input type="text" /></td></tr><tr><td>乳液</td><td  class="td"><span></span></td><td  class="td"><span></span></td><td  class="td"><input type="text" /></td></tr><tr><td>霜</td><td  class="td"><span></span></td><td  class="td"><span></span></td><td  class="td"><input type="text" /></td></tr><tr><td>按摩霜面膜</td><td  class="td"><span></span></td><td  class="td"><span></span></td><td  class="td"><input type="text" /></td></tr><tr><td>院护</td><td  class="td"><span></span></td><td  class="td"><span></span></td><td  class="td"><input type="text" /></td></tr><tr><td>防护</td><td  class="td"><span></span></td><td  class="td"><span></span></td><td  class="td"><input type="text" /></td></tr><tr><td>功效型产品</td><td  class="td"><span></span></td><td  class="td"><span></span></td><td  class="td"><input type="text" /></td></tr></table></div>'

            return {
                htmlA:htmlA,
                htmlB:htmlB
            };
        }

        function bindEvents(){
            $('body').on('click','.choice',function(){
                if(canEdit){
                    var target = $(this).parents('dd'),
                        answerNum = parseInt($(this).parents('dl').data('answernum'));
                    if(answerNum > 1){
                        chooseRC(target,false,answerNum)
                    }else{
                        chooseRC(target,true)
                    }
                    if($(this).hasClass('basicChoice')){
                        $(this).addClass('active').siblings().removeClass('active');
                    }
                }

            }).on('click', 'input', function (event) {

                if (event && event.preventDefault) {
                    window.event.returnValue = true;
                }
            }).on('change', '.file', function (event) {
                $('.waitting').show();
                Common.uploadImages(event,'#my_form', URL.upYunUploadPics).done(function(res) {
                    $('.waitting').hide();
                    var addPic = $('.addPic').parent('dd');
                    var picUrls = res.result.picUrls,
                        imgListUrl = [];
                    picUrls = picUrls.split(';');
                    $.each(picUrls,function(index,item){
                        imgListUrl.push('<dd class="active"><img src="'+ item+'"  alt=""><i class="deleteImg"></i></dd>');
                    })
                    imgListUrl = imgListUrl.join('');
                    addPic.before(imgListUrl);
                }).fail(function() {
                    bainx.broadcast('上传图片失败！');
                });
            }).on('click','.deleteImg',function(){
                var tarP =  $(this).parent(),
                    data = {
                    filePath:tarP.children('img').attr('src')
                }
               // Data.upyunDeleteFile(data).done(function(res){
                    bainx.broadcast('删除成功！');
                    tarP.remove();
               // })

            }).on('click','.table td span',function(){
                    if(canEdit){
                        $(this).toggleClass('activeSpan');
                    }
                })
                .on('click','.draftBtn',function(){
                    submitQuestion(true);
                })
                .on('click','.submitBtn',function(){
                    submitQuestion(false);
                })
        }

        //重新开始
        function restart(){
            _status = 0;
            $('input').each(function(){
                $(this).val('');
            })
            $('.active').each(function(){
                $(this).removeClass('active');
            })
            $('.activeSpan').each(function(){
                $(this).removeClass('activeSpan');
            })
            $('textarea').each(function(){
                $(this).val('');
            })
        }

        //判断是否是多选
        function chooseRC(target,canMultiple,chooseNum){
            canMultiple == true ? chooseAnswerRadio(target) : chooseAnswerCheckbox(target,chooseNum);
        }

        //单选
        function chooseAnswerRadio(target){
            var
                _view =target.parents('.answerBox'),
                siblingsDD = _view.find('dd');
            siblingsDD.removeClass('active');
            target.addClass('active');
            if(_view.find('.active').length > 0){
                _flag = true;
            }

        }

        //多选
        function chooseAnswerCheckbox(target,chooseNum){
            var
                _view =target.parents('.answerBox'),
                _activeL = _view.find('.active').length;

            // console.log(_activeL);
            if(target.hasClass('active')){
                target.removeClass('active')
                if(_activeL==1){
                    _flag = false;
                }
            }else{
                if(_activeL < chooseNum) {
                    target.addClass('active')
                    _flag = true;
                }
                else
                {
                    bainx.broadcast('最多只能选择'+chooseNum+'个')
                }
            }
        }

        init();
    }

    return questionSurvey;



})
