/**
 * 问卷调查
 * Created by xiuxiu on 2016/4/19.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/data',
    'h5/js/page/csadQuestionnaireSurveyPage'
], function($, URL, Common, Data,csadQuestionnaireSurveyPage) {

    var _uid = URL.param.uid ? URL.param.uid : '',
        _rid = URL.param.detectId ? URL.param.detectId : '',
        userName =  URL.param.userName,
        userTel =  URL.param.userTel,
        serviceId =  URL.param.serviceId;

    $('body').append('<div class="containerQuestion"></div>');
    csadQuestionnaireSurveyPage(_uid,_rid,userName,userTel,serviceId);

})
