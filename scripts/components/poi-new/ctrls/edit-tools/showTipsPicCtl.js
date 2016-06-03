angular.module('app').controller('ShowTipsPicCtl', ['$scope', '$uibModalInstance', '$image' ,'$index', '$imgs', function ($scope, $uibModalInstance, $image ,$index, $imgs) {
	initImgs();
	function initImgs() {
		$scope.imageNow = $image;
		$scope.indexNow = $index + 1;
		$scope.imgsLength = $imgs.length;
		console.log($imgs)
		wheelzoom(document.getElementById("poiTipsOriginImg"), {zoom:0.05});
	}


	$scope.ok = function () {
		// $uibModalInstance.close($scope.selected.item);
		console.log($image)
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}]);