var showBoxApp = angular.module('app');
//var showBoxApp = angular.module('showBoxApp', []);
showBoxApp.directive("showbox",function ($timeout){
	return {
		restrict:"EA",
		templateUrl:'../../scripts/components/poi/tpls/attr-base/showBox-template.htm',
		transclude:true,  
		replace:true ,//false,
		link: function(scope, el, attr, ctrls){
			var showboxHeight = el[0].scrollHeight;
			var showboxWidth = el[0].scrollWidth;
			var parentNode = el[0].parentNode;
			var extalContentHeight = el[0].getElementsByClassName('extalContent')[0].scrollHeight;
			var thumbsHeight = el[0].getElementsByClassName('thumbs')[0].scrollHeight;

			var imageHeight = showboxHeight - extalContentHeight - thumbsHeight;
			//el[0].getElementsByClassName('image')[0].style.height = imageHeight +'px';

			scope.imageBoxStyle.height = imageHeight + "px";
			scope.imageBoxStyle.width = showboxWidth + "px";

			//设置弹出层的大小
			el[0].getElementsByClassName('showboxModal')[0].style.height = parentNode.scrollHeight +'px';
			el[0].getElementsByClassName('showboxModal')[0].style.width = parentNode.scrollWidth +'px';

			scope.dataTipsOriginImg.height = scope.dataTipsOriginImg.maxHeight =  parentNode.scrollHeight - 100 +'px';
			scope.dataTipsOriginImg.width = scope.dataTipsOriginImg.maxWidth =  parentNode.scrollWidth  - 100  +'px';

			//console.info("imageBoxStyle:",scope.imageBoxStyle);
			scope.imageModelStyle = {};
			scope.imageModelStyle.height = showboxHeight + "px";
		}
	}
});

showBoxApp.controller("showBoxCtrl",['$scope','$timeout',function ($scope,$timeout){
	var imagesObj = {};
		imagesObj.pageNo = 0;
		imagesObj.rotate = 0;

	$scope.imageBoxStyle = {}; //定义图片外层DIV的样式
	$scope.imageArrayStyle = []; //用于存储‘计算的图片的显示大小以及距顶高度’
	$scope.imgStyle = { "height":"0px", "width":"0px",'margin-top':'0px'};
	$scope.imgs = [] ;//存储图片
	$scope.isActive ;//选中缩略图,值是index
	$scope.thumbsListUiStyle = {};
	//控制窗口的样式
	$scope.imageOriginModal = { 'display':'none'}
	//控制旋转的样式
	$scope.dataTipsOriginImg = { "transform":"", "rotate":"", "transform":""}

	// $scope.$on("loadImages", function (event,data){
	// 	console.info("loadImages+++++++++++++++++++++=",data);
	// 	initImages(data);
	// });
	$scope.imgs = $scope.$parent.imagesArray;


    $scope.$watch("imagesArray", function(o,obj,scope) {
    	console.info('imagesArray:',scope)
    	/*$scope.imgs = $scope.$parent.imagesArray;
		$scope.deleteable = $scope.$parent.deleteable;
		initImages()*/
    });

	var initImages = function (data){
		$scope.imgs = data.imgArray;
		$scope.deleteable = data.flag;

		$scope.imgsInfo = [];
		for (var i = 0 ; i < data.imgArray.length ; i++){
			var img = data.imgArray[i];
			var newImg = new Image();  //生成Image对象，目的是为了拿到图片的原始大小
			newImg.src = img.url;

			var oH = newImg.naturalHeight;
			var oW = newImg.naturalWidth;

			var imageBoxHeight = $scope.imageBoxStyle.height;
			var imageBoxWidth = $scope.imageBoxStyle.width;
			imageBoxHeight = imageBoxHeight.substring(0,imageBoxHeight.length-2);
			imageBoxWidth = imageBoxWidth.substring(0,imageBoxWidth.length-2);

			var rH = imageBoxHeight / oH;
			var rW = imageBoxWidth / oW;
	      	
	      	var r = rW <= rH ? rW : rH;
	      	var imageStyle = {};
	      	if (r < 1) {
	      		imageStyle.height = Math.floor(oH * r) + "px";
	          	imageStyle.width = Math.floor(oW * r) + "px";
	      	} else {
	      		imageStyle.height = oH + "px";
	      		imageStyle.width = oW + "px";
	      	}
	      
      		imgHei = imageStyle.height.substring(0,imageStyle.height.length-2);
      		var off = imageBoxHeight - imgHei;
      		imageStyle['margin-top'] = Math.ceil(off / 2) + "px";

			$scope.imageArrayStyle.push(imageStyle);
		}

		$scope.selectPic(0);
	}

	$scope.deleteImag = function() {
		if($scope.imgs.length <=0 ){
			return ;
		}
		$scope.imageArrayStyle.splice(imagesObj.selectIndex,1)

		if (imagesObj.selectIndex == $scope.imgs.length - 1) {
			$scope.imgs.splice(imagesObj.selectIndex,1)
			imagesObj.selectIndex = 0;
			
			$scope.thumbsListUiStyle["margin-top"] = "0px";
			$scope.imgStyle = $scope.imageArrayStyle[0];
			$scope.isActive = 0;
		} else {
			$scope.imgs.splice(imagesObj.selectIndex,1)
			$scope.imgStyle = $scope.imageArrayStyle[imagesObj.selectIndex];
		}

		if ($scope.imgs.length == 0) {
			$scope.selectUrl = ' '
			$scope.deleteable = false
		} else {
			imagesObj.selectUrl = $scope.imgs[imagesObj.selectIndex].url;
			$scope.selectUrl = imagesObj.selectUrl;
		}
	}

	// 上一页
	$scope.prev = function(arg1, arg2) {
		changePage(0);
	}
	// 下一页
	$scope.next = function(event, t) {
		changePage(1);
	}
	// 选中图片
	$scope.selectPic = function(index) {
		$scope.selectUrl = $scope.imgs[index].url;
		$scope.selectIndex = index ;
		imagesObj.selectUrl = $scope.imgs[index].url;
		imagesObj.selectIndex = index;

		$scope.imgStyle = $scope.imageArrayStyle[index];
		$scope.isActive = index;

		$scope.tagSelected = $scope.imgs[index].tag;
		//console.info($scope.imgStyle,$scope.isActive);
	}

	// 1下页 0上页
	var changePage = function(type) {
		var thumbsList = document.getElementsByClassName("thumbs-list");
		var li = document.getElementsByClassName("thumbs-list-li");
		var w1 = thumbsList[0].clientWidth;
		var w2 = li[0].clientWidth;
		var h2 = li[0].clientHeight;
		imagesObj.pageSize = Math.floor(w1 / w2);
		imagesObj.pageCnt = Math.ceil($scope.imgs.length / imagesObj.pageSize);
		if(imagesObj.pageNo < 0 || imagesObj.pageNo + 1 > imagesObj.pageCnt){
			alert();
			return ;
		}
		if (type) {
			if (imagesObj.pageNo < imagesObj.pageCnt - 1) {
				var margin = ++imagesObj.pageNo * h2;

				$scope.thumbsListUiStyle["margin-top"] = "-" + margin + "px";
				
			}
		} else {
			if (imagesObj.pageNo > 0) {
				var margin = --imagesObj.pageNo * h2;
				$scope.thumbsListUiStyle["margin-top"] = "-" + margin + "px";
			}
		}
		$scope.selectPic(imagesObj.pageNo * imagesObj.pageSize);
	}
	$scope.closePicContainer = function (){
		$scope.imageOriginModal.display = 'none';
		$scope.selectPic(0);
		$scope.thumbsListUiStyle["margin-top"] = '0px';
	}

	$scope.switchPic = function (flag){
		$scope.dataTipsOriginImg.transform = '';
		if (flag) { //下一条
			if ($scope.selectIndex !=  $scope.imgs.length -1) {
				$scope.selectUrl = $scope.imgs[++$scope.selectIndex].url;
			}
		} else {  //上一条
			if ($scope.selectIndex > 0) {
				$scope.selectUrl = $scope.imgs[--$scope.selectIndex].url;
			}
		}
		$scope.imgTagName = getTagName($scope.imgs[$scope.selectIndex].tag);
	}
	$scope.rotateImage = function (flag){
		var rotate = $scope.dataTipsOriginImg.rotate ;
		if (!rotate){
			rotate = 0;
		}
		if (flag) {
			rotate = parseInt(rotate) + 90;
		} else {
			rotate = parseInt(rotate) - 90;
		}
		$scope.dataTipsOriginImg.rotate = rotate;
		$scope.dataTipsOriginImg.transform = 'rotate('+rotate+'deg)';
	}
	//打开弹出层显示图片
	$scope.expandImage = function (){
		if($scope.imgs.length > 0){
			$scope.selectUrl = imagesObj.selectUrl;
			$scope.imageOriginModal.display = 'inline';
		}
		
		$scope.imgTagName = getTagName($scope.imgs[$scope.selectIndex].tag);
	}

	$scope.tagKeyValue = [
		{key:0,value:'请选择'},
		{key:1,value:'全貌'},
		{key:2,value:'水牌'},
		{key:3,value:'名称'},
		{key:4,value:'名牌'},
		{key:5,value:'英文名'}
	];


	function getTagName(key){
		var name = "";
		switch (key) {
			case 1:
				name  = "全貌";
				break;
			case 2:
				name  = "水牌";
				break;
			case 3:
				name  = "名称";
				break;
			case 4:
				name  = "名牌";
				break;
			case 5:
				name  = "英文名";
				break;
			default:
				break;
		}
		return name
	}

	$scope.imageTagChange = function (tagSelected){
		$scope.imgs[imagesObj.selectIndex].tag = tagSelected;
	}
	$scope.imageFilterChange = function (){
		initImages($scope.imgs,$scope.deleteable);
	}
}]);