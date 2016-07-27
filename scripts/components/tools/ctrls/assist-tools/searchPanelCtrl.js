/**
 * Created by chenxiao on 2016/7/26.
 */
angular.module('app').controller("SearchPanelCtrl", ['$scope', '$interval', 'dsEdit',
    function($scope, $interval, dsEdit) {
        $scope.searchText = null;
        $scope.running = false;
        $scope.progress = 0;
        $scope.doExecute = function() {
            if (!$scope.searchType) {
                swal("请选择一个搜索项", "", "info");
                return;
            } else if (!$scope.searchText) {
                swal("请输入要搜索的内容", "", "info");
                return;
            } else {
                $scope.running = true;
                $scope.$emit("job-search", {
                    status: 'begin'
                });
                swal("搜索执行中（模拟运行，服务正在调试中）！", "", "success");
                $scope.progress = 0;
                var loop = $interval(function() {
                    $scope.progress += 20;
                    if ($scope.progress == 100) {
                        clearInterval(loop);
                        $scope.running = false;
                        $scope.$emit("job-search", {
                            status: 'end'
                        });
                        // swal("搜索运行完成！", "", "success");
                    }
                }, 1000)
                return;
            }
        };
    }
]);