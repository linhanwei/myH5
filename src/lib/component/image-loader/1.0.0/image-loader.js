
! function(g, fn) {
    "function" == typeof define && (define.amd || define.cmd) ? define(function() {
        return fn(g)
    }) : fn(g, !0);
}(this, function(global, umd) {
    var NTI = {
        '2g': '!q50',
        'cmnet': '!q50',
        'ctwap': '!q50',
        'ctnet': '!q50',
        '3g': '!q50',
        '3gnet' : '!q50',
        '3g+': '!q75',
        'ctlte': '!q75',
        '4g': '!q75',
        'wifi': '',
        'nonwifi':''
    };

    var NetType = navigator.userAgent.toLocaleLowerCase().match(/NetType\/(\w*\+?)/i);
    NetType = $.isArray(NetType) && (NetType.length == 2) && NetType[1] || '';

    sessionStorage['networkType'] = NetType;

    function transImageSrc(src) {
        return src + (/(^http:\/\/welinklife\.b0\.upaiyun\.com\/)[\S]*(\.jpg$)/gi.test(src) ? NTI[sessionStorage['networkType'] || '4g'] : '');
    }

    function imageLoader(target, src){
        var TAGNAME = 'IMG',
            EVENT = 'load',
            ATTR = 'src',
            ERROR = 'error',
            REPLACE_IMAGE = imgPath + 'common/images/img_icon.png';
            /*'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150210/vNTT-0-1423554790723.png';*/

        var img = $('<img />').on(EVENT, function(){
               if(target.tagName === TAGNAME) {
                    $(target).attr(ATTR, this.src);
               }else{
                    $(target).empty().append(this);
                    img.off(EVENT);
               }
            }).on(ERROR, function(){
               img.attr(ATTR, src);
            }).attr(ATTR, transImageSrc(src));

        if(target.tagName === TAGNAME){
            $(target).attr(ATTR, REPLACE_IMAGE);
        }
    }

    function loadImage(wrap, options) {
        var win = $(window),
            loadheight = Math.floor(win.height()),
            ATTR = options && options.attr || 'data-lazyload-src';

        wrap.find('['+ ATTR +']').each(function(){
            var target = $(this);
            if(target.offset().top < loadheight){
                var src = target.attr(ATTR);
                if(this.tagName === 'IMG'){
                    imageLoader(this, src);
                }else{
                    imageLoader(this, src);
                }
                target.removeAttr(ATTR);
            }
        });
    }

    function scrollLoad(wrap, options){
        if(options && options.enableScrollLoad){
            var sid;
            (options.scrollElement || wrap).on('scroll', function(){
                clearTimeout(sid);
                sid = setTimeout(function(){
                    loadImage(wrap, options);
                },200);
            });
            loadImage(wrap, options);
        }else{
             loadImage(wrap, options);
        }
    }

    global['imageLoader'] = scrollLoad;
    
    return scrollLoad;
});
