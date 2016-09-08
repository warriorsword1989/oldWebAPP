/**
 * Created by mali on 2016-08-10
 */
angular.module("app").controller("specialOperAdvanceToolsCtl", ["$scope", '$ocLazyLoad', 'appPath',
    function($scope, $ocLazyLoad, appPath) {
		$scope.roadNameBtnOpened = false;
		$scope.workPanelOpenClose = function(){
			$scope.roadNameBtnOpened = true;
			$scope.$emit("WORKPANELOPENCLOSE");
		};
    }
]);