$(document).ready(function(){
	var param = {
		"userId":1
	};
	$.get(Application.url+'/man/project/getByUser?parameter='+JSON.stringify(param),function(data){
        data = JSON.parse(data);
        if(data.errcode == 0){
			initProHtml(data.data);
		}else{
    		swal("查询失败", '请重试！','error');
		}
    })
});
function initProHtml(projects){
	var _html = [];
	$.each(projects,function(i,v){
		_html.push('<div class="box col-md-3 col-lg-3">');
		_html.push('<div class="img_box">');
		_html.push('<img class="img_box_img" src="http://img05.tooopen.com/images/20150307/tooopen_sy_81814762458.jpg" alt="');
		_html.push(v.projectName);
		_html.push('">');
		_html.push('<div class="img_box_caption">');
		_html.push('<h3 class="img_box_caption_h">');
		_html.push(v.projectName);
		_html.push('</h3>');
		_html.push('<p class="img_box_caption_p">');
		if(v.tipsNum){
			_html.push('待作业Tips总量 <span class="label label-info">');
			_html.push('1234');
			_html.push('</span> 个</br>');
		}
		_html.push('项目ID：<span class="label label-info">');
		_html.push(v.projectId);
		_html.push('</span>');
		_html.push('</p>');
		_html.push('<a class="img_box_caption_a" href="main1.html?proId=');
		_html.push(v.projectId);
		_html.push('"></a>');
		_html.push('</div>');
		_html.push('</div>');
		_html.push('<div class="img_box_title">');
		_html.push(v.projectName);
		_html.push('</div>');
		_html.push('</div>');
        
	});
	$(".project-list").html(_html.join(''));
}