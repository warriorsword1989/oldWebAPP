angular.module('app').controller('ShowTipsPicCtl', ['$scope', '$uibModalInstance', '$image', '$index', '$imgs', function ($scope, $uibModalInstance, $image, $index, $imgs) {
	initImgs();
	function initImgs() {
		$scope.imageNow = $image;
		$scope.indexNow = $index + 1;
		$scope.imgList = [];
		for (var i = 0, len = $imgs.length; i < len; i++) {
			if ($imgs[i].nothing == false) {
				$scope.imgList.push($imgs[i]);
			}
		}
		$scope.imgNowSrc = 'http://192.168.4.189/resources/photo/15win/2016013086/20160408/292520160408100333_13086.jpg';
	}
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
		// $scope.showFullScreen = true;
	}
	$scope.ok = function () {
		// $uibModalInstance.close($scope.selected.item);
		console.log($image)
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}]).directive('imgShow', function () {
	return {
		link: function (scope, element, attr) {
			wheelzoom(element);
			console.log(element)
		}
	}
});