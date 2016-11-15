/**
 * Created by mali on 2016/8/15.
 */
angular.module('app').controller('SplitSubModalCtl', ['$scope', '$ocLazyLoad', 'appPath', '$interval', 'dsMeta',
    function ($scope, $ocLazyLoad, appPath, $interval, dsMeta) {
        $scope.dataFlag = '2';
        $scope.doSplit = function () {
            var param = {};
            if ($scope.dataFlag == 1) { // 拆分选中的数据
                if ($scope.getSelectedData().length == 0) {
//					swal("请先选择要拆分的数据", "", "info");
                    swal({
                        title: '请先选择要拆分的数据',
                        type: 'info',
                        showCancelButton: false,
                        closeOnConfirm: true,
                        confirmButtonText: '确定'
                    }, function (f) {
                        if (f) {
                            $scope.closeSubModal();
                            $scope.$apply();
                        }
                    });
//					$scope.closeSubModal();
                    return;
                }
                param = {
                    flag: 1,
                    data: $scope.getSelectedData(),
                    dbId: App.Temp.dbId
                };
            } else if ($scope.dataFlag == 2) { // 拆分子任务下所有的数据
                param = {
                    flag: -1,
                    subtaskId: parseInt(App.Temp.subTaskId),
                    dbId: App.Temp.dbId
                };
            }
            dsMeta.rdnameSplit(param).then(function (data) {
                if (data) {
                    swal({
                        title: '拆分成功',
                        type: 'info',
                        showCancelButton: false,
                        closeOnConfirm: true,
                        confirmButtonText: '确定'
                    }, function (f) {
                        if (f) {
                            $scope.$emit('REFRESHROADNAMELIST');
//							$scope.$apply();
                            $scope.closeSplitSubModal();
                        }
                    });
                }
            });
        };
    }
]);
