/**
 * Created by chenxiao on 2016/7/26.
 */
angular.module('app').controller("BatchJobPanelCtrl", ['$scope', '$interval', 'dsEdit',
    function($scope, $interval, dsEdit) {

        //$scope.poiBatchList = [{
        //    check:false,
        //    id: '110',
        //    name: 'POI批处理1',
        //    rule:[{
        //        id: '1',
        //        name: 'POI处理规则1',
        //        check:false,
        //        pid:'110'
        //    }, {
        //        id: '2',
        //        name: 'POI处理规则2',
        //        check:false,
        //        pid:'110'
        //    }, {
        //        id: '3',
        //        name: 'POI处理规则3',
        //        check:false,
        //        pid:'110'
        //    }, {
        //        id: '4',
        //        name: 'POI处理规则4',
        //        check:false,
        //        pid:'110'
        //    }]
        //}, {
        //    check:false,
        //    id: '120',
        //    name: 'POI批处理2',
        //    rule:[{
        //        id: '1',
        //        name: 'POI处理规则1',
        //        check:false
        //    }, {
        //        id: '2',
        //        name: 'POI处理规则2',
        //        check:false
        //    }]
        //}, {
        //    check:false,
        //    id: '130',
        //    name: 'POI批处理3',
        //    rule:[{
        //        id: '1',
        //        name: 'POI处理规则1',
        //        check:false
        //    }, {
        //        id: '2',
        //        name: 'POI处理规则2',
        //        check:false
        //    }]
        //}, {
        //    check:false,
        //    id: '140',
        //    name: 'POI批处理4',
        //    rule:[{
        //        id: '1',
        //        name: 'POI处理规则1',
        //        check:false
        //    }]
        //}];




        $scope.currentRuleDatas = $scope.poiBatchList[0].rule;
        $scope.setCurrentRules = function(param){
            $scope.currentRuleDatas = param.rule;
        }
        $scope.watchObject = function(param){

        }

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