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
            var start = new Date().getTime();
            if($scope.radioModel=='BATCH_SLE'){
                $scope.selectedBatches = 'BATCH_SLE';
            }else{
                $scope.selectedBatches = 'BATCH_SPEED_CLASS:P_ASSIGN_WAY=>'+$scope.myOption;
            }
            if ($scope.selectedBatches.length == 0) {
                swal("请选择要执行的批处理", "", "info");
                return;
            } else {
                var param = {
                    taskId:App.Temp.subTaskId,
                    ruleCode:$scope.selectedBatches,
                    type:2
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
                                    //返回函数执行需要时间
                                    var timeLog = parseInt((new Date().getTime() - start)/1000)+"秒";
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
                                            "pid": "0",
                                            "childPid": ""
                                        });
                                        logMsgCtrl.pushMsg($scope,'执行批处理任务'+data+'完成,共耗时'+timeLog);
                                    } else {
                                        dsOutput.push({
                                            "op": "执行批处理执行失败",
                                            "type": "fail",
                                            "pid": "0",
                                            "childPid": ""
                                        });
                                        logMsgCtrl.pushMsg($scope,'执行批处理任务'+data+'失败,共耗时'+timeLog);
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