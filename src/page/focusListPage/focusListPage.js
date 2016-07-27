/**
 * Created by Spades-k on 2016/6/29.
 */
require([
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/csadCommon',
    'h5/js/page/csadAddNotes',
    'h5/css/page/csadPage.css'
], function($,URL, Data,CommonCsad,CsadAddNotes)
{
    function init(){
        $('.waitting').hide();
        CommonCsad.layout();
        //
        render();
    }

    function render(){
        //模板
        var tpm=CsadAddNotes.csadAddNotesHtml2();
        var popHtml=CsadAddNotes.pop();
        $('.wrap .wrapper').append(tpm);
        $('#addnotes2').append(popHtml);
        CsadAddNotes.initAddNotes();


    }




    init();
})