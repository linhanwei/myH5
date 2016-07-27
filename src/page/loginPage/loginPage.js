/**
 * 专家端登录
 * Created by xiuxiu on 2016/7/13.
 */
require([
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/url',
    'h5/js/common/data'
], function($,URL, Data) {

    var Page;

    function init(){
        $('.waitting').hide();
        Page = $('<div class="login-box"> <div class="login-logo"><b>米酷私人管家</b></div> <div class="login-box-body"> <p class="login-box-msg">登录</p><div class="form-group"> <input type="text" name="username" class="form-control" placeholder="用户名" id="username"> <span class="icon user-icon"></span> </div> <div class="form-group"> <input type="password" name="password" class="form-control" placeholder="密码" id="password" > <span class="icon pswd-icon"></span> </div> <div class="checkbox icheck"> <label>记住密码</label> </div> <button  class="btn" id="mysubmit">登录</button> </div></div>').appendTo('body');

        bindEvent()
    }

    function bindEvent(){
        Page.on('click','.icheck',function(){
            $(this).find('label').toggleClass('active');
        }).on('click','#mysubmit',function(){
            var mysubmit= $('#mysubmit'),
                password= $('#password'),
                username=$('#username'),
                vusername =  username.val().trim(),
                vpassword = password.val().trim();
                if(!(vusername && vpassword))
                {
                    bainx.broadcast('用户名和密码不能为空');
                    return false;
                }
            var data = {
                m:vusername,
                hp:vpassword
            }
            Data.loginFromPwd(data).done(function(res){
                console.log(res);
                URL.assign(URL.csadPage);
            })
        })
    }
    init();

})