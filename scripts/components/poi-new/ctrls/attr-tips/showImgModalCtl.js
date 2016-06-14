angular.module('app').controller('ShowImgModalCtl', ['$scope', function ($scope) {
	/*点击切换图片显示*/
	$scope.$on('changeImgShow',function(event,data){
		$scope.indexNow = data.index;
		$scope.imageNow = data.img;
	});
	/*上一张*/
	$scope.showImgNext = function () {
		$scope.indexNow++;
		$scope.imageNow = $scope.poi.photos[$scope.indexNow - 1];
	};
	/*下一站*/
	$scope.showImgPre = function () {
		$scope.indexNow--;
		$scope.imageNow = $scope.poi.photos[$scope.indexNow - 1];
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