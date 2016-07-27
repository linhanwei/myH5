/**
 * 生成盒子
 * Created by xiuxiu on 2016/5/21.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/data',
    'h5/js/common/nexter',
    'h5/js/common/transDialog',
    'h5/js/page/csadQuestionnaireSurveyPage',
    'h5/js/page/csadCreateMineBoxPage',
    'h5/css/page/questionnaireSurveyPage.css',

], function($, URL, Common, Data,Nexter,Dialog,csadQuestionnaireSurveyPage,csadCreateMineBoxPage) {

    var rid = URL.param.rid,//报告id
        canEdit = URL.param.canEdit,//
        boxId=URL.param.boxId,//盒子id
        csadName=URL.param.csadName,
        csadTel=URL.param.csadTel;

    csadCreateMineBoxPage(rid,boxId,csadName,csadTel,canEdit)

})