/**
 * 专家端页面
 * Created by xiuxiu on 2016/7/5.
 */
require([
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/csadCommon',
    'h5/js/page/csadDirectionCenter',
    'h5/css/page/csadPage.css'
], function($,URL, Data,CsadCommon,CsadDirectionCenter)
{
    function init(){
        $('.waitting').hide();
        CsadCommon.layout();
        //Group();
        render();
    }

    function render(){
        var tpm=CsadDirectionCenter.csadDirectionCenterHtml();
        $('.wrap .wrapper').append(tpm);
        CsadDirectionCenter.initDirectionCenter();

    }

    init();
})