layer.config({skin: 'my-skin'});
$(function() {
    validateRule();
});
//提交前验证
$.validator.setDefaults({
    submitHandler: function() {
		login();
    }
});
//忘记密码
function forgePassword() {
	$.modal.alert("忘记密码请联系当地所属管理工会重置修改","modal_status.WARNING");
}
//登录
function login() {

    var that = this
    var systemCode =''
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        systemCode= decodeURIComponent(str.split("=")[1]);
    }
    if(systemCode === ''){
        layer.msg("请联系管理员配置系统", {icon: 2, time: 1000})
    }else{
        $.modal.loading($("#btnSubmit").data("loading"));
        var username = $.common.trim($("input[name='username']").val());
        var password = $.common.trim($("input[name='password']").val());
        var systemCode = systemCode;
        $.ajax({
            type: "post",
            url: userUrl+"/sso/ssoUser/login/name",
            data: {
                "userName": username,
                "password": password,
                "systemCode": systemCode
            },
            cache: false,  //禁用缓存
            dataType: "json",
            contentType: "application/x-www-form-urlencoded",
            success: function(r) {
                if (r.code == 0) {
                    if(r.data=='PASSWORD_ERROR'){
                        $.modal.closeLoading();
                        $.modal.msgError("用户名密码不匹配");
                    }else if(r.data=='USER_NAME_NOT_EXIST'){
                        $.modal.closeLoading();
                        $.modal.msgError("用户名不存在");
                    }else{
                        if ($("#rememberme").get(0).checked) {
                            window.localStorage.setItem("remlaborName",username);
                            window.localStorage.setItem("remlaborPass",password)
                        }else{
                            window.localStorage.removeItem("remlaborName");
                            window.localStorage.removeItem("remlaborPass")
                        }
                        window.sessionStorage.setItem("isLogin",1);
                        location.href = 'index.html?systemCode='+systemCode;
                    }
                } else {
                    $.modal.closeLoading();
                    $.modal.msgError(r.msg);
                }
            },
            error: function(r) {
                $.modal.msgError("系统繁忙请稍后再登录");
            }
        });
    }

}
//用户名密码验证
function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupForm").validate({
        rules: {
            username: {
                required: true
            },
            password: {
                required: true
            }
        },
        messages: {
            username: {
                required: icon + "请输入您的用户名",
            },
            password: {
                required: icon + "请输入您的密码",
            }
        }
    })
}
