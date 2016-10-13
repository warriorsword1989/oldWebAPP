/**
 * Created by chenxiao on 2016/7/26.
 */
angular.module('app').controller("BatchJobPanelCtrl", ['$scope', '$interval', 'dsEdit',
    function($scope, $interval, dsEdit) {
        $scope.batchBoxData = [];
        $scope.currentBatchItems = [];
        $scope.selectedBatches = [];
        $scope.currentPaging = 1;
        $scope.batchType=1;
        $scope.pageSize = 10;

        /**
         * 切换道路和poi批处理tab页;
         * @param type
         */
        $scope.switchBatchType = function(type){
            //$scope.currentPaging = 1;
            $scope.batchType = type;
            getBatchBox();
        }

        /**
         * 分页
         */
        $scope.pageChanged = function(){
            $scope.currentPaging = $scope.$$childHead.$$childHead.currentPaging
            getBatchBox($scope.currentPaging);
        }

        /**
         * 获取当前页所有批处理包;
         */
        function getBatchBox(){
            var param = {
                pageNumber:$scope.pageSize,
                currentPage:$scope.currentPaging,
                batchType:$scope.batchType
            };
            dsEdit.batchBox(param).then(function(data){
                $scope.batchBoxData = data;
                $scope.currentBatchItems = data.length?$scope.batchBoxData[0].rules:[];
                $scope.totalNum = data.length?data[0].total:0;
                for(var i=0;i<$scope.currentBatchItems.length;i++){
                    if($scope.selectedBatches.indexOf($scope.currentBatchItems[i].ruleCode)!=-1){
                        $scope.currentBatchItems[i].checked = true;
                    }
                }

            });
        }


        /**
         * 点击table行查询当前批处理包下的批处理规则;
         * @param param
         */
        $scope.getBatchItem = function(param){
            $scope.currentBatchItems = param.rules;
        }

        //全选或反选处理;
        $scope.batchSelect = function(param){
            if(param.checked){
                for(var i=0;i<$scope.currentBatchItems.length;i++){
                    $scope.currentBatchItems[i].checked = true
                }
            }else{
                for(var i=0;i<$scope.currentBatchItems.length;i++){
                    $scope.currentBatchItems[i].checked = false
                }
            }
            getAllBatchRules(param);
        }



        $scope.clickBatchSelect = function(param){
            getAllBatchRules(param);
        }

        //组装选中批处理规则;
        function getAllBatchRules(param){
            if(param.rules){//全选或反选
                if(param.checked){
                    for(var i=0;i<param.rules.length;i++){
                        if($scope.selectedBatches.indexOf(param.rules[i].ruleCode)==-1){
                            $scope.selectedBatches.push(param.rules[i].ruleCode)
                        }
                    }
                }else{
                    for(var i=0;i<param.rules.length;i++){
                        if($scope.selectedBatches.indexOf(param.rules[i].ruleCode)!=-1){
                            $scope.selectedBatches.splice($scope.selectedBatches.indexOf(param.rules[i].ruleCode),1);
                        }
                    }
                }
                console.log($scope.selectedBatches);
            }else{//单选
                if(param.checked){
                    if($scope.selectedBatches.indexOf(param.ruleCode)==-1){
                        $scope.selectedBatches.push(param.ruleCode)
                    }
                }else{
                    if($scope.selectedBatches.indexOf(param.ruleCode)!=-1){
                        $scope.selectedBatches.splice($scope.selectedBatches.indexOf(param.ruleCode),1);
                    }
                }
                console.log($scope.selectedBatches);
            }
        }


        $scope.running = false;
        $scope.progress = 0;

        $scope.doExecute = function() {
            if ($scope.selectedBatches.length == 0) {
                swal("请选择要执行的批处理", "", "info");
                return;
            } else {
                var param = {
                    taskId:App.Temp.subTaskId,
                    ruleCode:$scope.selectedBatches,
                    type:$scope.batchType
                }
                $scope.running = true;
                $scope.$emit("job-batch", {
                    status: 'begin'
                });
                dsEdit.exeOnlinebatch(param).then(function(data){
                    if(data){
                        $scope.closeAdvancedToolsPanel();
                    }
                })
            }
        };

        getBatchBox()

    }
]);