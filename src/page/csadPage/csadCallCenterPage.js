/**
 * 呼叫中心
 * Created by xiuxiu on 2016/7/18.
 */
require([
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/csadCommon'
], function($,URL, Data,CommonCsad) {
    function init() {
        $('.waitting').hide();
        CommonCsad.layout();
    }
    init()
})