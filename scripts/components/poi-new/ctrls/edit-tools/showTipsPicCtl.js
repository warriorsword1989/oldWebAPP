angular.module('app').controller('ShowTipsPicCtl', ['$scope', '$uibModalInstance', '$image', function ($scope, $uibModalInstance, $image) {
	initImgs();
	function initImgs() {
		$scope.imageNow = $image;
		var originImg = angular.element("#poiTipsOriginImg");
		originImg.attr('src',$image.url);
		// originImg.smartZoom({'containerClass':'zoomableContainer'});
	}

	$scope.ok = function () {
		// $uibModalInstance.close($scope.selected.item);
		console.log($image)
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}]);