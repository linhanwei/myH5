/**
 * 用户报告
 * Created by xiuxiu on 2016/5/11.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/data',
    'h5/js/common/questionData'
], function($, URL, Common, Data,QuestionData) {
    var Page,
        uid = URL.param.uid,
        userName = URL.param.name ? URL.param.name : '用户',
        expert = URL.param.expert ? URL.param.expert: '',
        serviceId = URL.param.serviceId,
        type = URL.param.type,
        boxId1 = URL.param.boxId1 ? URL.param.boxId1 : '' ,
        list = URL.param.list,
        rid,
        detectId = URL.param.detectId,
        fileTpl = '<dd><div class="addPic"><form id="my_form" enctype="multipart/form-data"><img src="'+imgPath + 'common/images/personalTailor/pic_add.png"/><input type="hidden" name="type" value="6"/> <input type="file" class="file" name="file"  multiple="multiple"/></form></div>  </dd>';//上传图片
    //图片
    if(list){
        list = list.split(';');
    }
    uid = manageId(uid);//用户id
    serviceId = manageId(serviceId);//专家id
    //删除相同值
    Array.prototype.delSame = function() {
        var a = {}, c = [], l = this.length;
        for (var i = 0; i < l; i++) {
            var b = this[i];
            var d = (typeof b) + b;
            if (a[d] === undefined) {
                c.push(b);
                a[d] = 1;
            }
        }
        return c;
    }
    //处理id
    function manageId(id){
        if(id){
            var arrId = id.split("_");
            if(arrId.length > 1){
                id = parseInt(arrId[1]);
            }
        }else{
            id = -1;
        }
        return id;
    }

    function init(){
        render();
        bindEnevt();
    }

    function render(){
        if(type == 'create'){//生成报告
            fillReport();
        }else if(type == 'edit' || !type){//编辑查看报告
            report();
        }
    }

    //
    function intiHtml(messageTpl,skinConditionTpl,lifeStyleTpl,detailTpl,photoTpl,resultAndSuggestTpl,_recordId){
        var data = [{
                className:'message',
                title:'基本信息',
                content:messageTpl
            },{
                className:'skinCondition',
                title:'肌肤状态',
                content:skinConditionTpl
            },{
                className:'lifeStyle',
                title:'生活方式',
                content:lifeStyleTpl
            },{
                className:'detailQ',
                title:'细化问题',
                content:detailTpl
            },{
                className:'photo',
                title:'肌肤照片',
                content:photoTpl,
                tips:'请选择需要上传的图片，如果需要新增点击“+”上传'+userName+'的照片'
            },{
                className:'resultAndSuggest',
                title:'结果分析和产品建议',
                content:resultAndSuggestTpl
            }],
            tpl = '<li class="{{className}}"><h3>{{title}}</h3><dl class="grid">{{content}}</dl><p>{{tips}}</p></li>',
            html=[];
        $.each(data, function(index, item){
            if(item.tips){
                if(type=='edit'){
                    item.tips = '如果需要新增点击“+”上传'+userName+'的照片'
                }
                if(!type){
                    item.tips = '';
                }
            }
            html.push(bainx.tpl(tpl, item));
        });
        Page = $('<div class="resultPage" data-recordId="'+_recordId+'"><ul>'+html.join('')+'</ul><div class="bottom"><p>护肤专家：<span class="expert">'+expert+'</span><span class="time"></span></p></div><div class="save"><span>保存</span></div>').appendTo('body');
        //无值
        $('dd').each(function(){
            if($(this).text().length == 0){
                $(this).css('padding-bottom',0);
            }
        })
        if($('.detailQ dd').length == 0){
            $('.detailQ').hide();
        }
        //创建
        if(type=='create'){
            var nowDate = new Date(),
                nowTime  = nowDate.getFullYear() + '-' + parseInt(nowDate.getMonth()+ 1)  + '-' + nowDate.getDate() + ' ' + nowDate.getHours() + ':' + nowDate.getMinutes();
            $('.time').text(nowTime)

        }else if(!type){
            userName = $('.name').val()

            if($('.photo dd').length == 0){
                $('.photo').hide();
            }
            if($('.resultAndSuggest p').text().length == 0){
                $('.resultAndSuggest').hide();
            }
            if(!URL.param.detectId  && URL.param.box){      //没有报告id，并且是可以生成盒子
                $('.save').addClass('saveCreate').removeClass('save');
                var saveCreateBtn = $('.saveCreate span');
                switch (URL.param.box){
                    case '1':
                        saveCreateBtn.text('生成护肤盒子');
                        break;
                    case '2':
                        saveCreateBtn.text('下一步');
                        break;
                }
            }
            else{//查看盒子报告去掉保存
                $('.save').remove();
            }
        }
    }

    //查看大图
    function viewLargeImg(){
        var zWin = $(window),
            cid,
            wImage = $('#large_img'),
            domImage = wImage[0];
        var loadImg = function(id,target,callback){
            $('.photo').css({height:zWin.height(),'overflow':'hidden'})
            $('#large_container').css({
                width:zWin.width(),
                height:zWin.height()
            }).show();
            $('.resultPage').css({'z-index':'9','padding':'0'});
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
                wImage.css({'width':'auto','height':'auto','padding-left':'0','padding-top':'0px'});
                if(h/w>1.2){
                    wImage.attr('src',imgsrc).css({'height':winHeight,'padding-left':realw+'px'});
                }else{
                    wImage.attr('src',imgsrc).css({'width':winWidth,'padding-top':realh+'px'});
                }
                callback&&callback();
            }
        }
        var photoImg =  $('.photo img');

        photoImg.tap(function(){
            var _id = cid = parseInt($(this).attr('data-index'));
            loadImg(_id,$(this));
        });
        var lock = false,
            thumbLen = photoImg.length;
        $('body').on('tap','#large_container',function(){
            $('.photo').css({height:'auto','overflow':'auto'})
            $('#large_container').hide();
            $('.resultPage').css({'z-index':'0'});
            wImage.attr('src','');
        }).on('swipeLeft','#large_container',function(){
            if(lock && thumbLen == 1){
                return;
            }
            cid++;
            lock =true;
            var tar = $('.photo img[data-index="'+cid+'"]'),
                lastThumb = $('.photo dd:last-child img').data('index');
            if(cid < lastThumb + 1) {
                loadImg(cid, tar, function () {
                    domImage.addEventListener('webkitAnimationEnd', function () {
                        wImage.removeClass('animated bounceInRight');
                        domImage.removeEventListener('webkitAnimationEnd');
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
            var tar = $('.photo img[data-index="'+cid+'"]');
            if(cid>0 ){
                loadImg(cid,tar,function(){
                    domImage.addEventListener('webkitAnimationEnd',function(){
                        wImage.removeClass('animated bounceInLeft');
                        domImage.removeEventListener('webkitAnimationEnd');
                        lock = false;
                    },false);
                    wImage.addClass('animated bounceInLeft');
                });
            }else{
                cid = 1;
            }
        })
    }

    //填写报告
    function fillReport(){
        var imgList = '';
        if(list){
            var urlP = 'https://a1.easemob.com/mikusdp/mikuandroid/chatfiles/',
                tplHtml = [];
            $.each(list,function(index,item){
                tplHtml.push('<dd><img src="'+urlP + item+'" /></dd>');
            })
            imgList = tplHtml.join('');
        }
        var photoTpl = imgList+fileTpl;
        var resultAndSuggestTpl = '<dd><textarea></textarea></dd>';
        questionReport(photoTpl,resultAndSuggestTpl);
    }

    //问卷信息
    function questionMessage(dataAnswer,detailAnswer,detailQuestion){
        var html=[],
            detail=[],
            _skinTpl,
            _lifeTpl,
            _detailTpl;
        var valueAge = QuestionData[0].optionsList[dataAnswer.ageRegion-1].optionValue,
            valueSex = QuestionData[1].optionsList[dataAnswer.sex-1].optionValue,
            valueSkinColor = QuestionData[2].optionsList[dataAnswer.skinColor-1].optionName,
            valueSkinType = QuestionData[3].optionsList[dataAnswer.skinType-1].optionValue,
            valueBaskDegree = QuestionData[4].optionsList[dataAnswer.baskDegree-1].optionValue,
            valueSkinSensitive = QuestionData[5].optionsList[dataAnswer.skinSensitive-1].optionValue,
            valueSkinSensitiveFrequency = valueSkinSensitive == '没有' ? '' : QuestionData[6].optionsList[dataAnswer.skinSensitiveFrequency-1].optionValue,
            valueSkinSensitiveDegree = valueSkinSensitive == '没有' ? '' : QuestionData[7].optionsList[dataAnswer.skinSensitiveDegree-1].optionName,
            valueSkinRedness = QuestionData[8].optionsList[dataAnswer.skinRedness-1].optionValue,
            valueSkinRednessDegree = valueSkinRedness == '没有' ?　'': QuestionData[9].optionsList[dataAnswer.skinRednessDegree-1].optionValue,
            valueSleepTime = QuestionData[10].optionsList[dataAnswer.sleepTime-1].optionName,
            valueStressDegree = QuestionData[11].optionsList[dataAnswer.stressDegree-1].optionName,
            valueLiveEnv = QuestionData[12].optionsList[dataAnswer.liveEnv-1].optionValue,
            valueEnvArea = QuestionData[13].optionsList[dataAnswer.envArea-1].optionValue,
        ////隐藏了季节之后的操作
        // seasonData = dataAnswer.season,
            dataQuestion1 = {
                '1':'主要肌肤问题<span>'+dataAnswer.scProblemIds+'</span>',
                '3':'自然肤色为<span><b style="background-color: '+valueSkinColor+'"></b></span>',
                '4':'肌肤类型为<span>'+valueSkinType+'</span>',
                '9':'<span>'+valueSkinRedness+'</span>出现肌肤泛红情况。',
                '10':typeof valueSkinRednessDegree  != '' ? '<span>'+valueSkinRednessDegree+'</span>出现肌肤泛红情况。' :''

            },
            dataQuestion2 = {
                '5':'日晒程度为<span>'+valueBaskDegree+'</span>',
                '6':'<span>'+valueSkinSensitive+'</span>出现肌肤敏感情况',
                '7': typeof valueSkinSensitiveFrequency != '' ? '<span>'+valueSkinSensitiveFrequency+'</span>出现肌肤敏感情况' : '',
                '8':typeof valueSkinSensitiveDegree  != '' ? '肌肤敏感问题为<span>'+valueSkinSensitiveDegree+'</span>':'',
                '11':'晚上一般睡<span>'+valueSleepTime+'</span>',
                '12':'压力水平为<span>'+valueStressDegree+'</span>',
                '13':'所处的环境为<span>'+valueLiveEnv+'</span>',
                '14':'所在城市是<span> '+dataAnswer.envCity+'('+valueEnvArea+')</span>',
                ////隐藏了季节之后的操作
                //'15':'所在区域的季节为<span>'+season[seasonData]+'</span>',

            }
        $.each(dataQuestion1, function(index, item){
            html.push('<dd data-id="'+index+'">'+item+'</dd>');
        });
        $.each(dataQuestion2, function(index, item){
            detail.push('<dd data-id="'+index+'">'+item+'</dd>');
        });
        _skinTpl = html.join('');
        _lifeTpl= detail.join('');
        if(detailAnswer){
            var experHtml = [];
            $.each(detailAnswer,function(index,item){
                experHtml.push('<dd data-id="'+index+'">'+detailQuestion[index]+'<span>'+item+'</span></dd>');
            })
            _detailTpl= experHtml.join('');
        }
        return{
            age:valueAge,
            sex:valueSex,
            _skinTpl:_skinTpl,
            _lifeTpl:_lifeTpl,
            _detailTpl:_detailTpl
        }
    }

    //问卷报告
    function questionReport(photoTpl,resultAndSuggestTpl){
        //问卷结果
        var data = {
            userId:uid
        }
        Data.selectQuestionsByUserId(data).done(function(res){
            var _skinTpl = fillInReport(res).skinTpl,
                _lifeTpl = fillInReport(res).lifeTpl,
                _detailTpl = fillInReport(res).detailTpl,
                age = fillInReport(res).age,
                sex = fillInReport(res).sex;

            var _sexHtm = sex == '女' ? '<dd>性别：<span data-sex="0" class="choice"><i></i>男</span><span data-sex="1" class="choice active"><i></i>女</span></dd>' : '<dd>性别：<span data-sex="0" class="choice active"><i></i>男</span><span data-sex="1" class="choice"><i></i>女</span></dd>';
            var  messageTpl = '<dd>用户名：<input type="text" class="name" value="'+userName+'"  size="15" /> </dd><dd>年龄：<input type="tel"  class="age"  size="15" value="'+age+'"/></dd>' + _sexHtm;

            intiHtml(messageTpl,_skinTpl,_lifeTpl,_detailTpl,photoTpl,resultAndSuggestTpl,res.record.id);

        })
    }

    //编辑
    function report(){
        var data = {};
        if(!detectId){
            data = {
                userId:uid
            };
            Data.getOneUserReports(data).done(function(res) {
                initReport(res);
            })
        }else{
            data = {
                ReportId:detectId
            };
            Data.selectDataByDetectId(data).done(function(res){
                initReport(res);
            })
        }
    }
    //填充数据
    function fillInReport(res){
        var question = res.questions,
            dataAnswer = res.record,
            detailAnswer=[],
            qids = [],
            detailQuestion = [];
        // answerValues = [];
        if(question){
            $.each(question,function(index,item){
                detailQuestion.push(item.questionShortName);
                qids.push(item.questionId);
            })
            detailQuestion = detailQuestion.delSame();
            qids = qids.delSame();

            $.each(qids,function(i,qid){
                var answerValue = [];
                $.each(question,function(index,item){
                    if(qid == item.questionId){
                        answerValue.push(item.optionValue);
                    }
                })
                detailAnswer.push(answerValue.join(''));
            })
            console.log(detailAnswer);
        }
        var questionMessageTpl = questionMessage(dataAnswer,detailAnswer,detailQuestion);
        return {
            skinTpl :  questionMessageTpl._skinTpl,
            lifeTpl : questionMessageTpl._lifeTpl,
            detailTpl : questionMessageTpl._detailTpl,
            age : questionMessageTpl.age,
            sex : questionMessageTpl.sex
        }
    }

    //用户查看报告信息
    function initReport(res){
        var messageTpl = '',
            photoTpl ='',
            resultAndSuggestTpl = '',
            item = res.data,      //report
            userinfo = res.data.userInfo, //用户信息
            userinfo = JSON.parse(userinfo);

        var _skinTpl = fillInReport(res).skinTpl,
            _lifeTpl = fillInReport(res).lifeTpl,
            _detailTpl = fillInReport(res).detailTpl,
            age = fillInReport(res).age,
            sex = fillInReport(res).sex;
        var messageHtm = '<dd><span>用户名：</span><input type="text" class="name" value="{{name}}"   size="15"/> </dd><dd><span>年龄：</span><input type="tel"  class="age" value="{{age}}" size="15"/></dd><dd><span>性别：</span>{{_sexHtml}}</dd>',
            _Htm1 = [],
            _sexHtml = [];
        if(!type){
            userinfo._sexHtml = '<span>'+userinfo.sex+'</span>';
        }else{
            var  _sexData = [{
                    value: 1,
                    text: '男'
                }, {
                    value: 2,
                    text: '女'
                }],
                _sexTpl = '<span data-sex="{{value}}" class="choice {{active}}"><i></i>{{text}}</span>';

            //用户信息
            $.each(_sexData, function (index, sexItem) {
                if(type == 'create'){
                    sexItem.active = sex == sexItem.value ? 'active' : '';
                }
                else{
                    console.log();
                    sexItem.active = userinfo.sex == sexItem.text ? 'active' : '';
                }
                _sexHtml.push(bainx.tpl(_sexTpl, sexItem));
            })
            userinfo._sexHtml = _sexHtml.join('');
        }

        _Htm1.push(bainx.tpl(messageHtm, userinfo));
        messageTpl = _Htm1.join('');
        _Htm1 = [];

        //图片列表
        if (item.picUrls) {
            var pic = item.picUrls.split(';');
            $.each(pic, function (index, picItem) {
                //picItem.url = pic[index];
                var pltpl = type == 'edit' ? '<dd class="active"><img src="' + picItem + '!small" data-index="' + index + '" /><span class="delete"></span>  </dd>' : '<dd><img src="' + picItem + '!small" data-index="' + (index + 1) + '" /></dd>'
                _Htm1.push(pltpl);
            })
        }
        photoTpl = type == 'edit' ? _Htm1.join('') + fileTpl : _Htm1.join('');
        //建议
        resultAndSuggestTpl = type == 'edit' ? '<textarea>'+item.suggestionInfo+'</textarea>' : '<p>'+item.suggestionInfo+'</p>';

        intiHtml(messageTpl,_skinTpl,_lifeTpl,_detailTpl,photoTpl,resultAndSuggestTpl,res.record.id);

        if(res.expert){
            $('.expert').text(res.expert.csadName).attr('data-id',res.expert.userId);
        }
        $('.time').text(bainx.formatDate('Y-m-d h:i', new Date(res.data.lastUpdated)));

        $('.resultPage').attr('data-rid',item.id);

        if(type == 'edit'){
            $('.save span').text('保存');
        }

        if(!type){

            $('input').attr('readonly','readonly').addClass('readonly');
            $('.save').hide();
            //$('.saveCreate').hide();
            $('body').append('<div class="large animated fadeInDown" id="large_container" style="display:none"><img id="large_img"> </div>');
            viewLargeImg();
        }
    }
    //
    function bindEnevt(){
        $('body').on('tap', '.choice', function (event) {
            $(this).addClass('active').siblings().removeClass('active');
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
                    imgListUrl.push('<dd class="active"><img src="'+ item+'"  alt=""><span class="delete"></span></dd>');
                })
                imgListUrl = imgListUrl.join('');
                addPic.before(imgListUrl);
            }).fail(function() {
                bainx.broadcast('上传图片失败！');
            });
        }).on('tap','.photo dd img',function(event){
            event.preventDefault();
            var target = $(this);
            $('.photo dd img').removeClass('upload')
            target.addClass('upload');
            //target.addClass('upload').siblings().removeClass('upload');
            if(target.attr('src').indexOf('mikumine') <= -1){
                var data = {
                    url:target.attr('src'),
                    type:6
                }
                Data.upYunUploadPicByUrl(data).done(function(res){
                    bainx.broadcast('上传成功！');
                    $('.upload').attr('src',res.picUrl).parent('dd').addClass('active');
                })
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
            })
        }).on('tap','.save',function(event) {
            event.preventDefault();
            saveReport();
        }).on('tap','.saveCreate',function(){
            URL.assign(URL.createMineBoxPage+'?uid='+uid+'&page=2&rid='+$('.resultPage').data('rid')+'&name='+userName+'&boxId1='+boxId1);
        })
    }

    function saveReport(){
        var imgUrlArr = [];
        $('.photo dd').each(function(){
            if($(this).hasClass('active')){
                var imgUrlItem = $(this).children('img').attr('src'),
                    imgsrc;
                if(imgUrlItem.indexOf('!') > -1){
                    imgsrc = imgUrlItem.substring(0, imgUrlItem.indexOf('!'))
                }else{
                    imgsrc = imgUrlItem;
                }
                imgUrlArr.push(imgsrc);
            }
        })
        imgUrlArr = imgUrlArr.join(';');
        var user_name = $('.name').val(),
            user_age = $('.age').val(),
            user_sex = $('.message .active').text(),
            recordId = $('.resultPage').data('recordid'),
            suggest = $('.resultAndSuggest textarea').val(),
            userInfo ={
                'name':user_name,
                'age':user_age,
                'sex':user_sex
            };
        userInfo =  JSON.stringify(userInfo);
        var  data;
        if(type == 'edit'){
            data = {
                userId:uid,
                userInfo:userInfo,
                serviceId:$('.expert').data('id'),
                picUrls:imgUrlArr,
                suggestionInfo:suggest,
                rid:$('.resultPage').data('rid'),
                recordId:recordId,
                flag:1
            }
        }else{
            data = {
                userId:uid,
                recordId:recordId,
                userInfo:userInfo,
                serviceId:serviceId,
                picUrls:imgUrlArr,
                suggestionInfo:suggest
            }
        }
        Data.insertOneReportByUserId(data).done(function(res){
            rid = res.data.id;
            $('.resultPage').attr('data-rid',res.data.id);
            bainx.broadcast('保存成功！');
            if(type == 'edit'){
                URL.assign(URL.userReportPage+'?detectId='+detectId);
            }else{
                URL.assign(URL.userReportPage+'?uid='+uid+'&box=1&rid='+rid+'&name='+userName);
            }
        })
    }
    init();
})
