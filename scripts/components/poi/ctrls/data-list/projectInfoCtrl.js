angular.module('app').controller('ProjectInfoCtrl', ['$scope', function($scope) {
	$scope.$on("initPageInfo",function(event,data){
		$scope.projectInfo = data.projectInfo;
		$scope.projectType = data.projectType;
		$scope.projRemainTime  = data.projRemainTime;
		$scope.curSeason = data.curSeason;
		$scope.taskCnt = data.taskCnt;
	});
}]);