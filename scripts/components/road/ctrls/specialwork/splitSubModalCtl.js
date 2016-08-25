/**
 * Created by mali on 2016/8/15.
 */
angular.module('app').controller("SplitSubModalCtl", ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsMeta',
    function($scope, $ocLazyLoad, appPath, $interval, dsMeta) {
		$scope.dataFlag = "2";
		$scope.doSplit = function(){
			var param = {};
			if(1 == $scope.dataFlag){//拆分选中的数据
				if(0 == $scope.getSelectedData().length){
//					swal("请先选择要拆分的数据", "", "info");
					swal({
						title: "请先选择要拆分的数据",
						type: "info",
						showCancelButton: false,
						closeOnConfirm: true,
						confirmButtonText: "确定",
					}, function (f) {
						if(f){
							$scope.closeSubModal();
							$scope.$apply();
						}
					});
//					$scope.closeSubModal();
					return;
				}
				param = {
						flag : 1,
						data : $scope.getSelectedData()
					};
				
			}else if(2 == $scope.dataFlag){//拆分子任务下所有的数据
				param = {
					flag : -1,
					subtaskId : parseInt(App.Temp.subTaskId)
				};
			};
			dsMeta.rdnameSplit(param).then(function(data) {
				if(data){
					$scope.$emit("REFRESHROADNAMELIST");
					swal("拆分成功", "", "info");
				}
				$scope.closeSubModal();
            });
		};
	}
]);