/**
 * 管理列表
 * Created by xiuxiu on 2016/7/18.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/csadCommon',
    'h5/js/page/csadGroup'
], function($,URL, Data,CsadCommon,CsadGroup)
{
    function init(){
        //$('.waitting').hide();
        CsadCommon.layout();
        CsadGroup();
    }


    init();
})