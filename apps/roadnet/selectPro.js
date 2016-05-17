var accessToken="";
$(document).ready(function(){
	accessToken=window.location.href.split("=")[1];
	var param = {
		"userId":1,
		"projectId":11
	};
	$.get(Application.url+'/project/grid/getByUser?parameter='+JSON.stringify(param),function(data){
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

	_html.push('<div class="box col-md-3 col-lg-3">');
	_html.push('<div class="img_box">');
	_html.push('<img class="img_box_img" src="../../images/road/img/beijing.png" alt="');

	_html.push("北京道路作业项目");
	_html.push('">');
	_html.push('<div class="img_box_caption">');
	_html.push('<h3 class="img_box_caption_h">');
	_html.push("北京道路作业项目");
	_html.push('</h3>');
	_html.push('<p class="img_box_caption_p">');
	if(true){
		_html.push('待作业Tips总量 <span class="label label-info">');
		_html.push('1234');
		_html.push('</span> 个</br>');
	}
	_html.push('项目ID：<span class="label label-info">');
	_html.push(11);
	_html.push('</span>');
	_html.push('</p>');
	_html.push('<a class="img_box_caption_a" href="project.html?proId=');
	_html.push(11);
	_html.push('"></a>');
	_html.push('</div>');
	_html.push('</div>');
	_html.push('<div class="img_box_title">');
	_html.push("北京道路作业项目");
	_html.push('</div>');
	_html.push('</div>');


	_html.push('<div class="box col-md-3 col-lg-3">');
	_html.push('<div class="img_box">');
	_html.push('<img class="img_box_img" src="../../images/road/img/beijing.png" alt="');

	_html.push("北京POI作业项目");
	_html.push('">');
	_html.push('<div class="img_box_caption">');
	_html.push('<h3 class="img_box_caption_h">');
	_html.push("北京POI作业项目");
	_html.push('</h3>');
	_html.push('<p class="img_box_caption_p">');
	if(true){
		_html.push('待作业Poi总量 <span class="label label-info">');
		_html.push('1234');
		_html.push('</span> 个</br>');
	}
	_html.push('项目ID：<span class="label label-info">');
	_html.push(11);
	_html.push('</span>');
	_html.push('</p>');
	_html.push('<a class="img_box_caption_a" href="project.html?access_token='+accessToken);
	_html.push(11);
	_html.push('"></a>');
	_html.push('</div>');
	_html.push('</div>');
	_html.push('<div class="img_box_title">');
	_html.push("北京POI作业项目");
	_html.push('</div>');
	_html.push('</div>');

	$(".project-list").html(_html.join(''));
}