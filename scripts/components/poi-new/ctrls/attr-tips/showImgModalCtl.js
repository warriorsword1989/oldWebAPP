angular.module('app').controller('ShowImgModalCtl', ['$scope', function ($scope) {
	initImgs();
	function initImgs() {
		$scope.imgList = [];
		for (var i = 0, len = $scope.poi.tempPhotos.length; i < len; i++) {
			if ($scope.poi.tempPhotos[i].nothing == false) {
				$scope.imgList.push($scope.poi.tempPhotos[i]);
			}
		}
		$scope.imgNowSrc = 'http://192.168.4.189/resources/photo/15win/2016013086/20160408/292520160408100333_13086.jpg';
	}
	/*上传后更新图片数组*/
	$scope.$on('refreshImgsData',function(event,data){
		$scope.poi.tempPhotos = data;
		initImgs();
	});
	/*点击切换图片显示*/
	$scope.$on('changeImgShow',function(event,data){
		$scope.indexNow = data.index;
		$scope.imageNow = data.img;
	});
	/*上一张*/
	$scope.showImgNext = function () {
		$scope.indexNow++;
		$scope.imageNow = $scope.imgList[$scope.indexNow - 1];
	};
	/*下一站*/
	$scope.showImgPre = function () {
		$scope.indexNow--;
		$scope.imageNow = $scope.imgList[$scope.indexNow - 1];
	};
	/*全屏*/
	$scope.imgFullScreen = function(){
		$scope.$emit('showFullScreen',$scope.imageNow);
	}

	$scope.closeTipsImg = function () {
		$scope.$emit('closeTipsImg',false);
	};
}]).directive('imgShow', function () {
	return {
		link: function (scope, element, attr) {
			wheelzoom(element);
		}
	}
});