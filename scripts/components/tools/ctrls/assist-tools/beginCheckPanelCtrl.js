/**
 * Created by linglong on 2016/9/13.
 */
angular.module('app').controller("BeginCheckPanelCtrl", ['$scope', '$interval', 'dsEdit',
    function($scope, $interval, dsEdit) {
        $scope.searchBoxData = [];
        $scope.searchBoxDataItems = [];
        $scope.currentSearchItems = [];

        $scope.selectedBatches = [];
        $scope.pageSize = 10;
        $scope.page = 1;
        $scope.batchType = 0;



        /**
        * 切换道路和poi批处理tab页;
        * @param type
        */
        $scope.switchBatchType = function(type){
            $scope.batchType = type;
            getSeachBox();
        }

        //获取所有批处理包;
        function getSeachBox(){
            var params = {
                pageNumber:$scope.pageSize,
                currentPage:$scope.page,
                checkType:$scope.batchType,
            }
            dsEdit.seachCheckBox(params).then(function(data){
                $scope.searchBoxData = data;
                //获取当前显示的检查项，默认为第一个检查项下的数据;
                $scope.currentSearchItems = data.length?$scope.searchBoxData[0].rules:[];
            });
        }

        //点击table行查询当前批处理包下的批处理规则;
        $scope.getCheckItem = function(param){
            $scope.currentSearchItems = param.rules;
        }


        //全选或反选处理;
        $scope.batchSelect = function(param){
            if(param.checked){
                for(var i=0;i<$scope.currentSearchItems.length;i++){
                    $scope.currentSearchItems[i].checked = true
                }
            }else{
                for(var i=0;i<$scope.currentSearchItems.length;i++){
                    $scope.currentSearchItems[i].checked = false
                }
            }
            getAllBatchRules(param);
        }

        //单个选择处理;
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
                swal("请选择要执行的检查项", "", "info");
                return;
            } else {
                var param = {
                    taskId:App.Temp.subTaskId,
                    ruleCode:$scope.selectedBatches,
                    type:$scope.batchType
                }
                $scope.running = true;
                //$scope.$emit("job-search", {
                //    status: 'begin'
                //});
                dsEdit.exeOnlineSearch(param).then(function(data){
                    if(data){
                        $scope.closeAdvancedToolsPanel();
                    }
                })
            }
        };


        getSeachBox()

    }
]);
