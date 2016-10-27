/**
 * Created by chenxiao on 2016/7/26.
 */
angular.module('app').controller("BatchJobPanelCtrl", ['$scope', '$interval', 'dsEdit','dsOutput',
    function($scope, $interval, dsEdit, dsOutput) {
        var logMsgCtrl = fastmap.uikit.LogMsgController($scope);
        $scope.myOption  = '1'
        $scope.radioModel = 'BATCH_SLE';
        $scope.showSelect = false;
        $scope.selectedBatches = '';

        $scope.$watch('radioModel',function(newValue,oldValue){
            if(newValue=='BATCH_SPEED_CLASS'){
                $scope.showSelect  = true;
            }else{
                $scope.showSelect  = false;
            }
        })

        $scope.changeParam = function(param){
            $scope.myOption = param;
        }

        $scope.doExecute = function() {
            //起始时间
            var batchType = 2;
            if($scope.radioModel=='BATCH_SLE'){
                $scope.selectedBatches = 'BATCH_SLE';
            }else if($scope.radioModel=='BATCH_SPEED_CLASS'){
                $scope.selectedBatches = 'BATCH_SPEED_CLASS:P_ASSIGN_WAY=>'+$scope.myOption;
            }else{
                $scope.selectedBatches = 'BATCH_POI_GUIDELINK';
                batchType = 1
            }
            if ($scope.selectedBatches.length == 0) {
                swal("请选择要执行的批处理", "", "info");
                return;
            } else {
                var param = {
                    taskId:App.Temp.subTaskId,
                    ruleCode:$scope.selectedBatches,
                    type:batchType
                }
                $scope.running = true;
                $scope.$emit("job-batch", {
                    status: 'begin'
                });
                dsEdit.exeOnlinebatch(param).then(function(data){
                    if(data){
                        $scope.closeAdvancedToolsPanel();
                        var timer = $interval(function() {
                            dsEdit.getJobById(data).then(function(d) {
                                if (d.status == 3 || d.status == 4) { //1-创建，2-执行中 3-成功 4-失败
                                    $interval.cancel(timer);
                                    $scope.progress = 100;
                                    $scope.$emit("job-batch", {
                                        status: 'end'
                                    });
                                    $scope.running = false;
                                    if (d.status == 3) {
                                        dsOutput.push({
                                            "op": "执行批处理执行成功",
                                            "type": "succ",
                                            "pid": data,
                                            "childPid": ""
                                        });
                                        logMsgCtrl.pushMsg($scope,'执行批处理任务'+data+'完成');
                                    } else {
                                        dsOutput.push({
                                            "op": "执行批处理执行失败",
                                            "type": "fail",
                                            "pid": data,
                                            "childPid": ""
                                        });
                                        logMsgCtrl.pushMsg($scope,'执行批处理任务'+data+'失败');
                                    }
                                }else{
                                    $interval.cancel(timer);
                                    if(d.status!=1||d.status!=2){
                                        $scope.$emit("job-batch", {
                                            status: 'end'
                                        });
                                        $scope.running = false;
                                        dsOutput.push({
                                            "op": "执行批处理执行异常",
                                            "type": "fail",
                                            "pid": data,
                                            "childPid": ""
                                        });
                                        logMsgCtrl.pushMsg($scope,'执行批处理任务'+data+'异常');
                                    }
                                }
                            });
                        }, 5000);

                    }
                })
            }
        };

    }
]);