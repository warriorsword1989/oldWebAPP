
$(document).ready(function(){

    $(window).bind("resize", function () {
        resizeWindow();
    });
    resizeWindow();

    $("#loginForm").submit(function(){
    	var $btn = $('#login_btn').button('loading')
    	var user = $.trim($("input[name='username']").val());
    	var psw = $.trim($("input[name='password']").val());
    	// swal("登录失败", '密码错误', "error");
		// alert(user,psw)
    	// $btn.button('reset')


        $.ajax({
            url:"http://192.168.4.189/fos/user/login/",
            data:{id: "liusha02925", secret: "029250",parameter:""},
            dataType:"Json",
            success:function(data){
                $btn.button('reset');
                //swal("登录失败", '服务器响应时间过长，请重试！');
                window.location.href="selectPro.html?access_token="+data.data.access_token;
            },
            error:function(){
                $btn.button('reset');
                //swal("登录失败", '服务器响应时间过长，请重试！');
                window.location.href="selectPro.html";
            }
        })
		return false
	})


    //用户名、密码清空
    $(".hasclear").keyup(function () {
        var t = $(this);
        t.siblings('span.clearer').toggle(Boolean(t.val()));
    });

    $(".clearer").hide($(this).siblings('input').val());

    $(".clearer").click(function () {
        $(this).siblings('input').val('').focus();
        $(this).hide();
    });
});

function resizeWindow(){
    var tmpHeight = $("#formContainer").parent().height() - $("#formContainer").height();
    var formTop = tmpHeight / 2;
    $("#formContainer").css("top", formTop);
}
