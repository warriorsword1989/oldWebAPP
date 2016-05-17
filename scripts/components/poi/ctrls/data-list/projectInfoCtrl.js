angular.module('app').controller('ProjectInfoCtrl', ['$scope', function($scope) {
	$scope.prjInfo = $scope.projectInfo;
	$scope.prjType = $scope.projectType;
	$scope.prjRemainTime  = $scope.projRemainTime;
	$scope.curSea = $scope.curSeason;
	$scope.taskCntt = $scope.taskCnt;
}]);