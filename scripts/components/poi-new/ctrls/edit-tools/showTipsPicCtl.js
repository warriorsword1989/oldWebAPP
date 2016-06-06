angular.module('app').controller('ShowTipsPicCtl', ['$scope', '$uibModalInstance', '$image', function ($scope, $uibModalInstance, $image) {
	initImgs();
	function initImgs() {
		$scope.imageNow = $image;
		var originImg = angular.element("#poiTipsOriginImg");

		// originImg.attr('src',$image.url);
		originImg.attr('src','http://192.168.4.189/resources/photo/15win/2016013086/20160408/292520160408100333_13086.jpg');
		// originImg.smartZoom({'containerClass':'zoomableContainer'});
		wheelzoom(originImg);
	}


	$scope.ok = function () {
		// $uibModalInstance.close($scope.selected.item);
		console.log($image)
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}]);