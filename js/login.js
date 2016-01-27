
$(document).ready(function(){
    $("#loginForm").submit(function(){
    	var $btn = $('#login_btn').button('loading')
    	var user = $.trim($("input[name='username']").val());
    	var psw = $.trim($("input[name='password']").val());
    	// swal("登录失败", '密码错误', "error");
		// alert(user,psw)
    	// $btn.button('reset')
    	setTimeout(function() {
    		$btn.button('reset');
    		swal("登录失败", '服务器响应时间过长，请重试！');
    	}, 5000);
		return false
	})
});