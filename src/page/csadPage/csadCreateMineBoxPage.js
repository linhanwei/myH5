/**
 * 生成盒子
 * Created by xiuxiu on 2016/5/21.
 */
define('h5/js/page/csadCreateMineBoxPage',[
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/data',
    'h5/js/common/nexter',
    'h5/js/common/transDialog',
    'h5/js/page/csadQuestionnaireSurveyPage',
    'h5/css/page/questionnaireSurveyPage.css'
], function($, URL, Common, Data,Nexter,Dialog,csadQuestionnaireSurveyPage) {

    var userBox = function(rid,boxId,csadName,csadTel,canEdit) {

        var Page,
        // rid = URL.param.rid,//报告id
            _CanEdit = canEdit ? true : false,//报告id
            dialog,//步骤弹窗
            userLessonListdialog,//选择课时弹窗
            chooseProductDialog,//产品弹窗
            chooseBoxProductDialog,//产品弹窗
            coursePreviewDialog,//课程预览
            addDialog,//添加
            containerBox = 'CreateBoxContainer',
        //boxId=URL.param.boxId,//盒子id
        //csadName=URL.param.csadName,
        // csadTel=URL.param.csadTel,
            isCourseTpl = false,//是否是模板的
            isSave = false,//是否保存
            addBoxProduct = '<li class="addBoxProduct"><input type="text" name="productName" placeholder="请输入产品名" /><img src="' + imgPath + 'common/images/personalTailor/pic_add.png" title="添加产品"/></li>',
            addPicture = '<div class="addPic col"><form id="my_form1" enctype="multipart/form-data"><img src="' + imgPath + 'common/images/personalTailor/pic_add.png"/><input type="hidden" name="type" value="1"/> <input type="file" class="file" name="file"  multiple="multiple"/></form></div>';
        // isCreateLesson = true;//是否创建课时

        //判断数组是否包含某元素
        Array.prototype.contains = function (obj) {
            var i = this.length;
            while (i--) {
                if (this[i] == obj) {
                    return true;
                }
            }
            return false;
        }

        //求两个数组的差集
        function chaji_array(arr1, arr2) {
            var arr3 = [];
            for (var i = 0; i < arr1.length; i++) {
                var flag = true;
                for (var j = 0; j < arr2.length; j++) {
                    if (arr2[j] == arr1[i]) {
                        flag = false;
                    }
                }
                if (flag) {
                    arr3.push(arr1[i]);
                }
            }
            return arr3;
        }

        //去掉数组重复值
        function uniqueArr(arr) {
            var result = [], hash = {};
            for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        }

        //初始化
        function init() {
            Page = $('<div class="'+containerBox+'"></div>').appendTo('body');
            coursePreview(false)

            if (_CanEdit) {
                $('.'+containerBox).append('<div class="boxTool footer grid"><div class="row"><span class="previewBtn col">预览</span><span class="saveBoxBtn col">保存</span><span class="sendBox col">发送</span></div></div> ');

            }

            bindEvent();
        }

        //布局
        function layout(obj) {
            var layout = [
                    {
                        title: '盒子基本信息',
                        className: 'boxMessage',
                        content: getUserMessage()
                    },
                    {
                        title: '分析报告',
                        className: 'report',
                        content: '<p class="viewReport">分析报告链接 >> </p>'
                    },
                    {
                        title: '选择产品',
                        className: 'productMessage',
                        content: '<ul>' + addBoxProduct + '</ul>'
                    },
                    {
                        title: '选择课程模版',
                        className: 'courseMessage',
                        content: '<p class="chooseCourseTpl">点击选择课程模版</p><div class="courseGather"></div>'
                    }
                ],
                layoutTpl = '<div class="boxItem {{className}} "><div class="title">{{title}}</div><div class="contentItem grid">{{content}}</div></div>',
                layoutHtml = [];

            $.each(layout, function (index, item) {
                layoutHtml.push(bainx.tpl(layoutTpl, item));
            })
            $(obj).append(layoutHtml.join(''));

            $(obj).append('<div class="boxOtherMsg"></div>');

            if (!_CanEdit) {


                $('input').attr('readonly', 'readonly').addClass('readonly');
                $('.chooseCourseTpl,.box_img .addPic,.addBoxProduct').hide();
                $(' .makeType').find('.choice').addClass('disabled')//.css('opacity', 0);
               // $(' .makeType').find('.active').css('opacity', 1);
                //$('.addBoxProduct').hide();
            }
        }

        //设置input宽大小
        function setInputSize() {
            var obj = $('input'),
                size = obj.val().length > 4 ? obj.val().length : 4;
            obj.attr('size', size);
        }

        //课程预览 && 不可编辑
        function coursePreview(isPreview) {

            if (isPreview) {
                //获取盒子信息
                if (!coursePreviewDialog) {
                    coursePreviewDialog = new Dialog($.extend({}, Dialog.templates.bottom, {
                        template: '<div class="coursePreview" id="coursePreview"><div class="coursePreviewContent"></div> </div>',
                    }))
                }
                coursePreviewDialog.show();
                var makeTypeB = $('.makeType').find('.active').data('id');
               // layout('.coursePreviewContent');

                var bodyObj = $('.coursePreview'),
                    copyObj = $('.'+containerBox);
                console.log(copyObj,copyObj.html());

                bodyObj.children('.coursePreviewContent').html(copyObj.html()+'<i class="closeBtn closeCoursePreview"></i>');

                //.addClass('active').siblings().removeClass('active');
                //
                //bodyObj.find('.productMessage').find('ul').html(copyObj.find('.productMessage').find('ul').html());
               // bodyObj.find('.courseMessage').find('.courseGather').html(copyObj.find('.courseMessage').find('.courseGather').html());
                //bodyObj.find('.boxOtherMsg').html(copyObj.find('.boxOtherMsg').html());

                // bodyObj.find('.courseGather').find('.input').attr('readonly','readonly').addClass('readonly');
                //bodyObj.find('.deleteIcon').hide();
                //bodyObj.find('.lessonChoose').addClass('disabled');
                //bodyObj.find('.chooseCourseTpl').hide();
                //bodyObj.find('.deleteProduct').hide();
                bodyObj.find('.deleteIcon,.chooseCourseTpl,.deleteProduct,.addSLBtn,.addSectionBtn,.addBoxProduct,.boxTool').hide();
               // bodyObj.find('').hide();

                var boxName = copyObj.find('input[name=box_name]').val(),
                    boxIntroduce = copyObj.find('input[name=box_introduce]').val(),
                    boxNote = copyObj.find('input[name=box_note]').val();
                    //boxImg = $('.'+containerBox+' .box_img .active img').attr('src');
                bodyObj.find('input[name=box_name]').val(boxName);
                bodyObj.find(' input[name=box_introduce]').val(boxIntroduce);
                bodyObj.find(' input[name=box_note]').val(boxNote);
               // boxImg ? bodyObj.find(' .box_img').prepend('<dd><img src="' + boxImg + '"/></dd>') : '';
                //$('.chooseCourseTpl').addClass('hide');
                bodyObj.find('input').attr('readonly', 'readonly').addClass('readonly');
                //$('.box_img .addPic').hide();
                bodyObj.find(' .makeType').find('.choice').addClass('disabled')//.css('opacity', 0);
                //$(' .makeType').find('.active').css('opacity', 1);
                //$('.addBoxProduct').hide();

            }
            else {

                layout('.'+containerBox);

                $('.courseMessage').addClass('hide');

                var data = {
                    boxId: boxId
                }
                Data.getMineBoxInfo(data).done(function (res) {
                    var vo = res.vo;
                    var BodyObj = $('.'+containerBox),
                        isEdit = true;
                    if (isPreview) {
                        BodyObj = $('.coursePreview');
                        isEdit = false;
                    }
                    BodyObj.find('input[name=box_name]').val(vo.boxName);
                    BodyObj.find(' input[name=box_introduce]').val(vo.boxIntroduce);
                    BodyObj.find(' input[name=box_note]').val(vo.boxNote);
                    BodyObj.find(' .box_img').prepend(vo.picUrls ? '<dd class="active"><img src="' + vo.picUrls + '"/><span class="deleteImg"></span></dd>' : '');

                    if(vo.picUrls){
                        $('.addPic').hide();
                    }

                    if(!_CanEdit){
                        $('.deleteImg').hide()
                    }
                    getBoxDetailView(res.vo, isEdit)
                })
            }

           // setInputSize();
        }

        //查询盒子之后
        function getBoxDetailView(vo, isEdit) {


            if (vo.price) {
                getBoxProductDialog(vo, true)
            }
            var tpl = '<p>盒子生成时间：{{dateCreated}}</p><p>私人管家：' + csadName + '</p><p>联系方式：' + csadTel + '</p><p >盒子价格：<span class="boxPrice price">{{price}}</span></p>',
                html = [];
            vo.dateCreated = bainx.formatDate('Y-m-d h:i', new Date(vo.dateCreated));
            vo.price = (isNaN(vo.price) ? 0 : (vo.price / 100)).toFixed(2);
            html.push(bainx.tpl(tpl, vo));

            $('.boxOtherMsg').append(html.join(''));

        }

        //盒子基本信息
        function getUserMessage() {

            var basicMessage = '<div class="row"> <label class="">{{label}}:</label>{{content}}</div>',
                basicMessageHtml = [],
                basic = [
                    {
                        label: '定制类型',
                        name: 'mine_type',
                        type: 'radio'
                    },
                    {
                        label: '盒子名',
                        name: 'box_name'
                    },
                    {
                        label: '盒子介绍',
                        name: 'box_introduce'
                    },
                    {
                        label: '盒子注意事项',
                        name: 'box_note'
                    },
                    {
                        label: '盒子封面图',
                        name: 'box_pic_urls',
                        type: 'file'
                    }
                ];

            $.each(basic, function (i, basicItem) {
                if (basicItem.type) {
                    if (basicItem.type == 'radio') {
                        basicItem.content = '<div class="makeType"><div class="displayB"><b class="choice active chooseItem" data-id="1">护肤定制类</b><b class="choice chooseItem" data-id="2">私密护理类</b><b class="choice chooseItem" data-id="3">减肥定制类</b><b class="choice chooseItem" data-id="4">脱发定制类</b></div> </div>';
                    }
                    if (basicItem.type == 'file') {
                        basicItem.content = '<dl class="box_img"><dd><div class="addPic col"><form id="my_form1" enctype="multipart/form-data"><img src="' + imgPath + 'common/images/personalTailor/pic_add.png"/><input type="hidden" name="type" value="1"/> <input type="file" class="file" name="file"  multiple="multiple"/></form></div></dd></dl>';
                    }
                }
                else {
                    basicItem.content = '<input type="text" class="col"  name="' + basicItem.name + '"/>'
                }
                basicMessageHtml.push(bainx.tpl(basicMessage, basicItem));
            })

            return basicMessageHtml.join('');
        }

        //获取课时列表
        function getlessonItems(items) {
            var tpl = lesson_TPL(),
                html = [],
                htmlTml = '';

            $.each(items, function (index, item) {
                item.stepHtm = '';
                if (item.lessonStepVOList) {
                    var step = [],
                        stepTpl = step_TPL(),
                        stepTypeTxt = ['', '普通', '特效'];
                    var boxProductObj = $('.productMessage').find('.boxProductActive'),
                        boxProductList = [];
                    boxProductObj.each(function () {
                        boxProductList.push($(this).data('id'));//定制的产品id
                    })
                    //containSPList = uniqueArr(containSPList);//步骤的产品id
                    $.each(item.lessonStepVOList, function (j, voListItem) {
                        voListItem.hide = 'hide';
                        if (!boxProductList.contains(voListItem.prodId)) {      //步骤不包含产品，提示
                            voListItem.disabled = 'disabled';
                            voListItem.hide = '';
                            voListItem.show = 'hide';
                        }
                        //voListItem.stepTypeW = stepTypeTxt[voListItem.stepType];
                        voListItem.active1 = voListItem.stepType == 1 ? 'active' : '';
                        voListItem.active2 = voListItem.stepType == 2 ? 'active' : '';
                        voListItem.id = !isCourseTpl ? voListItem.id : '';
                        step.push(bainx.tpl(stepTpl, voListItem));
                    })
                    item.stepHtm = '<div class="stepListL"><p class="borderl">步骤：</p><dl class="less_step grid">' + step.join('') + '<div class="addBtn addStepBtn">添加步骤</div></dl></div> ';
                    item.id = !isCourseTpl ? item.id : '';
                    html.push(bainx.tpl(tpl, item))
                }
            })
            htmlTml = html.join('');
            if (html.length == 0) {
                htmlTml = '<li class="notData"><img src="' + imgPath + '/common/images/loading_fail.png"/><p>灰常抱歉，没有有效课时哦</p><span class="btn noDataBtn">返回</span></li>'
            }
            return htmlTml;
        }

        //弹窗 课时汇总
        function lessonGather() {
            //$('.userLessonList').remove();
            var data = {
                courseId: $('.courseGather').data('id')
            }
            Data.getLessonVOList(data).done(function (res) {
                if (res.has == 1) {
                    $('body').append('<section class="telDialog wl-trans-dialog translate-viewport userLessonList" data-widget-cid="widget-0" style="display: none;" id="userLessonList"><div class="chooseDialog"><!--<i class="closeBtn closeLessonChoose"></i>--><ul class="grid">' + getlessonItems(res.list) + '</ul><div class="addBtn addLessonBtn">添加课时</div> </div></section>');

                    $('#userLessonList li').each(function(){
                        //var canUpDate = false;
                        //if($(this).find('.disabled').length == 0){
                           // canUpDate = true;
                            saveAllLesson($(this),false);
                       // }
                    })


                }

            })


        }

        //获取课程模版列表
        function courseTamplateList() {

            if ($('.courseTamplateList').length == 0) {
                $('body').append('<section class="telDialog wl-trans-dialog translate-viewport courseTamplateList" data-widget-cid="widget-0" style="display: block;"><div id="courseBox"><h3>选择课程模版</h3><ul class="grid"></ul><span class="selectedCourseTplBtn">确定</span><i class="closeBtn closeCourseTamplate"></i></div></section>');

                var element = $('#courseBox'),
                    nexter = new Nexter({
                        element: element,
                        dataSource: Data.getOpenCourseVOList,
                        data: {
                            courseTemplate: 1
                        },
                        enableScrollLoad: true,
                    }).load().on('load:success', function (res) {

                        if (res.list.length > 0) {
                            var html = [],
                                template = '<li data-id="{{id}}"><i></i><img src="{{picUrls}}" /></li>';
                            $.each(res.list, function (index, item) {


                                if (!item.picUrls) {
                                    item.picUrls = imgPath + 'common/images/img_icon.png'
                                } else {
                                    var pic = item.picUrls.split(',');
                                    item.picUrls = pic[0];
                                }

                                html.push(bainx.tpl(template, item));

                            });

                            $('#courseBox ul').append(html.join(''));
                            $('#courseBox ul li').first().addClass('hasChoiceCourse');
                        }
                        else {
                            $('#courseBox ul ').append('暂时没有模版课程！');
                        }
                    })
            }
            else {
                $('.courseTamplateList').show();
            }
        }

        //获取模版课程的详细信息
        function getCourseTamplateItem(courseId) {

            var data = {
                courseId: courseId
            }
            Data.getCourseToStepDetail(data).done(function (res) {
                courseGather(res, true);
            })
        }

        //课程汇总
        function courseGather(res) {

            var items = res.courseSectionVOList,
                lessonItems = res.lessonVOList;
            // $('.courseGather ul').find('li').remove();
           // if (_CanEdit && !$('.courseGather').data('id')) {
                $('.courseGather').attr('data-id', res.courseDO.id);
          //  }

            //删除课时
            if($('#userLessonList').length > 0){
                var lessonObj =  $('#userLessonList li'),
                    lessonNum = lessonObj.length;
                lessonObj.each(function(i){

                    var lessonTarget = $(this),
                        delId = lessonTarget.data('id'),
                        data = {
                        id: delId
                        }
                    Data.deleteLesson(data).done(function (res) {
                      //  var stepD = lessonTarget.find('.stepDetail'),
                        //    stepNum = stepD.length;
                       // stepD.each(function(j){
                           // var delStepId = $(this).data('id'),
                          //  data = {
                           //     id: delStepId
                           // }
                           // Data.deleteLessonStep(data).done(function (res) {
                                if(i == lessonNum -1){
                                    $('#userLessonList').remove();
                                    lessonGather();
                                }
                          //  })
                        //})
                    })
                })
            }else{
                lessonGather();
            }

            if (res.courseSectionVOList.length > 0) {
                var addSectionHtm = _CanEdit ? '<div class="addBtn addSectionBtn">添加阶段</div>' : '',
                    addSLHtm = _CanEdit ? '<div class="addBtn addSLBtn">添加阶段关联</div>' : '';

                var courseGatherTpl = s_TPL(addSLHtm),
                    html = [],
                    hasNotFinish = false,
                    htm = '';
                //if(items[0].sectionLessonVOList){
                $.each(items, function (i, item) {
                    if (item.sectionLessonVOList) {
                        var voListTpl = sl_TPL(),
                            voListHtml = [];
                        if (item.sectionLessonVOList) {
                            $.each(item.sectionLessonVOList, function (j, voSectionLessonItem) {
                                $.each(lessonItems, function (j, lessonItem) {
                                    if (voSectionLessonItem.lessonId == lessonItem.id) {
                                        createOrUpdateStepHtml(lessonItem);
                                        lessonItem.lessonId = !isCourseTpl ? lessonItem.id : '';
                                        lessonItem.slId = !isCourseTpl ? voSectionLessonItem.id : '';
                                        lessonItem.dayOrder = voSectionLessonItem.dayOrder;
                                        lessonItem.latestttimeInDay = voSectionLessonItem.latestttimeInDay;
                                        lessonItem.earliesttimeInDay = voSectionLessonItem.earliesttimeInDay;
                                        lessonItem.suggesttimeInDay = voSectionLessonItem.suggesttimeInDay;
                                        voListHtml.push(bainx.tpl(voListTpl, lessonItem));
                                    }
                                })
                            })
                        }
                        item.id = !isCourseTpl ? item.id : '';
                        item.sectionLessonVOListTpl = voListHtml.join('');
                        html.push(bainx.tpl(courseGatherTpl, item));
                    } else {
                        hasNotFinish = true;
                    }

                })
                htm = '<ul>' + html.join('') + addSectionHtm + '</ul>';

                /*自动添加课时*/
                //saveAllLesson(target);
                //$('#userLessonList li').each(function(){
                //    var _tar = $(this);
                //    //if(_tar.find())
                //})
                if (hasNotFinish) {
                    htm = '<ul><li>暂时还尚未完成设置哦！</li></ul>'
                }

                var courseTpl = '<div class="courseDetail"><p>课程名：<input class="courseName" value="{{courseName}}"/></p><p>课程简称：<input class="courseShortName" value="{{courseShortName}}" /></p><p>课程介绍：<input class="courseIntroduce" value="{{courseIntroduce}}" /></p><p>课程备注：<input class="courseNote" value="{{courseNote}}"/></p><div class="box_img">课程封面图：<div class="active"><img src="{{picUrls}}" /><span class="deleteImg"></span></div><div class="uploadCourseImg"></div></div>',
                    courseHtml = [];
                //var pic = res.courseDO.picUrls.split(',');
                //res.courseDO.picUrls = pic[0];
                courseHtml.push(bainx.tpl(courseTpl, res.courseDO));

                if (!_CanEdit) {
                    $(' .courseGather').html(courseHtml.join('') + htm);
                    $(' .courseGather input').attr('readonly', 'readonly').addClass('readonly');
                    $(' .deleteIcon').hide();
                    $(' .lessonChoose').addClass('disabled');
                    $(' .chooseCourseTpl').addClass('disabled');


                } else {

                    $('.'+containerBox+' .courseGather').html(courseHtml.join('') + htm);
                    $('.uploadCourseImg').append('<div class="addPic col" style="display: none"><form id="my_form" enctype="multipart/form-data"><img src="' + imgPath + 'common/images/personalTailor/pic_add.png"/><input type="hidden" name="type" value="1"/> <input type="file" class="file" name="file"  multiple="multiple"/></form></div>');
                    //$('.uploadCourseImg .addPic').hide();
                    //$('.uploadCourseImg .file').attr('name','file2')
                    $('.courseGather dd').each(function(){
                        if($(this).find('.disabled').length == 0){
                            $(this).addClass('currentSL');
                        }
                    })

                }
            }
        }

        //get定制产品
        function getBoxProductDialog(vo, inPage) {
            var data = {
                boxId: boxId
            }
            Data.getMineBoxProductVOList(data).done(function (res) {

                var tpl = '<li data-id="{{id}}" class="boxProductActive getBoxProductItem_{{id}}" data-price="{{prodRetailPrice}}" data-remain="{{prodNote}}" data-resid="{{multimediaResId}}" data-resremain="{{resUseRemind}}" data-resname="{{resName}}">{{operate}}<img src="{{prodPicUrls}}" /><p class="prodName">{{prodName}}</p><p class="{{hide}}">数量：<input type="tel" class="numProdItem" value="{{num}}" /> </p><p class="{{hide}}">价格：<span class="price priceProdItem">{{prodRetailPriceSum}}</span></p></li>',
                    html = [],
                    list = res.list;
                $.each(list, function (i, item) {

                    item.operate = inPage ? '<i class="deleteProduct hide"></i>' : '<i class="chooseProducti"></i>'
                    item.hide = inPage ? '' : 'hide';

                    item.prodRetailPrice = (isNaN(item.prodRetailPrice) ? 0 : (item.prodRetailPrice / 100)).toFixed(2);
                    item.prodRetailPriceSum = item.prodRetailPrice * item.num;
                    if (!item.prodPicUrls) {
                        item.prodPicUrls = imgPath + 'common/images/img_icon.png'
                    }
                    html.push(bainx.tpl(tpl, item));
                })

                if (inPage) {
                    if (!_CanEdit) {
                        $('.productMessage ul').html(html.join(''));
                        $('.deleteProduct').hide();
                        $('.numProdItem').attr('readonly', 'readonly').addClass('disabled');
                    } else {
                        $('.productMessage ul').html(html.join('') + addBoxProduct);
                    }
                    if ($('.boxProductActive').length > 0) {
                        $('.courseMessage').removeClass('hide');
                    }
                    //课程汇总

                    if (vo.courseId) {
                        $('.chooseCourseTpl').addClass('hide');
                        var data = {
                            boxId: boxId
                        }
                        Data.getBoxDetail(data).done(function (res) {
                            courseGather(res);
                        })
                    }
                }
                else {
                    if (!chooseBoxProductDialog) {
                        chooseBoxProductDialog = new Dialog($.extend({}, Dialog.templates.bottom, {
                            template: '<div class="grid" id="chooseBoxProduct"><ul>' + html.join('') + '</ul></div>'
                        }))
                        chooseBoxProductDialog.show();
                    }
                }
            })

        }

        //创建或更新盒子的定制产品
        function createBoxProduct(target) {
            var prodId = target.data('id'),
                num = target.find('.numProdItem').val() ? parseInt($.trim(target.find('.numProdItem').val())) : parseInt($.trim(target.find('.prod_num').val())),
                data = {
                    boxId: boxId,
                    prodId: prodId,
                    num: num
                }

            Data.createOrUpdateMineBoxProduct(data).done(function (res) {
                var tpl = '<li data-id="{{id}}" class=" boxProductActive getBoxProductItem_{{id}}" data-price="{{prodRetailPrice}}"><i class="deleteProduct hide"></i><img src="{{prodPicUrls}}" /><p>{{prodName}}</p><p>数量：<input type="tel" class="numProdItem" value="{{num}}" /></p><p>价格：<span class="price priceProdItem">{{prodRetailPriceSum}}</span></p></li>',
                    html = [],
                    boxProductVO = res.boxProductVO;
                if ($('.getBoxProductItem_' + boxProductVO.id).length == 0) {
                    if (!boxProductVO.prodPicUrls) {
                        boxProductVO.prodPicUrls = imgPath + 'common/images/img_icon.png'
                    }
                    boxProductVO.prodRetailPrice = (boxProductVO.prodRetailPrice / 100 ).toFixed(2);
                    boxProductVO.prodRetailPriceSum = (boxProductVO.prodRetailPrice * boxProductVO.num);
                    html.push(bainx.tpl(tpl, boxProductVO));
                    $('.addBoxProduct').before(html.join(''));
                } else {
                    $('.getBoxProductItem_' + boxProductVO.id).find('.numProdItem').val(num);
                }

                if ($('.boxProductActive').length > 0) {
                    $('.courseMessage').removeClass('hide');
                }

                $('.boxPrice').text((isNaN(res.boxPrice) ? 0 : (res.boxPrice / 100)).toFixed(2));

                var prodTips = $('.prod_' + prodId);
                prodTips.hide();
                prodTips.parent().removeClass('disabled');


            })
        }

        //删除定制产品
        function deleteBoxProduct(target) {

            if ($('.boxProductActive').length == 1) {
                bainx.broadcast('只剩一个产品了，不能删除哦');
                return
            }
            var prodId = target.data('id'),
                data = {
                    boxId: boxId,
                    prodId: prodId
                }
            Data.deleteBoxProduct(data).done(function (res) {
                $('.boxPrice').text((isNaN(res.boxPrice) ? 0 : (res.boxPrice / 100)).toFixed(2));
                deleteBoxProductAfter(target, prodId)
            })

        }

        //删除定制产品之后
        function deleteBoxProductAfter(target, prodId) {

            bainx.broadcast('删除成功！');
            target.remove();
            var prodTips = $('.prod_' + prodId);
            prodTips.show();
            prodTips.parent().addClass('disabled');
            prodTips.prev('.prodName').text('');
            prodTips.parents('.stepItem').find('.res_step').addClass('disabled');
            prodTips.parents('.stepItem').find('.resName').text('');

            //if($('.boxProductActive').length == 0){
            //$('.courseMessage').addClass('hide');
            //}
        }

        //get产品
        function getProductList() {
            $('#chooseProduct').remove();
            chooseProductDialog = '';
            $('input,textarea').blur();
            if (!chooseProductDialog) {

                chooseProductDialog = new Dialog($.extend({}, Dialog.templates.bottom, {
                    template: '<div class="grid" id="chooseProduct"><ul></ul></div>'
                }))
                chooseProductDialog.show();
                var element = $('#chooseProduct'),
                    prodName = $('input[name=productName]').val(),
                    nexter = new Nexter({
                        element: element,
                        dataSource: Data.getMineScProductVOList,
                        data: {
                            prodName: prodName
                        },
                        enableScrollLoad: true,
                    }).load().on('load:success', function (res) {

                        if (res.list.length > 0) {
                            var html = [],
                                template = '<div class="productItem col col-50" data-id="{{id}}" data-useremind="{{resUseRemind}}" data-multimediaresid="{{multimediaResId}}" data-resremain="{{resUseRemind}}" data-resname="{{resName}}" ><i></i><dt><span></span><img src="{{listimg}}" /></dt><dd><p class="ellipsis prod_name">{{prodName}}</p><p class="ellipsis">产品效果：{{prodResult}}</p><p class="ellipsis">产品用途：{{prodPurpose}}</p><p class="prod_Price">{{prodRetailPrice}}</p><p class="prodNum"></p></dd></div>',
                                _index = 0;
                            $.each(res.list, function (index, item) {
                                var img = item.prodPicUrls
                                item.listimg = img ? img : imgPath + 'common/images/img_icon.png';
                                item.prodRetailPrice = (isNaN(item.prodRetailPrice) ? 0 : (item.prodRetailPrice / 100)).toFixed(2)
                                if (index % 2 == 0) {
                                    html.push('<li class="row">');
                                }
                                html.push(bainx.tpl(template, item));
                                if (index % 2 == 1) {
                                    html.push('</li>');
                                }
                                _index = index;
                            });
                            if (_index % 2 == 0) {
                                html.push('<div class="col col-50 goods goods-null fb fvc fac"></div></li>');
                            }
                            $('#chooseProduct ul').append(html.join(''));


                            // if(isChooseBP){
                            var prodItem = $('#chooseProduct .productItem');
                            prodItem.addClass('addBoxProductP');
                            prodItem.find('.prodNum').html('数量：<input type="number" class="prod_num" value="1" placeholder="请输入数量" />');
                            //   }


                        }
                        else {
                            $('#chooseProduct ul').append('<li class="notData"><img src="' + imgPath + '/common/images/loading_fail.png"/><p>灰常抱歉，没有搜到产品哦</p><span class="btn noDataBtn">返回</span></li>');
                        }
                    })
            }
            chooseProductDialog.show();
        }

        //保存盒子
        function saveBox() {

            var isseted = true,
               // isstep = false,

                courseId;

            var boxProductObj = $('.productMessage').find('.boxProductActive'),
                stepProductObj = $('.courseGather').find('.product_step'),
                boxProductList = [];
            boxProductObj.each(function () {
                boxProductList.push($(this).data('id'));//定制的产品id
            })
            var containSPList = [];
            stepProductObj.each(function () {
                containSPList.push($(this).data('id'));
            })
            containSPList = uniqueArr(containSPList);//步骤的产品id

            $.each(boxProductList, function (i, item) {
                if (!containSPList.contains(item)) {      //步骤不包含产品，提示
                    isseted = false;
                    bainx.broadcast('您选择的产品步骤还没有哦~');
                    return false;
                }
            })

            var hasSectionLesson = true;//阶段是否关联
            $('.courseDetail li').each(function(){
                if($(this).find('dd').length == 0){
                    hasSectionLesson = false;
                    bainx.broadcast('阶段尚未完善哦~');
                   // return false;
                }
            })
            if (isseted && hasSectionLesson) {
                $('.makeType').find('.choice').addClass('disabled');
                var mineType = $('.makeType').find('.active').data('id'),
                    pic_urls = $('.boxMessage .box_img .active img').attr('src');
                var data = {
                    id: boxId,
                    mineType: mineType,
                    boxName: $('input[name=box_name]').val(),
                    boxIntroduce: $('input[name=box_introduce]').val(),
                    boxNote: $('input[name=box_note]').val(),
                    picUrls: pic_urls
                }
                Data.createOrUpdateBox(data).done(function (res) {

                    //保存课程
                    var
                        data = {
                            boxId: boxId,
                            id: !isCourseTpl ? $('.courseGather').data('id') : '',
                            courseProperty: 2,
                            courseType: 2,
                            courseName: $('.courseName').val(),
                            courseShortName: $('.courseShortName').val(),
                            courseIntroduce: $('.courseIntroduce').val(),
                            courseNote: $('.courseNote').val(),
                            picUrls: $('.courseDetail .box_img .active img').attr('src'),
                            mineType: mineType

                        }
                    Data.createOrUpdateCourse(data).done(function (res) {
                        var vo = res.vo;
                        courseId = vo.id;
                        $('.courseGather').attr('data-id', courseId)


                        //保存课时
                        //saveAllLesson();

                        // setTimeout(function(){
                        saveAllSection(courseId)
                        //    },2000);


                    })


                })

            }
            else {
                bainx.broadcast('尚未完善课程~');
            }
        }

        //保存课时
        function saveAllLesson(targ,isAppend) {
            //保存课时

            //var containLId = [];
            //$('.lessonChoose').each(function(){
            //    containLId.push($(this).data('id'));
            //
            //})
            //containLId = uniqueArr(containLId);

            // if(isCreateLesson){

            // if(isCourseTpl){
            // var lessonObj = $('.userLessonList li');
            //  lessonObj.each(function (index_lesItem) {
            //var targ = $(this);
            //  $.each(containLId,function(k,litem){
            //     if(litem == targ.data('id')){
            var lessonTarget = targ,
                lessonId = lessonTarget.data('id') ? lessonTarget.data('id') : '',
                name = lessonTarget.find('.lessonName').val(),
                shortname = lessonTarget.find('.lessonShortName').val(),
                introduce = lessonTarget.find('.lessonIntroduce').val(),
                property = lessonTarget.data('lessonproperty') ? lessonTarget.data('lessonproperty') : 2,
                note = lessonTarget.find('.lessonNote').val(),
                data = {
                    boxId: boxId,
                    id: lessonId,
                    lessonName: name,
                    lessonShortName: shortname,
                    lessonIntroduce: introduce,
                    lessonNote: note,
                    lessonProperty: property
                }
            Data.createOrUpdatelesson(data).done(function (res) {

                lessonTarget.attr({'data-id': res.vo.id});
                var targetStepAll = lessonTarget.find('.stepDetail');
                var voLesson = res.vo;

                // if(index_lesItem == lessonObj.length -1){
                //   var lessid = currentTar.data('id');
                //     $('.sectlesson_'+lessid).addClass('currentSL');
                //  }

                //if ($('.currentSL').length > 0){
                    $('.lessonChoose').each(function(){
                        if($(this).data('name') == voLesson.lessonName){
                            var targetL = $(this).parents('dd').find('.lessonG');
                            targetL.text(voLesson.lessonName).attr('data-id', voLesson.id);
                            $(this).parents('dd').attr('class', 'row sectlesson_' + voLesson.id + ' currentSL');
                        }
                    })
               // }
                //$('.$('.sectlesson_'+lessid) .lessonG').text(voLesson.lessonName).attr('data-id', voLesson.id);

                if ($('.currentSL').length > 0 && isAppend) {
                    $('.currentSL .lessonG').text(voLesson.lessonName).attr('data-id', voLesson.id);
                    $('.currentSL').attr('class', 'row sectlesson_' + voLesson.id + ' currentSL');
                }
                //  })
                else if ($('.currentSL').length == 0) {
                    $('.addContent .userLesson_id').text(voLesson.lessonName).attr('data-id', voLesson.id);
                }
                var voStepTpl = '<div class="stepItem" data-id="{{id}}" data-name="{{stepName}}" data-note="{{stepNote}}" data-shortname="{{stepShortName}}" data-introduce="{{stepIntroduce}}" data-interval="{{stepInterval}}" data-order="{{stepOrder}}" data-type="{{stepType}}" > <p class="stepDot " >步骤{{stepOrder}}:</p><div class="row"><div> 步骤名：</div><div class="col name_step">{{stepName}}</div> </div><div class="row userProductItem "><div> 使用：</div><div class="col product_step {{disabled}}" data-id="{{prodId}}" data-remain="{{prodUseRemind}}"><span class="{{show}} prodName">{{prodName}}</span><i class="tips {{hide}} prod_{{prodId}}">(您尚未选择这个产品，如果保存，产品将不存在)</i></div> </div><div class="row learnVideoItem "><div> 学习：</div><div class="col res_step {{disabled}}" data-resourceid="{{multimediaResourceId}}" data-resremain="{{resUseRemind}}"><span class="{{show}} resName"> {{resName}}</span></div></div></div>',
                    voStepTplHtml = [];

                    // var //stepList = $('.hasChoice').parents('li').find('.less_step').find('.stepDetail'),
                    // stepVOArr =[];

                    // lessonStep = res.vo;
                    if(isAppend) {
                        $('.currentSL .gather_stepList').html('');
                        $('.currentSL .count_step').html(targetStepAll.length);
                    }

                    //保存步骤
                    targetStepAll.each(function (iStep) {

                        var targetStep = $(this),
                            stepId = lessonTarget.data('id') ? targetStep.data('id') : '',
                            stepName = targetStep.find('.name').val(),
                            stepShortName = targetStep.find('.shortname').val(),
                            stepIntroduce = targetStep.find('.introduce').val(),
                            stepNote = targetStep.find('.note').val(),
                            stepOrder = targetStep.find('.order').val(),
                            stepType = targetStep.find('.type.active').data('id'),
                            stepInterval = targetStep.find('.interval').val(),
                            prodId = !targetStep.find('.product').hasClass('disabled') ? targetStep.find('.product').data('prodid') : '',
                            prodUseRemind = !targetStep.find('.product').hasClass('disabled') ? targetStep.find('.product').data('remain') : '',
                            multimediaResourceId = !targetStep.find('.product').hasClass('disabled') ? targetStep.find('.res').data('resid') : '',
                            multimediaUseRemind = !targetStep.find('.product').hasClass('disabled') ? targetStep.find('.res').data('resremain') : '',
                            dataStep = {
                                boxId: boxId,
                                lessonId: lessonTarget.data('id'),
                                id: stepId,
                                stepName: stepName,
                                stepShortName: stepShortName,
                                stepIntroduce: stepIntroduce,
                                stepNote: stepNote,
                                stepOrder: stepOrder,
                                stepType: stepType,
                                stepInterval: stepInterval,
                                prodId: prodId,
                                prodUseRemind: prodUseRemind,
                                multimediaResourceId: multimediaResourceId,
                                multimediaUseRemind: multimediaUseRemind
                            }
                        Data.createOrUpdateMineLessonStep(dataStep).done(function (res) {
                            var stepVo = res.vo;
                            targetStep.attr({'data-id': stepVo.id});
                            if(isAppend){
                                stepVo.prodName = targetStep.find('.product').children('.prodName').text();
                                stepVo.resName = targetStep.find('.res').children('.resName').text();
                                stepVo.disabled = !stepVo.prodId ? 'disabled' : '';
                                stepVo.hide = !stepVo.prodId ? '' : 'hide';
                                stepVo.show = !stepVo.prodId ? 'hide' : '';
                                voStepTplHtml.push(bainx.tpl(voStepTpl, stepVo));
                                $('.currentSL .gather_stepList').append(voStepTplHtml.join(''));
                                voStepTplHtml = [];
                            }
                        })

                    })

                //}
                ////  })
                //else {
                //    $('.addContent .userLesson_id').text(voLesson.lessonName).attr('data-id', voLesson.id);
                //}
                //   }
            })


            // })
            // }
            //  else{
            //    var lessid = currentTar.data('id');
            //     $('.sectlesson_'+lessid).addClass('currentSL');
            //  }


            //}

        }

        //保存阶段&& 阶段课时
        function saveAllSection(courseId) {
            //保存阶段

            var isSL = false,

                sectionObj = $('.courseGather li');
            sectionObj.each(function (indexSection) {
                var sectionTarget = $(this),
                    sectionId = sectionTarget.data('id') ? sectionTarget.data('id') : '',
                    sectionName = sectionTarget.find('.gather_sectionNames').val(),
                    sectionShortName = sectionTarget.find('.gather_sectionShortName').val(),
                    sectionIntroduce = sectionTarget.find('.gather_sectionIntroduce').val(),
                    sectionNote = sectionTarget.find('.gather_sectionNote').val(),
                    sectionOrder = sectionTarget.find('.dayorderC').val(),
                    sectionSd = sectionTarget.find('.gather_sectionSd').val(),
                    sectionEd = sectionTarget.find('.gather_sectionEd').val(),
                    sectionDuration = parseInt(sectionEd) - parseInt(sectionSd) + 1,
                    data = {
                        boxId: boxId,
                        courseId: courseId,
                        id: sectionId,
                        sectionName: sectionName,
                        sectionShortName: sectionShortName,
                        sectionDuration: sectionDuration,
                        sectionIntroduce: sectionIntroduce,
                        sectionNote: sectionNote,
                        sectionOrder: sectionOrder,
                        sectionSd: sectionSd,
                        sectionEd: sectionEd
                    }
                Data.createOrUpdateCourseSection(data).done(function (res) {

                    sectionTarget.attr('data-id', res.vo.id);

                    var targetSLAll = sectionTarget.find('dd');
                    targetSLAll.each(function (itm) {

                        var targetSL = $(this),
                            slId = targetSL.data('id') ? targetSL.data('id') : '',
                            _earliesttime = targetSL.find('.earlyTime').val(),
                            _latestttime = targetSL.find('.latestTime').val(),
                            _suggesttime = targetSL.find('.suggestTime').val(),
                            dataSL = {
                                boxId: boxId,
                                id: slId,
                                sectionId: sectionTarget.data('id'),
                                earliesttimeInDay: _earliesttime,
                                latestttimeInDay: _latestttime,
                                suggesttimeInDay: _suggesttime,
                                lessonId: targetSL.find('.lessonChoose').data('id'),
                                dayOrder: targetSL.find('.dayorderC').val()
                            }
                        if (time_range(_earliesttime, _latestttime, _suggesttime)) {
                            Data.createOrUpdateMineSectionLesson(dataSL).done(function (res) {
                                targetSL.attr('data-id', res.vo.id);
                                if (itm == targetSLAll.length - 1 && indexSection == sectionObj.length - 1) {
                                    isSL = true;
                                }
                                if (isSL) {
                                    bainx.broadcast('保存成功！');
                                    isSave = true;
                                    isCourseTpl = false;
                                    $('.chooseCourseTpl').hide();
                                }
                            })
                        }
                    })
                })
            })
        }

        //事件
        function bindEvent() {
            //创建盒子
            $('body')
                .on('click', 'input', function (event) {
                    if (event && event.preventDefault) {
                        window.event.returnValue = true;
                    }
                })
                //上传盒子图片
                .on('change', '.file', function (event) {
                    var target = $(this).parents('.addPic');
                    if (target.parents('.box_img').find('.active').length == 0) {
                        $('.waitting').show();
                        var formId = target.parents('.box_img').find('dd').length == 0 ? '#my_form' : '#my_form1';
                        Common.uploadImages(event, formId, URL.upYunUploadPics).done(function (res) {
                            $('.waitting').hide();
                            var addPic = target.parent();
                            var picUrls = res.result.picUrls,
                                imgListUrl = [];
                            console.log(picUrls,addPic)
                            var picUrlsArr = picUrls.split(';');
                            $.each(picUrlsArr, function (index, item) {
                                imgListUrl.push('<div class="active"><img src="' + item + '"  alt=""><span class="deleteImg"></span></div>');
                            })
                            addPic.before(imgListUrl.join(''));
                            picUrlsArr = [];
                            target.hide();

                        }).fail(function () {
                            bainx.broadcast('上传图片失败！');
                        });
                    } else {
                        bainx.broadcast('您已经上传过封面图了！');
                    }

                })
                //删除图片
                .on('click', '.deleteImg', function (event) {
                    event.preventDefault();
                    var target = $(this).parent();

                    var data = {
                        filePath: target.children('img').attr('src')
                    }
                    //Data.upyunDeleteFile(data).done(function (res) {
                        bainx.broadcast('删除成功！');

                    console.log(target.parents('.box_img'),target.parents('.box_img').find('.addPic'))
                    target.parents('.box_img').find('.addPic').show();
                    target.remove();
                  //  })
                })
                //弹出模版
                .on('click', '.chooseCourseTpl', function (event) {
                    courseTamplateList();
                })
                //选择之后加样式
                .on('click', '#courseBox li', function () {
                    $('#courseBox li').removeClass('hasChoiceCourse');
                    $(this).addClass('hasChoiceCourse');

                })
                //点击确定之后出现模版详情
                .on('click', '.selectedCourseTplBtn', function () {
                    $('.courseTamplateList').hide();
                    var courseId = $('#courseBox .hasChoiceCourse').data('id');
                    getCourseTamplateItem(courseId);

                    isCourseTpl = true;


                })
                //查看报告
                .on('click', '.viewReport', function () {
                    $('body').append('<section class="telDialog wl-trans-dialog translate-viewport QuestionDialog" data-widget-cid="widget-0" style="display: block;"><div class="containerQuestion"><i class="closeBtn closeReport"></i></div></section>');
                    csadQuestionnaireSurveyPage('', rid);

                })
                //关闭
                .on('click', '.closeBtn', function () {
                    if ($(this).hasClass('closeReport')) {
                        $('.QuestionDialog').remove();
                    }
                    if ($(this).hasClass('closeAdd')) {
                        $('#userLessonList').css({'z-index':3});
                        if($('.sectionLesson_add').length > 0 && $('.sectionLesson_add').hasClass('hide')){
                                $('.addContent .grid').addClass('hide');
                        }else{
                            addDialog.hide();
                            $('.addPOP').remove();
                            addDialog = '';
                        }

                    }
                    if ($(this).hasClass('closeCoursePreview')) {
                        $('.coursePreview').remove();
                        coursePreviewDialog = '';
                    }

                    if($(this).hasClass('closeCourseTamplate')){
                        $('.courseTamplateList').hide();
                    }

                    $('body').removeClass('dialog-mode');

                })
                //删除操作
                .on('click', '.deleteIcon', function () {
                    var target = $(this);
                    var delId, data;
                    if (target.hasClass('deleteLesson')) {//删除课时
                        delId = $(this).parents('li').data('id');
                        if (delId) {
                            var canDel = true;
                            $('.sectionLs dd').each(function(){
                                if($(this).find('.lessonChoose').data('id') == delId && !$(this).hasClass('currentSL') ){
                                    bainx.broadcast('您要删除的课时已经关联阶段了，无法删除！');
                                    canDel = false;
                                }
                            })
                            if(canDel){
                                data = {
                                    id: delId
                                }
                                Data.deleteLesson(data).done(function (res) {
                                    target.parents('li').remove();
                                })
                            }

                        } else {
                            target.parents('li').remove();
                        }

                    }
                    if (target.hasClass('deleteStep')) {//删除步骤
                        delId = $(this).parents('dd').data('id');
                        if (delId) {
                            data = {
                                id: delId
                            }
                            Data.deleteLessonStep(data).done(function (res) {
                                target.parents('dd').remove();
                            })
                        } else {
                            target.parents('dd').remove();
                        }
                    }
                    if (target.hasClass('deleteSection')) {//删除课程阶段
                        delId = $(this).parents('li').data('id');
                        if (delId) {
                            data = {
                                id: delId
                            }
                            Data.deleteCourseSection(data).done(function (res) {
                                target.parents('li').remove();
                            })
                        } else {
                            target.parents('li').remove();
                        }

                    }
                    if (target.hasClass('deleteSectionLesson')) {//删除课时阶段关联
                        var _tarParent = target.parents('dd');
                        _tarParent.addClass('currentDel');

                        $('.currentDel ~ dd').each(function () {
                            var dayC = $(this).find('.dayorderC'),
                                thisVal = parseInt(dayC.val()) - 1;
                            dayC.val(thisVal);
                        })
                        delId = target.parents('dd').data('id');
                        if (delId) {
                            data = {
                                id: delId
                            }
                            Data.deleteSectionLesson(data).done(function (res) {
                                target.parents('dd').remove();
                            })
                        } else {
                            target.parents('dd').remove();
                        }
                    }
                })

                //选择课时
                .on('click', '.lessonChoose,.userLesson_id', function () {
                    if (!$(this).hasClass('disabled')) {

                        $('.userLessonList').show();
                        $('.choiceDialog').removeClass('hasChoice');
                        $('dd').removeClass('currentSL');
                        if ($(this).hasClass('lessonChoose')) {

                            // saveAllLesson($(this));
                            var lessid = $(this).data('id');
                            $('.sectlesson_'+lessid).addClass('currentSL');

                            //$(this).parents('dd').addClass('currentSL');
                        }
                    }
                })

                //弹窗的选择
                .on('click', '.choiceDialog', function () {
                    var _tar = $(this);
                    _tar.parents('li').addClass('hasStep').siblings().removeClass('hasStep');
                    $('.choiceDialog').removeClass('hasChoice');
                    var target = $(this).parents('li');
                    _tar.addClass('hasChoice');
                    if (_tar.hasClass('lessonChoice')) {
                        // userLessonListdialog.hide();
                        $('.userLessonList').hide();
                        $('body').removeClass('dialog-mode');

                        $('.sectionLesson_add').removeClass('hide');


                        saveAllLesson(target,true);

                    }
                })
                ////确定添加并继续
                //.on('click', '.okAndContinue', function () {
                //    $('.addPOP').find('input,textarea').val('');
                //})
                //添加
                .on('click', '.addBtn', function () {
                    var target = $(this);
                    if (target.hasClass('addSectionBtn')) {  //阶段
                        addPOP(target, '阶段', 'section')
                    }
                    if (target.hasClass('addSLBtn')) {        //阶段关联

                        var vo = {
                            id: target.parents('li').data('id'),
                            sectionName: target.parents('li').data('name'),
                            sectionSd: target.parents('li').data('sd'),
                            sectionEd: target.parents('li').data('ed')
                        }

                        $('.sectionLs').removeClass('currentAddSL');
                        $(this).parents('li').find('.sectionLs').addClass('currentAddSL');

                        addPOP(target, '', 'sectionLesson', vo)
                    }
                    if (target.hasClass('addLessonBtn')) {        //课时
                        $('.addContent .grid').addClass('hide');

                        if($('.addContent .lesson_add').length > 0){
                            $('.addContent .lesson_add').removeClass('hide');
                            $('.addContent .lesson_add input,.addContent .lesson_add  textarea').val('');

                        }else{
                            addPOP(target, '课时', 'lesson');
                            //add('步骤', $('.addLessonBtn'), 'step');
                        }

                       // addPOP(target, '课时', 'lesson');
                        //$('#userLessonList').hide();
                        $('#userLessonList').css({'z-index':1});


                    }

                    if (target.hasClass('addStepBtn')) {  //步骤
                        $('.addContent .grid').addClass('hide');

                        if($('.addContent .step_add').length > 0){
                            $('.addContent .step_add').removeClass('hide');
                            $('.addContent .step_add input,.addContent .step_add  textarea').val('');
                            $('.addContent .chooseProdDD').removeAttr('data-prodid data-remain data-prodname data-resid  data-resremain data-resname');
                        }else{
                            addPOP(target, '步骤', 'step');
                            //add('步骤', $('.addLessonBtn'), 'step');
                        }
                       // addPOP(target, '步骤', 'step')
                        //$('#userLessonList').hide();
                        $('#userLessonList').css({'z-index':1});
                        $('.chooseDialog ul li').removeClass('currentAddStep');
                        target.parents('li').addClass('currentAddStep');
                    }
                })

                //确定添加
                .on('click', '.ok_btn', function () {
                    var name,
                        target,
                        className,
                        tar = $(this),
                        _id = $('.targetEdit').data('id') ? $('.targetEdit').data('id') : '',
                        data;
                    $('input,textarea').blur();
                    if (!validate(tar)) {
                        //定义className
                        if ($(this).hasClass('lesson_ok_btn')) {
                            className = 'lesson';
                        }
                        if ($(this).hasClass('step_ok_btn')) {
                            className = 'step';
                        }
                        if ($(this).hasClass('section_ok_btn')) {
                            className = 'section';
                        }
                        if ($(this).hasClass('sectionLesson_ok_btn')) {
                            className = 'sectionLesson';
                        }
                        var _Name = $('input[name=' + className + '_name]').val(),
                            _ShortName = $('input[name=' + className + '_short_name]').val(),
                            _Introduce = $('textarea[name=' + className + '_introduce]').val(),
                            _Note = $('textarea[name=' + className + '_note]').val();
                        if ($(this).hasClass('lesson_ok_btn')) {
                            name = '课时';
                            target = $(this).parents('.pageBox').children('.lesson');


                            var changeData = {
                                vo: {
                                    boxId: boxId,
                                    lessonName: _Name,
                                    lessonShortName: _ShortName,
                                    lessonIntroduce: _Introduce,
                                    lessonNote: _Note,
                                }
                            }

                            //Data.createOrUpdatelesson(changeData.vo).done(function(res){
                            oparetion(changeData, className)
                            //  })
                        }

                        if ($(this).hasClass('step_ok_btn')) {
                            name = '步骤';
                            var lessonId = $('.currentAddStep').data('id'),
                                _stepOrder = $('.addContent').find('select').val(),
                                stepType = $('.step_choice_type .active').data('id'),
                                stepInterval = $('input[name=step_interval]').val(),
                                chosedItem = $('.chooseProdDD'),
                                prodId = chosedItem.data('prodid'),
                                prodUseRemind = chosedItem.data('remain'),
                                multimediaResourceId = chosedItem.data('resid'),
                                multimediaUseRemind = chosedItem.data('resremain'),
                                resName = chosedItem.data('resname'),
                                prodName = chosedItem.data('prodname');

                            var changeData = {
                                vo: {
                                    boxId: boxId,
                                    lessonId: lessonId,
                                    stepName: _Name,
                                    stepShortName: _ShortName,
                                    stepIntroduce: _Introduce,
                                    stepNote: _Note,
                                    stepOrder: _stepOrder,
                                    stepType: stepType,
                                    stepInterval: stepInterval,
                                    prodId: prodId,
                                    prodName: prodName,
                                    prodUseRemind: prodUseRemind,
                                    multimediaResourceId: multimediaResourceId,
                                    multimediaUseRemind: multimediaUseRemind,
                                    resName: resName
                                }
                            }

                            var isContinue = $(this).hasClass('okAndClose') ? false : true;
                            // Data.createOrUpdateMineLessonStep(dataStep).done(function (res) {
                            oparetion(changeData, className, isContinue)
                            // })
                        }

                        if ($(this).hasClass('section_ok_btn')) {
                            name = '阶段';
                           // target = $(this).parents('.pageBox').children('.section');
                            var //sectionDuration = $('input[name=section_duration]').val(),
                                sectionOrder = $('.'+className+'_add').find('select').val(),
                                sectionSd = $('input[name=section_sd]').val(),
                                sectionEd = $('input[name=section_ed]').val(),
                                sectionSdOld = $('input[name=section_sd]').data('old'),
                                sectionEdOld = $('input[name=section_ed]').data('old'),
                                sectionDuration = parseInt(sectionEd) - parseInt(sectionSd) + 1;
                            if ((sectionSdOld && sectionSd != sectionSdOld) || sectionSdOld && sectionEd != sectionEdOld) {
                                bainx.broadcast('您修改阶段的时间，请记得修改课时关联跟以下阶段的时间（包括课时关联）哦');
                            }
                            var changeData = {
                                vo: {
                                    sectionName: _Name,
                                    sectionShortName: _ShortName,
                                    sectionDuration: sectionDuration,
                                    sectionIntroduce: _Introduce,
                                    sectionNote: _Note,
                                    sectionOrder: sectionOrder,
                                    sectionSd: sectionSd,
                                    sectionEd: sectionEd
                                }
                            }
                            oparetion(changeData, className)


                        }
                        if ($(this).hasClass('sectionLesson_ok_btn')) {
                            name = '';
                            var _dayOrder = $('input[name=day_order]').val();
                            sectionLessonBatch(_dayOrder, className, true)

                        }
                    }
                })

                //批量添加阶段课时
                .on('click', '.sectionLesson_batch_btn', function () {
                    var _tar = $('.addContent');
                    if (!validate($(this))) {
                        var _allDl = $('.currentAddSL').find('dd'),
                            _ed = parseInt($('.addContent .sl_ed').text()),
                            _sd = parseInt($('.addContent .sl_sd').text());
                        var className = 'sectionLesson',
                            arr2 = [],//两者差集
                            arr = [],//全部阶段天数
                            hasAddOrder = [];//已经添加的天数
                        for (var i = _sd; i <= _ed; i++) {
                            arr.push(i);
                        }
                        _allDl.each(function () {
                            var thisDayOrder = parseInt($(this).find('.dayorderC').val());
                            hasAddOrder.push(thisDayOrder);
                        })
                        arr2 = chaji_array(arr, hasAddOrder);
                        if (arr2.length == 0) {
                            arr2 = arr;
                        }
                        $.each(arr2, function (idx, item) {
                            var _dayOrderPL = item;
                            var lastSL = false;
                            if (idx == arr2.length - 1) {
                                lastSL = true;
                            }
                            sectionLessonBatch(_dayOrderPL, className, lastSL)
                        })
                    }
                })

                //选择产品弹窗
                .on('click', '.addBoxProduct img', function () {
                    getProductList();
                })

                //选择产品
                .on('click', '.productItem i,.noDataBtn', function () {
                    if (!$(this).hasClass('noDataBtn')) {
                        var target = $(this).parent('.productItem');
                        if (target.hasClass('addBoxProductP')) {
                            var activeProductList = [];
                            $('.boxProductActive').each(function () {
                                activeProductList.push($(this).data('id'));
                            })
                            if (!activeProductList.contains(target.data('id'))) {
                                createBoxProduct(target)
                            } else {
                                bainx.broadcast('您已经选择这个产品了，如要修改请直接修改数量！');
                            }


                        } else {
                            target.addClass('hasChoiceProd').siblings().removeClass('hasChoiceProd');
                            var prodname = target.find('.prod_name').text();
                            $('input[name=productName]').val(prodname);
                        }
                    }
                    if ($(this).parents('#userLessonList').length > 0) {
                        userLessonListdialog.hide();
                    } else if ($(this).parents('#chooseProduct').length > 0) {
                        chooseProductDialog.hide();
                    }

                    $('body').removeClass('dialog-mode');
                })

                //选择定制类型
                .on('click', '.makeType .choice,#userLessonList .choice,.addPOP .choice', function (event) {
                    if (!$(this).hasClass('disabled')) {
                        $(this).addClass('active').siblings().removeClass('active');
                    }

                })

                //删除定制产品
                .on('click', '.deleteProduct', function (event) {
                    var target = $(this).parents('li');
                    deleteBoxProduct(target);
                })

                //保存盒子
                .on('click', '.saveBoxBtn', function (event) {
                    saveBox();

                })

                //预览
                .on('click', '.previewBtn', function (event) {
                    coursePreview(true, true);
                })

                //修改定制产品数量
                .on('blur', '.numProdItem', function (event) {

                    if (!$(this).hasClass('disabled')) {
                        var tarParent = $(this).parents('li'),
                            tarParentPrice = $(this).parents('li').data('price'),
                            num = $(this).val() ? parseInt($(this).val()) : 0;
                        tarParent.find('.priceProdItem').text(tarParentPrice * num);
                        createBoxProduct(tarParent)
                    }
                })

                //选择步骤产品
                .on('click', '#userLessonList .product,.chooseProduct', function () {
                    getBoxProductDialog('', false);
                    $('.stepDetail').removeClass('currentStepP');
                    $(this).parents('.stepDetail').addClass('currentStepP');
                })
                .on('click', '#chooseBoxProduct .chooseProducti', function () {

                    var tarP = $(this).parents('li'), currSP = $('.currentStepP');
                    $('#chooseBoxProduct li').removeClass('hasChoiceProd2');
                    tarP.addClass('hasChoiceProd2');
                    currSP.find('.product').attr({
                        'data-prodid': tarP.data('id'),
                        'data-remain': tarP.data('remain')
                    }).removeClass('disabled');
                    currSP.find('.product').children('.prodName').text(tarP.find('.prodName').text()).removeClass('hide');
                    currSP.find('.product').children('.tips').addClass('hide');
                    currSP.find('.res').attr({
                        'data-resid': tarP.data('resid'),
                        'data-resremain': tarP.data('resremain')
                    }).removeClass('disabled');
                    currSP.find('.res').children('.resName').text(tarP.data('resname')).removeClass('hide');

                    $('.chooseProdDD').attr({
                        'data-prodid': tarP.data('id'),
                        'data-remain': tarP.data('remain'),
                        'data-prodname': tarP.find('.prodName').text(),
                        'data-resid': tarP.data('resid'),
                        'data-resremain': tarP.data('resremain'),
                        'data-resname': tarP.data('resname')
                    });
                    $('.chooseProdDD').find('input').val(tarP.find('.prodName').text());

                    chooseBoxProductDialog.hide();
                    $('#chooseBoxProduct').remove();
                    chooseBoxProductDialog = '';
                })

                //发送盒子
                .on('click', '.isSave', function () {
                    if (!isSave) {
                        bainx.broadcast('您尚未保存盒子，请先保存再发送！');
                        return
                    }
                    //发送盒子
                })

        }

        //批量添加阶段课时
        function sectionLessonBatch(dorder, className, lastSL) {
            var _tar = $('.addContent'),
                _sdDay = parseInt(_tar.find('.sl_sd').text()),
                _edDay = parseInt(_tar.find('.sl_ed').text()),
                _earliesttime = _tar.find('input[name=earliesttime_in_day]').val(),
                _latestttime = _tar.find('input[name=latestttime_in_day]').val(),
                _lesson_id = _tar.find('.userLesson_id').data('id'),
                _suggesttime = _tar.find('input[name=suggesttime_in_day]').val();

            if (dorder < _sdDay || dorder > _edDay) {
                bainx.broadcast('您填写的天数不在范围内，请重新填写');
                _tar.find('input[name=day_order]').val('').focus();
                return;
            }

            var changeData = {
                vo: {
                    earliesttimeInDay: _earliesttime,
                    latestttimeInDay: _latestttime,
                    suggesttimeInDay: _suggesttime,
                    lessonId: _lesson_id,
                    dayOrder: dorder,
                }
            }
            if (time_range(_earliesttime, _latestttime, _suggesttime)) {
                oparetion(changeData, className)

                if (lastSL) {
                    addDialog.hide();
                    $('.addPOP').remove();
                    addDialog = '';
                    // _tar.find('.userLesson_id').text('请选择课时').attr('data-id','');
                }
            }
        }

        //创建或更新之后的操作
        function oparetion(res, className, iscontinue) {
            var vo = res.vo,
                okBtn;
            if (className == 'section') {
                var tpl = s_TPL(''),
                    html = [];
                html.push(bainx.tpl(tpl, vo));
                if($('.courseGather ul li').length > 0){
                    $('.courseGather ul li').last().after(html.join(''));
                }else{
                    $('.courseGather .addSectionBtn').before(html.join(''));
                }

                var courseGatherLI = $('.courseGather ul li');
                var addBtnTml = '<div class="addBtn addSLBtn">添加阶段关联</div>';
                if (courseGatherLI.last().find('.addSLBtn').length == 0) {
                    courseGatherLI.last().append(addBtnTml);
                }
                $('.sectionLs').removeClass('currentAddSL');
                courseGatherLI.last().find('.sectionLs').addClass('currentAddSL');
                $('.addContent .grid').html('');
                add('', '', 'sectionLesson', vo);
            }
            if (className == 'sectionLesson') {

                var chosedItem = $('.hasChoice').parents('li'),
                    stepList = [];
                chosedItem.find('.stepDetail').each(function () {
                    var targetStep = $(this),
                        lessonStepVOList = {
                            stepName: targetStep.find('.name').val(),
                            stepShortName: targetStep.find('.shortname').val(),
                            stepIntroduce: targetStep.find('.introduce').val(),
                            stepNote: targetStep.find('.note').val(),
                            stepOrder: targetStep.find('.order').val(),
                            stepType: targetStep.find('.type.active').data('id'),
                            stepInterval: targetStep.find('.interval').val(),
                            prodId: targetStep.find('.product').data('prodid'),
                            prodName: targetStep.find('.prodName').text(),
                            prodUseRemind: targetStep.find('.product').data('remain'),
                            multimediaResourceId: targetStep.find('.res').data('resid'),
                            multimediaUseRemind: targetStep.find('.res').data('resremain'),
                            resName: targetStep.find('.res').text()
                        };
                    stepList.push(lessonStepVOList);

                })
                var sl_data = {
                    lessonName: chosedItem.find('.lessonName').val(),
                    lessonStepVOList: stepList
                }
                var tpl = sl_TPL(),
                    html = [];
                vo.lessonStepVOList = sl_data.lessonStepVOList;
                createOrUpdateStepHtml(vo);
                vo.lessonName = sl_data.lessonName;
                html.push(bainx.tpl(tpl, vo));
                $('.currentAddSL').append(html.join(''));
            }

            if (className == 'lesson') {
                var tpl = lesson_TPL(),
                    html = [];
                html.push(bainx.tpl(tpl, vo));
                $('.chooseDialog ul li').removeClass('currentAddStep');
                $('.chooseDialog ul li').length > 0 ? $('.chooseDialog ul li').last().after(html.join('')) :$('.chooseDialog ul').append(html.join('')) ;
                $('.chooseDialog ul li').last().addClass('currentAddStep');

                $('.addContent .grid').addClass('hide');
                if($('.addContent .step_add').length > 0){
                    $('.addContent .step_add').removeClass('hide');
                    $('.addContent .step_add input,.addContent .step_add textarea').val('');
                    $('.addContent .chooseProdDD').removeAttr('data-prodid data-remain data-prodname data-resid  data-resremain data-resname');
                }else{
                    add('步骤', $('.addLessonBtn'), 'step');
                }
                //$('#userLessonList').hide();
                $('#userLessonList').css({'z-index':1});

            }
            if (className == 'step') {
                var tpl = step_TPL(),
                    html = [];
                //var boxProductObj = $('.productMessage').find('.boxProductActive'),
                //    boxProductList = [];
                //boxProductObj.each(function(){
                //    boxProductList.push($(this).data('id'));//定制的产品id
                //})
                vo.hide = 'hide';

                vo.disabled = !vo.prodId ? 'disabled' : '';
                vo.hide = !vo.prodId ? '' : 'hide';
                vo.show = !vo.prodId ? 'hide' : '';

                //if(!boxProductList.contains(vo.prodId)){      //步骤不包含产品，提示
                //    vo.disabled='disabled';
                //    vo.hide='';
                //}
                var stepTypeTxt = ['', '普通', '特效'];
                vo.stepTypeW = stepTypeTxt[vo.stepType];
                vo.active1 = vo.stepType == 1 ? 'active' : '';
                vo.active2 = vo.stepType == 2 ? 'active' : '';
                html.push(bainx.tpl(tpl, vo));
                if ($('.currentAddStep .stepListL').length == 0) {
                    var stepTit = '<div class="stepListL"><p class="borderl">步骤：</p><dl class="less_step grid"><div class="addBtn addStepBtn">添加步骤</div></dl></div> ';
                     $('.currentAddStep .lessonChoice').before(stepTit);

                }
                $('.currentAddStep .addStepBtn').before(html.join(''));
                if (iscontinue) {
                    $('.addContent input,.addContent textarea').val('');
                    $('.addContent .chooseProdDD').removeAttr('data-prodid data-remain data-prodname data-resid  data-resremain data-resname');
                }
                else {
                    $('#userLessonList').css({'z-index':3});
                    //$('#userLessonList').show();
                    if($('.sectionLesson_add').length == 0){
                        addDialog.hide();
                        $('.addPOP').remove();
                        addDialog = '';
                    }else{
                        $('.step_add').addClass('hide');
                    }

                }
            }
        }

        //阶段tpl
        function s_TPL(addSLHtm) {
            var tpl = '<li data-id="{{id}}"  data-name="{{sectionName}}" data-duration="{{sectionDuration}}" data-order="{{sectionOrder}}" data-shortname="{{sectionShortName}}" data-introduce="{{sectionIntroduce}}" data-note="{{sectionNote}}"  data-ed="{{sectionEd}}" data-sd="{{sectionSd}}"><div class="gather_sectionName">第{{sectionOrder}}阶段<em class="deleteIcon deleteSection"></em><p><label>阶段名：</label><input class="gather_sectionNames" value="{{sectionName}}"></p><p><label>阶段简称：</label><input class="gather_sectionShortName" value="{{sectionShortName}}"></p><p><label>阶段介绍：</label><input class="gather_sectionIntroduce" value="{{sectionIntroduce}}"></p><p><label>阶段备注：<input class="gather_sectionNote" value="{{sectionNote}}"></label></p><p>该阶段从第<input type="tel" class="gather_sectionSd" value="{{sectionSd}}"/>到第 <input type="tel" class="gather_sectionEd" value="{{sectionEd}}"/>结束</p></div> <i class="whiteDot"></i><dl class="grid sectionLs">{{sectionLessonVOListTpl}}</dl>' + addSLHtm + ' </li>';
            return tpl
        }

        //阶段课时tpl
        function sl_TPL() {
            var tpl = '<dd class="row sectlesson_{{lessonId}}" data-id="{{slId}}"><div class="col col-4 sl_left">第<input class="dayorderC" type="tel" value="{{dayOrder}}" />天<em class="deleteIcon deleteSectionLesson"></em></div><div class="col col-21"> <p>要求从<input type="time" class="earlyTime" value="{{earliesttimeInDay}}"/> 到<input type="time" class="latestTime" value="{{latestttimeInDay}}"/> 之间学习<span class="lessonChoose lessonG" data-id="{{lessonId}}" data-lessonintroduce="{{lessonIntroduce}}" data-name="{{lessonName}}" data-note="{{lessonNote}}" data-lessonproperty="{{lessonProperty}}" data-shortname="{{lessonShortName}}">{{lessonName}}</span></p><p>建议<input type="time" class="suggestTime" value="{{suggesttimeInDay}}"/>学习<span class="lessonG" data-id="{{lessonId}}">{{lessonName}}</span></p><p class="lessonStepP">该<span class="lessonG" data-id="{{lessonId}}">{{lessonName}}</span>分为<span class="count_step">{{count}}</span>个步骤:</p><div class="gather_stepList grid">{{stepList}}</div></div> </dd>';
            return tpl
        }

        function lesson_TPL() {
            var tpl = '<li  data-id="{{id}}" ><div class="borderl"><p><span>基础信息</span><em class="deleteIcon deleteLesson"></em></p><p>课时名：<input class="lessonName answer" value="{{lessonName}}"/></p><p>课时简称：<input class="lessonShortName answer" value="{{lessonShortName}}"/></p></div><div class="row borderl"><div class="">课时介绍:</div><div class="col"><input class="lessonIntroduce answer" value="{{lessonIntroduce}}"/></div> </div><div class="row borderl"><div>课时备注:</div><div class="col"><input class="lessonNote answer" value="{{lessonNote}}"/></div> </div>{{stepHtm}}<div class=" lessonChoice choiceDialog"><i></i></div></li>';

            return tpl
        }

        //步骤tpl
        function step_TPL() {
            var tpl = '<dd class="row stepDetail" data-id="{{id}}" ><div class="stepItemDot"><i></i>步骤<input class="order" value="{{stepOrder}}" type="tel"/><em class="deleteIcon deleteStep"></em> </div><div class="col"><div class="grid"> <div class="row"><div>步骤名：</div><input class="col answer name" value="{{stepName}}"/></div><div class="row"><div>步骤简称：</div><input class="col answer shortname" value="{{stepShortName}}"/></div><div class="row"><div>步骤类型：</div><div class="col answer"><b class="choice {{active1}} chooseItem type" data-id="1">普通步骤</b><b class="choice {{active2}} chooseItem type" data-id="2">特效步骤</b></div></div><div class="row"><div>与上一个步骤之间的间隔：</div><input class="col answer interval" value="{{stepInterval}}"/></div><div class="row"><div>步骤介绍：</div><input class="col answer introduce" value="{{stepIntroduce}}" /></div><div class="row"><div>步骤备注：</div><input class="col answer note" value="{{stepNote}}"/></div><div class="row"><div>使用：</div><div class="col answer product {{disabled}}" data-prodid="{{prodId}}" data-remain="{{prodUseRemind}}" ><span class="{{show}} prodName">{{prodName}}</span><span class="tips {{hide}} prod_{{prodId}}">(您尚未选择这个产品，如果保存，产品将不存在！)</span></div></div><div class="row"><div>学习：</div><div class="col answer res {{disabled}}" data-resid="{{multimediaResourceId}}" data-resremain="{{multimediaUseRemind}}" ><span class="{{show}} resName">{{resName}}</span></div></div></div></div></dd>';
            return tpl;
        }

        //更新或添加步骤的html
        function createOrUpdateStepHtml(vo) {
            var voStepTpl = '<div class="stepItem" data-id="{{id}}" data-name="{{stepName}}" data-note="{{stepNote}}" data-shortname="{{stepShortName}}" data-introduce="{{stepIntroduce}}" data-interval="{{stepInterval}}" data-order="{{stepOrder}}" data-type="{{stepType}}" > <p class="stepDot " >步骤{{stepOrder}}:</p><div class="row"><div> 步骤名：</div><div class="col name_step">{{stepName}}</div> </div><div class="row userProductItem "><div> 使用：</div><div class="col product_step {{disabled}}" data-id="{{prodId}}" data-remain="{{prodUseRemind}}"><span class="{{show}} prodName">{{prodName}}</span><i class="tips {{hide}} prod_{{prodId}}">(请选择产品)</i></div> </div><div class="row learnVideoItem "><div> 学习：</div><div class="col res_step {{disabled}}" data-resourceid="{{multimediaResourceId}}" data-resremain="{{resUseRemind}}"><span class="{{show}} resName"> {{resName}}</span></div></div></div>',
                voStepTplHtml = [], containSPList = [],
                lessonStep = vo.lessonStepVOList;
            if (lessonStep) {
                var boxProductObj = $('.productMessage').find('.boxProductActive'),
                    boxProductList = [];
                boxProductObj.each(function () {
                    boxProductList.push($(this).data('id'));//定制的产品id
                })
               // containSPList = uniqueArr(containSPList);//步骤的产品id
                $.each(lessonStep, function (j, voListItem) {
                    voListItem.hide = 'hide';
                    if (!boxProductList.contains(voListItem.prodId)) {      //步骤不包含产品，提示
                    //var hasChoiceProduct = $('#userLessonList .hasChoice').parents('li')
                    //if ($('#userLessonList .hasChoice')) {
                        voListItem.disabled = 'disabled';
                        voListItem.hide = '';
                        voListItem.show = 'hide';
                    }
                    voListItem.id = !isCourseTpl ? voListItem.id : '';
                    voStepTplHtml.push(bainx.tpl(voStepTpl, voListItem));
                })

                vo.count = lessonStep.length;
            }

            vo.stepList = voStepTplHtml.join('');
        }

        //验证
        function validate(targ,className) {

            var target = targ.parents('.'+className +'_add'),
                _name = target.find('.input_name').val(),
                _order = target.find('.input_order').val(),
                _short_name = target.find('.input_short_name').val(),
                _introduce = target.find('.textarea_introduce').val(),
                _note = target.find('.textarea_note').val(),
                _interval = target.find('input[name=step_interval]').val(),
            // _productName = target.find('input[name=productName]').val(),
                _sd = target.find('.input_sd').val(),
                _ed = target.find('.input_ed').val(),
                _earlyTime = target.find('input[name=earliesttime_in_day]').val(),
                _latestTime = target.find('input[name=latestttime_in_day]').val(),
                _suggestTime = target.find('input[name=suggesttime_in_day]').val(),
                _dayOrder = target.find('input[name=day_order]').val(),
                _userLessobId = target.find('.userLesson_id').text(),
                hasOK = false;

            if (!_suggestTime && _suggestTime == '') {
                bainx.broadcast('请填写建议时间~');
                hasOK = true;
            }
            if (_userLessobId == '请选择课时') {
                bainx.broadcast('请选择课时~');
                hasOK = true;
            }
            if (!_latestTime && _latestTime == '') {
                bainx.broadcast('请填写结束时间~');
                hasOK = true;
            }
            if (!_earlyTime && _earlyTime == '') {
                bainx.broadcast('请填写起始时间~');
                hasOK = true;
            }

            if (!_ed && _ed == '') {
                bainx.broadcast('请填写阶段结束时间~');
                hasOK = true;
            }
            if (!_sd && _sd == '') {
                bainx.broadcast('请填写阶段开始时间~');
                hasOK = true;
            }
            //if(!_productName && _productName == ''){
            //    bainx.broadcast('请输入产品~');
            //    hasOK = true;
            //}
            if (!_note && _note == '') {
                bainx.broadcast('请填写备注~');
                hasOK = true;
            }
            if (!_introduce && _introduce == '') {
                bainx.broadcast('请填写介绍~');
                hasOK = true;
            }
            if (!_interval && _interval == '') {
                bainx.broadcast('请填写间隔时长~');
                hasOK = true;
            }
            if (!_short_name && _short_name == '') {
                bainx.broadcast('请填写简称~');
                hasOK = true;
            }
            if (!_order && _order == '') {
                bainx.broadcast('请填写排序~');
                hasOK = true;
            }
            if (!_name && _name == '') {
                bainx.broadcast('请填写名称~');
                hasOK = true;
            }
            if (!_dayOrder && _dayOrder == '') {
                bainx.broadcast('请填写天数~');
                hasOK = true;
            }
            return hasOK
        }

        //步骤&&阶段的排序
        function orderNoRepeat(targetBtn, name, deleteItem) {
            var target = $('.currentAddContent');
            if (target.find('.input_order').length > 0 && (name == '步骤' || name == '阶段') ) {
                var currentList;
                if (name == '步骤') {
                    currentList = targetBtn.parents('.less_step').find('.stepDetail')
                }
                if (name == '阶段') {
                    currentList = targetBtn.parents('ul').find('li')
                }

                var currentListOrder = [],
                    currentSelect = target.find('.input_order')[0],
                    arr = [];
                //删除所有option值
                for (var i = 0; i < currentSelect.options.length;) {
                    currentSelect.removeChild(currentSelect.options[i]);
                }
                for (var i = 1; i < 11; i++) {
                    arr.push(i);
                }
                currentList.each(function () {
                    var _orderItem = $(this).data('order');
                    currentListOrder.push(_orderItem);
                })
                //if(deleteItem){
                //    var delTxt = deleteItem.find('.dayorderC').text();
                //    //获取下标
                //    Array.prototype.indexOf = function(val) {
                //        for (var i = 0; i < this.length; i++) {
                //            if (this[i] == val) return i;
                //        }
                //        return -1;
                //    };
                //    //删除元素
                //    Array.prototype.remove = function(val) {
                //        var index = this.indexOf(val);
                //        if (index > -1) {
                //            this.splice(index, 1);
                //        }
                //    };
                //    //调用
                //    currentListOrder.remove(delTxt);
                //}
                var arr2 = chaji_array(arr, currentListOrder);
                $.each(arr2, function (index, item) {
                    currentSelect.options.add(new Option('第' + item + name, item));
                })
            }
        }
        //弹出添加
        function addPOP(target, name, className, vo) {

            if (!addDialog) {
            $('.addContent').removeClass('currentAddContent');
                addDialog = new Dialog($.extend({}, Dialog.templates.bottom, {

                    template: '<div class="addPOP"><div class="addContent currentAddContent"><i class="closeBtn closeAdd"></i></div> </div>',
                }))

            }
            addDialog.show();
            add(name, target, className, vo)

        }

        //添加
        function add(name, target, className, vo) {
            var _sectionHtm = '',
                _stepHtml = '',
                tpl;
            if (className == 'section') {
                //var _listLast = target.parents('.pageBox').find('.list').children('dl').last(),
                //    _nextsd = 1;
                //if(_listLast.length > 0){
                //    var _endDay = parseInt(_listLast.find('.section_a_ed').text());
                //    _nextsd = _endDay + 1;
                //}
                _sectionHtm = '<!--<dd><span>' + name + '时长：</span><input type="tel" name="section_duration" class="input_duration" /> </dd>--><dd><span>' + name + '编号：</span><select name="section_order" class="input_order" /><!--<input type="tel" name="section_order" class="input_order"/> --></dd><dd><span>该阶段从：第</span><input type="tel" name="section_sd" class="input_sd" value=""/> <span>天开始，到第</span><input type="tel" name="section_ed" class="input_ed"/><span>天结束</span> </dd>';
            }
            if (className == 'step') {
                _stepHtml = '<dd><span>' + name + '排序：</span><select name="section_order" class="input_order" /><!--<input type="tel" name="step_order" class="input_order"/>--><p><span>与上一个' + name + '之间的间隔：</span><input type="tel" name="step_interval"/>秒</p></dd><dd class=" step_choice_type"><span>' + name + '类型：</span><div class="displayB"> <b class="choice active chooseItem" data-id="1">普通步骤</b><b class="choice chooseItem" data-id="2">特效步骤</b></div></dd>';
            }
            tpl = '<dl class="grid '+className+'_add"><dd><span>基础信息</span><p><span>' + name + '名：</span><input type="text" name="' + className + '_name" class="input_name ellipsis "/></p><p><span>' + name + '简称：</span><input type="text" name="' + className + '_short_name" class="input_short_name ellipsis"/></p></dd>' + _stepHtml + _sectionHtm + '<dd><span>' + name + '介绍</span><textarea name="' + className + '_introduce" class="textarea_introduce"></textarea></dd><dd><span>' + name + '备注</span><textarea name="' + className + '_note" class="textarea_note"></textarea> </dd><dd><span id="' + className + '_okBtn" class="' + className + '_ok_btn ok_btn btn">确定</span></dd></dl>';
            if (className == 'sectionLesson') {
                tpl = '<dl class="grid '+className+'_add"><p>请为' + vo.sectionName + '添加阶段课时，该阶段从第<span class="sl_sd">' + vo.sectionSd + '</span>天到第<span class="sl_ed">' + vo.sectionEd + '</span>天</p><dd><span>第</span><input name="day_order" type="tel" />天</dd><dd>要求<input type="time" name="earliesttime_in_day"/>到<input type="time" name="latestttime_in_day"/>时候使用<span class="userLesson_id">请选择课时</span></dd><dd>建议在<input type="time" name="suggesttime_in_day"/>使用<span class="userLesson_id">请选择课时</span></dd><dd><span class="sectionLesson_ok_btn btn ok_btn">确定</span><span class="sectionLesson_batch_btn btn">批量添加</span></dd></dl>';
            }

            $('.addContent').append(tpl);
            if (className == 'sectionLesson') {
                $('input[name=earliesttime_in_day]').attr('data-old', '');
                $('input[name=latestttime_in_day]').attr('data-old', '');
            }

            if (className == 'step') {
                var productTpl = '<dd class="chooseProdDD"><span>选择产品</span><input type="text" placeholder="请选择产品名" name="productName" class="ellipsis " readonly="readonly"/> <span class="chooseProduct btn">选择</span></dd>';

                $('.chooseProdDD').remove();
                $('.addContent').find('dd').last().before(productTpl);
            }
            if (className == 'section') {
                $('.' + className + '_ok_btn').text('确定并关联课时');
            }
            if (className == 'lesson') {
                $('.' + className + '_ok_btn').text('确定并添加步骤');
            }
            if (className == 'step') {
                $('.' + className + '_ok_btn').addClass('okAndClose').text('确定并关闭').after('<span class="' + className + '_ok_btn ok_btn btn okAndContinue">确定并继续添加</span>');

            }

            if (target) {
                orderNoRepeat(target, name);
            }
            //orderNoRepeat(target,className,name);
            $('.addContent').find('.ok_btn').removeClass(className + '_edit_btn');
        }

//判断设置的建议时间是否在要求的时间段内
        function time_range(beginTime, endTime, nowTime) {
            //console.log(beginTime,endTime,nowTime)
            var strb = beginTime.split(":");

            if (strb.length < 2) {
                return false;
            }
            var stre = endTime.split(":");
            if (stre.length < 2) {
                return false;
            }
            var strn = nowTime.split(":");
            if (stre.length < 2) {
                return false;
            }
            var b = new Date();
            var e = new Date();
            var n = new Date();
            b.setHours(strb[0]);
            b.setMinutes(strb[1]);
            e.setHours(stre[0]);
            e.setMinutes(stre[1]);
            n.setHours(strn[0]);
            n.setMinutes(strn[1]);
            if (n.getTime() - b.getTime() >= 0 && n.getTime() - e.getTime() <= 0) {
                return true;
            } else {
                console.log("您所设置的建议时间是：" + n.getHours() + ":" + n.getMinutes() + "，不在要求时间范围内！");
                return false;
            }
        }

        init()
    }

    return userBox

})