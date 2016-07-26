/**
 * Created by liwanchong on 2015/10/28.
 */
angular.module('app').controller("BatchJobPanelCtrl", ['$scope', '$interval', 'dsEdit',
    function($scope, $interval, dsEdit) {
        $scope.batchList = [{
            id: '110',
            name: '道路Urban'
        }, {
            id: '120',
            name: '道路ZoneID'
        }, {
            id: '130',
            name: '道路ADID'
        }, {
            id: '140',
            name: 'POI引导线'
        }];
        $scope.selectedBatches = {};
        $scope.running = false;
        $scope.progress = 0;
        $scope.doExecute = function() {
            var batches = [];
            for (var key in $scope.selectedBatches) {
                if ($scope.selectedBatches[key]) {
                    batches.push(key);
                }
            }
            if (batches.length == 0) {
                swal("请选择要执行的批处理", "", "info");
                return;
            } else {
                $scope.running = true;
                $scope.$emit("job-batch", {
                    status: 'begin'
                });
                swal("自动录入服务启动成功（模拟运行，服务正在调试中）！", "", "success");
                $scope.progress = 0;
                var loop = $interval(function() {
                    $scope.progress += 20;
                    if ($scope.progress == 100) {
                        clearInterval(loop);
                        $scope.running = false;
                        $scope.$emit("job-batch", {
                            status: 'end'
                        });
                        // swal("自动录入服务模拟运行完成！", "", "success");
                    }
                }, 1000)
                return;
            }
        };
    }
]);