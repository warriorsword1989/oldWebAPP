/**
 * Created by liwanchong on 2015/10/28.
 */
angular.module('app').controller("AutofillJobPanelCtrl", ['$scope', '$interval', 'dsFcc', 'dsEdit',
    function($scope, $interval, dsFcc, dsEdit) {
        $scope.tipList = [];
        $scope.selectedTips = {};
        var stages;
        if (App.Temp.mdFlag == "d") { //日编
            stages = [1, 2];
        } else { //月编
            stages = [1, 2, 3];
        }
        dsFcc.getTipsStatics(stages).then(function(data) {
            var list = [],
                tmp;
            for (var i = 0, n = data.data.rows.length; i < n; i++) {
                for (var item in data.data.rows[i]) {
                    tmp = {};
                    tmp.id = item;
                    tmp.name = fastmap.dataApi.FeatureConfig[item].name;
                    $scope.tipList.push(tmp);
                }
            }
        });
        $scope.running = false;
        $scope.progress = 0;
        $scope.doExecute = function() {
            var tips = [];
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
                swal("自动录入服务启动成功（模拟运行，服务正在调试中）！", "", "success");
                $scope.progress = 0;
                var loop = $interval(function() {
                    $scope.progress += 20;
                    if ($scope.progress == 100) {
                        clearInterval(loop);
                        $scope.running = false;
                        $scope.$emit("job-autofill", {
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