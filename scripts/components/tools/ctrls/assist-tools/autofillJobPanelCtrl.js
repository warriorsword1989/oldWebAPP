/**
 * Created by chenxiao on 2016/7/26.
 */
angular.module('app').controller("AutofillJobPanelCtrl", ['$scope', '$interval', 'dsFcc', 'dsEdit',
    function($scope, $interval, dsFcc, dsEdit) {
		    var logMsgCtrl = fastmap.uikit.LogMsgController($scope);
        $scope.tipList = [];
        $scope.selectedTips = {};
        // var stages;
        // if (App.Temp.mdFlag == "d") { //日编
        //     stages = [1, 2];
        // } else { //月编
        //     stages = [1, 2, 3];
        // }
        // dsFcc.getTipsStatics(stages).then(function(data) {
        //     var list = [],
        //         tmp;
        //     for (var i = 0, n = data.data.rows.length; i < n; i++) {
        //         for (var item in data.data.rows[i]) {
        //             tmp = {};
        //             tmp.id = item;
        //             tmp.name = fastmap.uikit.FeatureConfig.tip[item].name;
        //             $scope.tipList.push(tmp);
        //         }
        //     }
        // });
        $scope.tipsObj = fastmap.uikit.FeatureConfig.tip;
        $scope.running = false;
        $scope.progress = 0;
        $scope.doExecute = function() {
            var tips = [];
            $scope.progress = 0;
            for (var key in $scope.selectedTips) {
                if ($scope.selectedTips[key]) {
                    tips.push(key);
                }
            }
            if (tips.length == 0) {
                swal("请选择要录入的Tips", "", "info");
                return;
            } else {
                $scope.running = true;
                $scope.$emit("job-autofill", {
                    status: 'begin'
                });
                dsFcc.runAutomaticInput(tips).then(function(data){
                  $scope.progress = 100;
                  $scope.running = false;
                  $scope.$emit("job-autofill", {
                      status: 'end'
                  });
            			logMsgCtrl.pushMsg($scope,'JobId: '+ data.data.jobId +' ，'+ data.errmsg);
                });
                // var loop = $interval(function() {
                //     $scope.progress += 20;
                //     if ($scope.progress == 100) {
                //         clearInterval(loop);
                //         $scope.running = false;
                //         $scope.$emit("job-autofill", {
                //             status: 'end'
                //         });
                //         // swal("自动录入服务模拟运行完成！", "", "success");
                //     }
                // }, 1000)
                return;
            }
        };
    }
]);
