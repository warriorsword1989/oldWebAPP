/**
 * Created by mali on 2016-08-10
 */
angular.module("app").controller("specialOperAdvanceToolsCtl", ["$scope", '$ocLazyLoad', 'appPath',
    function($scope, $ocLazyLoad, appPath) {
		$scope.workPanelOpenClose = function(){
			$scope.$emit("WORKPANELOPENCLOSE");
		};
    }
]);