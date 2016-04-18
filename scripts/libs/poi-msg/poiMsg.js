$.extend({
    showPoiMsg: function(msg,e,msgClass) {
        var _class = 'danger';
		if(msgClass)
			_class = msgClass;
		var msgHtml = '<div id="flashMsg" style="padding:5px 10px;z-index: 999999;position: absolute;top:'+e.clientY+'px;left:'+e.clientX+'px" class="alert alert-'+_class+'" role="alert">'+msg+'</div>';
		$('body').append(msgHtml);
		$("#flashMsg").show();
		setTimeout(function(){
			$("#flashMsg").hide();
	        $("#flashMsg").remove();
		},3000);
    }
})