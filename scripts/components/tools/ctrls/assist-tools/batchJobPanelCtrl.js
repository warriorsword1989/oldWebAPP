/**
 * Created by chenxiao on 2016/7/26.
 */
angular.module('app').controller("BatchJobPanelCtrl", ['$scope', '$interval', 'dsEdit',
    function($scope, $interval, dsEdit) {
        $scope.batchBoxData = [];
        $scope.currentBatchItems = [];
        $scope.selectedBatches = {};
        $scope.currentPaging = 1;
        $scope.batchType=1;
        $scope.pageSize = 1;

        //获取所有批处理包;
        function getBatchBox(){
            var param = {
                pageNumber:$scope.pageSize,
                currentPage:$scope.currentPaging,
                batchType:$scope.batchType
            };
            dsEdit.batchBox(param).then(function(data){
                $scope.batchBoxData = data;
                $scope.totalNum = data[0].total;
            });
        }

        //切换道路和poi批处理tab页;
        $scope.switchBatchType = function(type){
            $scope.batchType = type;
            getBatchBox();
        }

        $scope.pageChanged = function(){
            getBatchBox($scope.currentPaging);
        }

        //点击table行查询当前批处理包下的批处理规则;
        $scope.getBatchItem = function(param){
            $scope.currentBatchItems = param.rules;
            $scope.batchSelect(param);
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
        }


        //$scope.running = false;
        //$scope.progress = 0;

        //$scope.doExecute = function() {
        //    var batches = [];
        //    for (var key in $scope.selectedBatches) {
        //        if ($scope.selectedBatches[key]) {
        //            batches.push(key);
        //        }
        //    }
        //    if (batches.length == 0) {
        //        swal("请选择要执行的批处理", "", "info");
        //        return;
        //    } else {
        //        $scope.running = true;
        //        $scope.$emit("job-batch", {
        //            status: 'begin'
        //        });
        //        swal("自动录入服务启动成功（模拟运行，服务正在调试中）！", "", "success");
        //        $scope.progress = 0;
        //        var loop = $interval(function() {
        //            $scope.progress += 20;
        //            if ($scope.progress == 100) {
        //                clearInterval(loop);
        //                $scope.running = false;
        //                $scope.$emit("job-batch", {
        //                    status: 'end'
        //                });
        //                // swal("自动录入服务模拟运行完成！", "", "success");
        //            }
        //        }, 1000)
        //        return;
        //    }
        //};

        getBatchBox()

    }
]);