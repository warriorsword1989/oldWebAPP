(function($){
	$.fn.poiMsg = function(msg,e,msgClass){
		var defaults = {
			state:'danger',
			content:msg,
            event,e
		}
        var settings = $.extend(defaults,msgClass);
        if(msgClass)
            settings.state = msgClass;
		var settings = $.extend(defaults);
		var msgHtml = '<div id="flashMsg" style="padding:5px 10px;z-index: 9999;position: absolute;top:'+e.clientY+'px;left:'+e.clientX+'px" class="alert alert-'+settings.state+'" role="alert">'+msg+'</div>';
		$('body').append(msgHtml);
		$("#flashMsg").show();
		setTimeout(function(){
			$("#flashMsg").hide();
            $("#flashMsg").remove();
		},3000);
	}
})(jQuery)