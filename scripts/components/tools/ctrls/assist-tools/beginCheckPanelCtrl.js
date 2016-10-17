/**
 * Created by linglong on 2016/9/13.
 */
angular.module('app').controller("BeginCheckPanelCtrl", ['$scope', '$interval', 'dsEdit','dsOutput',
    function($scope, $interval, dsEdit, dsOutput) {
        var logMsgCtrl = fastmap.uikit.LogMsgController($scope);
        $scope.searchBoxData = [];

        $scope.selectedBatches = [];
        $scope.pageSize = 10;
        $scope.page = 1;
        $scope.batchType = 0;
        $scope.dataLoading = true;
        $scope.currentBoxIndex = 0;

        /**
        * 切换道路和poi批处理tab页;
        * @param type
        */
        $scope.switchBatchType = function(type){
            //$scope.selectedBatches = [];
            $scope.batchType = type;
            getSeachBox();
        }

        //点击table行查询当前批处理包下的批处理规则;
        $scope.getCheckItem = function(param){
            $scope.currentBoxIndex = param;
        }

        //获取所有批处理包;
        function getSeachBox(){
            $scope.dataLoading = true;
            var params = {
                pageNumber:$scope.pageSize,
                currentPage:$scope.page,
                checkType:$scope.batchType
            }
            dsEdit.seachCheckBox(params).then(function(data){
                $scope.searchBoxData = data;
                for(var i=0;i<$scope.searchBoxData.length;i++){
                    for(var j=0;j<$scope.searchBoxData[i].rules.length;j++){
                        $scope.searchBoxData[i].rules[j].checked = false;
                    }
                }
                $scope.dataLoading = false;
            });
        }

        //全选或反选处理;
        $scope.batchSelect = function(index){
            if($scope.searchBoxData[index].checked){
                for(var i=0;i<$scope.searchBoxData[index].rules.length;i++){
                    $scope.searchBoxData[index].rules[i].checked = true;
                }
            }else{
                for(var i=0;i<$scope.searchBoxData[index].rules.length;i++){
                    $scope.searchBoxData[index].rules[i].checked = false
                }
            }
        }


        $scope.running = false;
        $scope.progress = 0;
        $scope.doExecute = function() {
            //起始时间
            var start = new Date().getTime();
            $scope.selectedBatches = [];
            for(var i=0;i<$scope.searchBoxData.length;i++){
                for(var j=0;j<$scope.searchBoxData[i].rules.length;j++){
                    if($scope.searchBoxData[i].rules[j].checked){
                        $scope.selectedBatches.push($scope.searchBoxData[i].rules[j].ruleCode)
                    }
                }
            }
            $scope.selectedBatches = Utils.distinctArr($scope.selectedBatches);
            if ($scope.selectedBatches.length == 0) {
                swal("请选择要执行的检查项", "", "info");
                return;
            } else {
                var param = {
                    taskId:App.Temp.subTaskId,
                    ruleCode:$scope.selectedBatches.join(','),
                    type:$scope.batchType
                }
                $scope.running = true;
                $scope.$emit("job-check", {
                    status: 'begin'
                });
                dsEdit.exeOnlineSearch(param).then(function(data){
                    if(data){
                        $scope.closeAdvancedToolsPanel();
                        var timer = $interval(function() {
                            dsEdit.getJobById(data).then(function(d) {
                                if (d.status == 3 || d.status == 4) { //1-创建，2-执行中 3-成功 4-失败
                                    //返回函数执行需要时间
                                    var timeLog = parseInt((new Date().getTime() - start)/1000)+"秒";
                                    $interval.cancel(timer);
                                    $scope.progress = 100;
                                    $scope.$emit("job-check", {
                                        status: 'end'
                                    });
                                    $scope.running = false;
                                    if (d.status == 3) {
                                        dsOutput.push({
                                            "op": "执行检查执行成功",
                                            "type": "succ",
                                            "pid": "0",
                                            "childPid": ""
                                        });
                                        logMsgCtrl.pushMsg($scope,'执行检查任务'+data+'完成,共耗时'+timeLog);
                                    } else {
                                        dsOutput.push({
                                            "op": "执行检查执行失败",
                                            "type": "fail",
                                            "pid": "0",
                                            "childPid": ""
                                        });
                                        logMsgCtrl.pushMsg($scope,'执行检查任务'+data+'失败,共耗时'+timeLog);
                                    }
                                }
                            });
                        }, 5000);

                    }
                })
            }
        };


        getSeachBox()

    }
]);
